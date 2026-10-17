"""Use: python3 -m unittest discover -s tests -v"""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / 'scripts'))
from contrast import contrast, parse_hex  # noqa: E402
from audit_static import scan_fonts, scan_html  # noqa: E402


class AuditTests(unittest.TestCase):
    def test_contrast(self):
        self.assertAlmostEqual(contrast('#fff', '#000'), 21, places=6)
        self.assertAlmostEqual(contrast('#777777', '#ffffff'), 4.478, delta=.02)
        with self.assertRaises(ValueError):
            parse_hex('not-a-color')

    def test_basic_html_pass(self):
        markup = '''<!doctype html><html lang="pt-BR"><head><title>Teste</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="description" content="Meu produto"></head><body>
        <main><h1>Teste do site</h1><a href="/contato">Entre em contato</a>
        <img src="https://example.com/test.png" alt="Descrição da imagem">
        <form action="/api/contato"><label for="email">Seu e-mail</label>
        <input id="email" name="email" type="email"><button type="submit">Enviar</button></form>
        </main></body></html>'''
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / 'index.html').write_text(markup, encoding='utf-8')
            self.assertEqual(scan_html(root / 'index.html', root), [])

    def test_broken_html_flags(self):
        markup = '<html><head><title></title></head><body><a href="#"> </a><img src="a.png"><input id="email"></body></html>'
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / 'index.html').write_text(markup)
            issues = scan_html(root / 'index.html', root)
            message = ' '.join(i['message'] for i in issues)
            for expected in ['lang', 'viewport', 'alt', 'destino funcional', 'Input 1']:
                self.assertIn(expected, message)

    def test_font_limit(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            css = root / 'style.css'
            css.write_text('h1 { font-family: "Space Grotesk", sans-serif } p {font-family: Inter, sans-serif;} blockquote {font-family: Georgia, serif;}', encoding='utf-8')
            fonts, issues = scan_fonts([css], root)
            self.assertEqual(len(fonts), 3)
            self.assertTrue(any(i['severity'] == 'P1' for i in issues))


if __name__ == '__main__':
    unittest.main()
