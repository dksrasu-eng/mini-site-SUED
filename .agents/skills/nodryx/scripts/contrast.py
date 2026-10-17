#!/usr/bin/env python3
"""Calculate WCAG contrast between two RGB hex colors (#RGB or #RRGGBB)."""
import argparse
import re

def rgb(hex_color):
    color = hex_color.lstrip("#")
    if not re.fullmatch(r"(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})", color):
        raise ValueError("Cor inválida: use #RGB ou #RRGGBB")
    if len(color) == 3:
        color = "".join(c * 2 for c in color)
    return [int(color[i:i+2], 16) / 255 for i in (0,2,4)]

def luminance(hex_color):
    channels = [v / 12.92 if v <= 0.04045 else ((v+0.055)/1.055)**2.4 for v in rgb(hex_color)]
    return sum(a*b for a,b in zip(channels, [0.2126, 0.7152, 0.0722]))

def contrast(a,b):
    x,y=sorted((luminance(a), luminance(b)), reverse=True)
    return (x+0.05)/(y+0.05)

if __name__ == "__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("foreground");p.add_argument("background")
    v=p.parse_args()
    try:
        ratio=contrast(v.foreground,v.background)
    except ValueError as e:
        p.error(str(e))
    print(f"Contrast {v.foreground} / {v.background}: {ratio:.2f}:1 | AA normal: {ratio>=4.5} | AA large: {ratio>=3.0}")
