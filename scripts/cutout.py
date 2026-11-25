#!/usr/bin/env python3
"""Cuts a drawn-on-a-photo scene out of its white studio background.

    python3 scripts/cutout.py <in.webp> <out.webp> [--white 249] [--shadow 165]

The background is whatever near-white (and, below it, soft grey shadow) can be reached from the image's
corners. It becomes transparent, the shadow becomes a transparent dark shadow, and edge pixels that
were a mix of ink and white are un-mixed so no pale fringe is left. Whites enclosed by the drawing's
outline (the character's fill, paper, photo borders) are kept. Needs Pillow.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

def cut(src, dst, white=249, shadow=165):
    im = Image.open(src).convert('RGB'); W, H = im.size; px = im.load()
    cand = Image.new('L', (W + 2, H + 2), 255); cp = cand.load()
    for y in range(H):
        for x in range(W):
            r, g, b = px[x, y]; lo = min(r, g, b); s = max(r, g, b) - lo
            cp[x + 1, y + 1] = 255 if (lo >= white and s < 8) or (lo >= shadow and s < 10 and lo < white) else 0
    ImageDraw.floodfill(cand, (0, 0), 128, thresh=0)
    bg = Image.new('L', (W, H), 0); bp = bg.load()
    for y in range(H):
        for x in range(W):
            if cp[x + 1, y + 1] == 128: bp[x, y] = 255
    d1 = bg.filter(ImageFilter.MaxFilter(3)).load(); d2 = bg.filter(ImageFilter.MaxFilter(5)).load()
    out = Image.new('RGBA', (W, H)); op = out.load()
    for y in range(H):
        for x in range(W):
            r, g, b = px[x, y]
            if bp[x, y]:
                v = (r + g + b) // 3; op[x, y] = (20, 18, 18, max(0, min(255, int((252 - v) * 1.15)))); continue
            if d2[x, y]:
                lo = min(r, g, b); s = max(r, g, b) - lo
                if lo > 150 and s >= 18:
                    a = 1 - lo / 255.0
                    op[x, y] = tuple(max(0, min(255, int(round((c - (1 - a) * 255) / a)))) for c in (r, g, b)) + (int(round(a * 255)),); continue
                if d1[x, y] and lo > 215: op[x, y] = (r, g, b, max(0, int((255 - lo) * 3))); continue
            op[x, y] = (r, g, b, 255)
    box = out.getbbox(); out = out.crop(box); out.save(dst, quality=92, method=6)
    return out

if __name__ == '__main__':
    a = sys.argv[1:]; kw = {}
    for k in ('white', 'shadow'):
        if f'--{k}' in a: i = a.index(f'--{k}'); kw[k] = int(a[i + 1]); del a[i:i + 2]
    print(cut(a[0], a[1], **kw).size)
