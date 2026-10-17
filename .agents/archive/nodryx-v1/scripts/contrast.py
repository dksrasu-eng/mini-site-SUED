#!/usr/bin/env python3
"""Calculate WCAG 2.x contrast ratio for two opaque hex colors; stdlib only.
Usage: python3 contrast.py '#111111' '#FFFFFF'
Note: not suitable for gradients/images/alpha without compositing.
"""
import argparse
import sys


def parse_hex(value):
    value = value.strip().lstrip('#')
    if len(value) == 3:
        value = ''.join(ch * 2 for ch in value)
    if len(value) != 6 or any(ch not in '0123456789abcdefABCDEF' for ch in value):
        raise ValueError(f'Cor inválida: {value!r}; use #RGB ou #RRGGBB')
    return tuple(int(value[i:i + 2], 16) / 255 for i in (0, 2, 4))


def luminance(hex_color):
    rgb = parse_hex(hex_color)
    linear = [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in rgb]
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]


def contrast(foreground, background):
    a, b = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (a + .05) / (b + .05)


def main(argv=None):
    parser = argparse.ArgumentParser(description='Contraste WCAG para cores hex sólidas.')
    parser.add_argument('foreground', help='Cor do texto ou elemento')
    parser.add_argument('background', help='Cor do fundo')
    args = parser.parse_args(argv)
    try:
        value = contrast(args.foreground, args.background)
    except ValueError as exc:
        parser.error(str(exc))
    print(f'Contraste: {value:.3f}:1')
    print('Texto normal AA: ' + ('PASSA' if value >= 4.5 else 'FALHA'))
    print('Texto grande AA: ' + ('PASSA' if value >= 3 else 'FALHA'))
    print('Elementos não textuais essenciais (3:1): ' + ('PASSA' if value >= 3 else 'FALHA'))
    if value < 4.5:
        print('Atenção: contraste insuficiente para texto comum WCAG 2.2 AA.')
    return 0 if value >= 4.5 else 1


if __name__ == '__main__':
    sys.exit(main())
