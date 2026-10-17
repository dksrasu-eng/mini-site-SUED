#!/usr/bin/env python3
"""Offline checks for NODRYX project manifest and reference provenance."""
import argparse
import json
from pathlib import Path

VALID_VISUAL = {"inspected_pixels", "visible_in_browser", "not_verified"}
VALID_LICENSE = {"verified_with_scope", "unknown", "prohibited"}

def validate(project, refs):
    errors=[];warnings=[]
    if not project.get("niche"):
        errors.append("project.niche ausente")
    fonts=project.get("fonts",[])
    if not isinstance(fonts,list) or len(set(fonts))>2:
        errors.append("máximo duas famílias tipográficas")
    if not project.get("cta",{}).get("target"):
        errors.append("CTA sem destino; use sinalização de pendência ou configure destino")
    if not project.get("original_transformations") or len(project["original_transformations"])<3:
        errors.append("precisa de ao menos 3 transformações materiais de design")
    if project.get("pinterest_access") == "done" and not refs.get("references"):
        errors.append("Pinterest 'done' sem referências")
    for i,r in enumerate(refs.get("references",[]),1):
        prefix=f"reference[{i}]"
        status=r.get("visual_status")
        if status not in VALID_VISUAL:
            errors.append(f"{prefix}: visual_status inválido")
        if r.get("license") not in VALID_LICENSE:
            errors.append(f"{prefix}: license inválida")
        if status=="inspected_pixels" and not r.get("image_evidence"):
            errors.append(f"{prefix}: inspeção de pixels sem evidência de imagem")
        if r.get("used_as")=="licensed_final_asset" and r.get("license")!="verified_with_scope":
            errors.append(f"{prefix}: asset final sem licença confirmada")
        if not r.get("pin_url") and r.get("used_as")!="search_query_only":
            errors.append(f"{prefix}: URL do Pin não informada")
        if r.get("visual_status")=="not_verified" and r.get("observations"):
            warnings.append(f"{prefix}: observações não devem aparentar análise visual não realizada")
    if project.get("cta",{}).get("connected") is False:
        warnings.append("CTA demo não conectado: não declarar formulário operacional")
    return errors,warnings

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("project_json"); p.add_argument("references_json")
    a=p.parse_args()
    project=json.loads(Path(a.project_json).read_text(encoding="utf-8"))
    refs=json.loads(Path(a.references_json).read_text(encoding="utf-8"))
    errors,warnings=validate(project,refs)
    for e in errors: print("FAIL:",e)
    for w in warnings: print("WARN:",w)
    print("PASS: estrutura de projeto verificada" if not errors else "FAIL: projeto inválido")
    raise SystemExit(1 if errors else 0)
