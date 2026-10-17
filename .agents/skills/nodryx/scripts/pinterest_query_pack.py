#!/usr/bin/env python3
"""Generate *search URLs* for Pinterest. Does not access or scrape Pinterest."""
import argparse
import json
import re
from urllib.parse import quote


def query_pack(niche: str, style: str = "", locale: str = "pt-BR") -> dict:
    niche = re.sub(r"\s+", " ", niche).strip()
    style = re.sub(r"\s+", " ", style).strip()
    if not niche:
        raise ValueError("--niche é obrigatório")
    suffix = f" {style}" if style else ""
    queries = [
        f"{niche} website design{suffix}",
        f"{niche} landing page design{suffix}",
        f"{niche} hero section ui ux",
        f"{niche} website mobile design",
        f"{niche} branding website typography",
        f"{niche} editorial web design",
        f"{niche} site institucional design",
        f"{niche} inspiração layout site",
        f"{niche} creative website interactions",
        f"{niche} modern web design grid",
    ]
    entries = [{"id": f"QUERY-{i:02d}", "query": q,
                "search_url": "https://www.pinterest.com/search/pins/?q=" + quote(q, safe=""),
                "verified_pin": False} for i, q in enumerate(queries, 1)]
    return {"niche": niche, "style": style or None, "locale": locale,
            "status": "search_urls_generated_no_browsing", "items": entries}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--niche", required=True)
    parser.add_argument("--style", default="")
    parser.add_argument("--locale", default="pt-BR")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        pack = query_pack(args.niche, args.style, args.locale)
    except ValueError as exc:
        parser.error(str(exc))
    if args.json:
        print(json.dumps(pack, ensure_ascii=False, indent=2))
    else:
        print(f"NODRYX Pinterest Query Pack — {pack['niche']} (BUSCAS, não Pins vistos)")
        for entry in pack["items"]:
            print(f"{entry['id']}  {entry['query']}\n          {entry['search_url']}")

if __name__ == "__main__":
    main()
