#!/usr/bin/env python3
"""Heuristic static HTML/CSS audit for sites/templates. Not a WCAG certification.

Example: python3 audit_static.py ./dist --json /tmp/audit.json
No third-party dependencies. React-rendered DOM must be tested with a browser.
"""
from __future__ import annotations

import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys

IGNORED = {'node_modules', '.git', '.next', '.nuxt', 'coverage', 'vendor', '.cache'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
GENERIC_FONTS = {'inherit', 'initial', 'unset', 'serif', 'sans-serif', 'monospace', 'system-ui', 'cursive', 'fantasy', 'emoji', 'math', 'fangsong'}


def issue(level, file, message):
    return {'severity': level, 'file': str(file), 'message': message}


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = ''
        self.viewport = False
        self.description = False
        self.title = ''
        self.in_title = False
        self.main_count = 0
        self.h1 = 0
        self.ids = []
        self.images = []
        self.links = []
        self.buttons = []
        self.labels = set()
        self.inputs = []
        self.forms = []
        self._controls = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        data = {k.lower(): (v if v is not None else '') for k, v in attrs}
        if data.get('id'):
            self.ids.append(data['id'])
        if tag == 'html':
            self.lang = data.get('lang', '')
        elif tag == 'meta':
            if data.get('name', '').lower() == 'viewport':
                self.viewport = True
            if data.get('name', '').lower() == 'description' and data.get('content', '').strip():
                self.description = True
        elif tag == 'title':
            self.in_title = True
        elif tag == 'main':
            self.main_count += 1
        elif tag == 'h1':
            self.h1 += 1
        elif tag == 'img':
            self.images.append(data)
        elif tag == 'label' and data.get('for'):
            self.labels.add(data['for'])
        elif tag == 'input':
            self.inputs.append(data)
        elif tag == 'form':
            self.forms.append(data)
        if tag in ('a', 'button'):
            entry = {'tag': tag, 'attrs': data, 'text': ''}
            self._controls.append(entry)
            (self.links if tag == 'a' else self.buttons).append(entry)

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag == 'title':
            self.in_title = False
        if tag in ('a', 'button'):
            for i in range(len(self._controls) - 1, -1, -1):
                if self._controls[i]['tag'] == tag:
                    self._controls.pop(i)
                    break

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        for ctrl in self._controls:
            ctrl['text'] += data


def find_files(root, extension):
    paths = []
    for p in root.rglob(f'*{extension}'):
        if p.is_file() and not any(part in IGNORED for part in p.relative_to(root).parts):
            paths.append(p)
    return sorted(paths)


def scan_html(path, root):
    problems = []
    parser = PageParser()
    try:
        parser.feed(path.read_text(encoding='utf-8', errors='replace'))
    except Exception as exc:
        return [issue('P1', path.relative_to(root), f'Falha ao analisar HTML: {exc}')]
    rel = path.relative_to(root)
    if not parser.lang:
        problems.append(issue('P1', rel, 'html sem atributo lang'))
    if not parser.title.strip():
        problems.append(issue('P1', rel, 'title ausente ou vazio'))
    if not parser.viewport:
        problems.append(issue('P1', rel, 'meta viewport ausente'))
    if not parser.description:
        problems.append(issue('P2', rel, 'meta description ausente ou vazia'))
    if parser.main_count != 1:
        problems.append(issue('P2', rel, f'Esperado 1 landmark main; encontrado {parser.main_count}'))
    if parser.h1 != 1:
        problems.append(issue('P2', rel, f'Recomendado 1 H1 por página; encontrado {parser.h1}'))
    for ident, count in Counter(parser.ids).items():
        if count > 1:
            problems.append(issue('P1', rel, f'id duplicado: {ident!r} ({count}x)'))
    for i, img in enumerate(parser.images, 1):
        if 'alt' not in img:
            problems.append(issue('P1', rel, f'Imagem {i} sem atributo alt (use alt="" para decorativa)'))
        src = img.get('src', '').strip()
        if not src:
            problems.append(issue('P1', rel, f'Imagem {i} sem src válido'))
        elif not (src.startswith(('http:', 'https:', 'data:', '/', '#')) or src.startswith(('blob:', '${', '{'))):
            # Relative file check: one local path; bundler-created filenames need browser verification.
            clean = src.split('?', 1)[0].split('#', 1)[0]
            if clean and not (path.parent / clean).exists():
                problems.append(issue('P2', rel, f'Imagem com caminho relativo não encontrado: {src} (verificar build/bundler)'))
    for idx, ctrl in enumerate(parser.links, 1):
        attrs = ctrl['attrs']
        href = attrs.get('href', '').strip()
        if not href or href == '#' or href.lower().startswith('javascript:'):
            problems.append(issue('P1', rel, f'Link {idx} sem destino funcional: {href!r}'))
        if attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', ''):
            problems.append(issue('P2', rel, f'Link {idx} target=_blank sem rel=noopener'))
        label = ctrl['text'].strip() or attrs.get('aria-label', '').strip() or attrs.get('title', '').strip()
        if not label and 'aria-labelledby' not in attrs:
            problems.append(issue('P1', rel, f'Link {idx} sem nome acessível em HTML estático'))
    for idx, ctrl in enumerate(parser.buttons, 1):
        attrs = ctrl['attrs']
        label = ctrl['text'].strip() or attrs.get('aria-label', '').strip() or attrs.get('title', '').strip()
        if not label and 'aria-labelledby' not in attrs:
            problems.append(issue('P1', rel, f'Botão {idx} sem nome acessível em HTML estático'))
    for idx, inp in enumerate(parser.inputs, 1):
        if inp.get('type', '').lower() in {'hidden', 'submit', 'reset', 'button', 'image'}:
            continue
        has_label = bool(inp.get('aria-label') or inp.get('aria-labelledby') or inp.get('title'))
        if not has_label and (not inp.get('id') or inp['id'] not in parser.labels):
            problems.append(issue('P1', rel, f'Input {idx} sem label vinculado ou rótulo ARIA'))
    for idx, form in enumerate(parser.forms, 1):
        if not form.get('action'):
            problems.append(issue('P2', rel, f'Form {idx} sem action em HTML estático; JS pode estar configurado, testar submissão real'))
    return problems


def scan_fonts(paths, root):
    problems = []
    found = {}
    for path in paths:
        css = path.read_text(encoding='utf-8', errors='replace')
        # Remove comments, then find explicit font-family declarations.
        css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
        matches = re.findall(r'(?:^|[;{\n\r])\s*font-family\s*:\s*([^;{}]+)', css, flags=re.I)
        for item in matches:
            item = item.strip()
            if item.lower().startswith(('var(', 'inherit', 'unset', 'initial')):
                continue
            first = item.split(',')[0].strip().strip('"\'').lower()
            if first and first not in GENERIC_FONTS:
                found.setdefault(first, set()).add(str(path.relative_to(root)))
    if len(found) > 2:
        problems.append(issue('P1', 'CSS', f'Mais de 2 famílias tipográficas explícitas ({len(found)}): {", ".join(sorted(found))}; revisar se são usos efetivos'))
    return found, problems


def main(argv=None):
    parser = argparse.ArgumentParser(description='Auditoria estática heurística HTML/CSS (não certifica WCAG).')
    parser.add_argument('site', type=Path, help='Diretório do projeto ou build HTML')
    parser.add_argument('--json', dest='json_output', type=Path, help='Salvar JSON do relatório')
    args = parser.parse_args(argv)
    root = args.site.resolve()
    if not root.is_dir():
        parser.error('Passe uma pasta existente contendo o site')
    html = find_files(root, '.html')
    css = find_files(root, '.css')
    problems = []
    for page in html:
        problems.extend(scan_html(page, root))
    fonts, font_problems = scan_fonts(css, root)
    problems.extend(font_problems)
    if not html:
        problems.append(issue('INFO', '.', 'Nenhum HTML estático encontrado; para apps SPA/SSR execute QA no browser após renderização'))
    if not css:
        problems.append(issue('INFO', '.', 'Nenhum CSS encontrado; não é possível contar famílias tipográficas estáticas'))
    report = {
        'scope': str(root),
        'html_files': len(html),
        'css_files': len(css),
        'explicit_font_families': {k: sorted(v) for k, v in fonts.items()},
        'issues': problems,
        'caveat': 'Heurística para HTML/CSS estático. Não substitui browser, WCAG, testes de CTA ou QA manual.'
    }
    print(f'Auditoria estática: {len(html)} HTML / {len(css)} CSS / {len(fonts)} famílias tipográficas explícitas')
    for p in problems:
        print(f"[{p['severity']}] {p['file']}: {p['message']}")
    if not problems:
        print('Nenhum achado nesta verificação parcial; continuar com browser e QA manual.')
    if args.json_output:
        args.json_output.parent.mkdir(parents=True, exist_ok=True)
        args.json_output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'JSON salvo: {args.json_output}')
    return 1 if any(p['severity'] in {'P0', 'P1'} for p in problems) else 0


if __name__ == '__main__':
    sys.exit(main())
