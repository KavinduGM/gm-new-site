"""Unify supplied client logos into one monochrome set for a dark page.

Sources are 500x500 tiles with a solid background. Two wrinkles handled here:
  * one tile is a dark square inset on white, so keying off the corners leaves a
    solid block — detected by fill ratio and re-keyed against the inner colour;
  * source contrast varies wildly, so each logo's density is normalised or the
    pastel marks read as ghosts next to the black ones.
"""

# WITHHELD: the OA Exams artwork (was 2.png / 2.webp) has been moved to
# brand-source/withheld-client-logos/. That account is the one the /insights
# case study is built on, and the site names it only as "OAP client in the
# USA". Do not put it back in public/client-logos/ — regenerating would return
# it to the wall and identify the client.

import os, numpy as np
from PIL import Image

# Sources moved into brand-source/ when public/ was trimmed; this still pointed
# at the old path and crashed immediately, despite logos.mjs naming it as the
# regeneration route.
SRC, OUT = 'brand-source/client-logo-sources/client-logos', 'public/logos'
INK, BOX = (237, 239, 241), (300, 92)
os.makedirs(OUT, exist_ok=True)

def key(rgb, src_a, bg):
    dist = np.abs(rgb - bg).max(axis=-1) / 255.0
    out = np.clip(np.power(dist, 0.7), 0, 1) * (src_a / 255.0)
    # Floor the residue. 17.png left 69% of its pixels at alpha 1-20 over a
    # near-white plate, which composited to rgb(14,13,19) on a rgb(8,7,12)
    # background — a visibly lighter rectangle behind that one mark.
    out[out < 0.08] = 0.0
    return out

rows = []
# 2 is deliberately withheld (see the note above), so its source is absent and
# the old range crashed on the second iteration.
for n in [i for i in range(1, 21) if i != 2]:
    im = Image.open(f'{SRC}/{n}.png').convert('RGBA')
    a = np.asarray(im).astype(np.float32)
    rgb, src_a = a[..., :3], a[..., 3]

    k = 12
    corners = np.concatenate([rgb[:k, :k].reshape(-1, 3), rgb[:k, -k:].reshape(-1, 3),
                              rgb[-k:, :k].reshape(-1, 3), rgb[-k:, -k:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    alpha = key(rgb, src_a, bg)

    # Fill ratio inside the mark's bounds. A near-solid result means we keyed
    # the wrong side of an inset tile.
    ys, xs = np.where(alpha > 0.05)
    fill = 0.0
    flipped = False
    if len(ys):
        crop = alpha[ys.min():ys.max()+1, xs.min():xs.max()+1]
        fill = float((crop > 0.5).mean())
        if fill > 0.55:
            # A logo that is itself a solid tile with the mark knocked out.
            # Three things bite here: the tile mask has holes exactly where the
            # mark is (so it must be hole-filled before use), the tile carries a
            # gradient (so luminance keying beats colour keying), and its
            # anti-aliased rim survives as an outline unless eroded.
            from PIL import ImageFilter, ImageDraw
            m = Image.fromarray(((alpha > 0.5) * 255).astype(np.uint8), 'L')
            inv = Image.eval(m, lambda v: 255 - v)
            ImageDraw.floodfill(inv, (0, 0), 128)          # mark true outside
            holes = np.asarray(inv) == 255                  # interior only
            filled = (np.asarray(m) > 127) | holes
            filled = np.asarray(
                Image.fromarray((filled * 255).astype(np.uint8), 'L')
                .filter(ImageFilter.MinFilter(11))) > 127   # drop the rim
            lum = (0.2126*rgb[...,0] + 0.7152*rgb[...,1] + 0.0722*rgb[...,2]) / 255.0
            alpha = np.clip((lum - 0.55) / 0.30, 0, 1) * filled * (src_a / 255.0)
            flipped = True

    # Normalise density so every logo carries the same visual weight.
    vis = alpha[alpha > 0.02]
    if vis.size:
        p = np.percentile(vis, 96)
        if p > 0.05:
            alpha = np.clip(alpha / p, 0, 1)

    out = np.zeros_like(a)
    out[..., 0], out[..., 1], out[..., 2] = INK
    out[..., 3] = alpha * 255
    im2 = Image.fromarray(out.astype(np.uint8), 'RGBA')

    bbox = im2.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
    if bbox: im2 = im2.crop(bbox)
    w, h = im2.size
    s = min(BOX[0]/w, BOX[1]/h)
    im2 = im2.resize((max(1, round(w*s)), max(1, round(h*s))), Image.LANCZOS)
    im2.save(f'{OUT}/{n}.webp', 'WEBP', lossless=True, quality=100, method=6)
    rows.append((n, fill, flipped, im2.size, os.path.getsize(f'{OUT}/{n}.webp')))

print(f"{'logo':5} {'fill':>5} {'re-keyed':9} {'size':11} {'bytes':>7}")
for n, fill, fl, size, b in rows:
    print(f"{n:<5} {fill:5.2f} {'YES' if fl else '-':9} {size[0]:>3}x{size[1]:<7} {b:>7}")
tot = sum(r[4] for r in rows)
src = sum(os.path.getsize(f'{SRC}/{i}.png') for i in range(1, 21) if i != 2)
print(f"\n  {src/1024:.0f} KB → {tot/1024:.0f} KB ({100-tot/src*100:.0f}% smaller)")
