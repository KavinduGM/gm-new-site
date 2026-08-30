#!/usr/bin/env python3
"""Re-encodes the home page's oversized raster assets.

Each entry was sized by measuring the element in a real browser at dpr=2 and
allowing headroom for the largest clamp() the CSS can reach, rather than by
guessing. Sources are kept in brand-source/ so this can be re-run.

Run: python3 scripts/optimise-images.py
"""
import os
import shutil
from PIL import Image

SRC_KEEP = "brand-source/raster-sources"

# (path, target_width, mode, quality)
#  'lossy'    → WebP q82, for photographic / screenshot content
#  'lossless' → WebP lossless, for flat brand artwork where banding would show
JOBS = [
    # Measured in a real browser at every breakpoint, not guessed. The peak is
    # 490 CSS px at a 735px viewport, where .cmp__trio is still the scroll-snap
    # flex track at `flex: 0 0 72%`; above 46em it becomes a 3-up grid and drops
    # to ~210. 864 covers a 430px 3x phone (280 css x 3 = 840), which is the
    # widest *real device* case. A first pass at 640 was an upscale on tablets.
    ("public/compare/posts/human-1.png", 864, "lossy", 82),
    ("public/compare/posts/human-2.png", 864, "lossy", 82),
    ("public/compare/posts/human-3.png", 864, "lossy", 82),
    ("public/compare/posts/system-1.png", 864, "lossy", 82),
    ("public/compare/posts/system-2.png", 864, "lossy", 82),
    ("public/compare/posts/system-3.png", 864, "lossy", 82),
    # public/logo.png is NOT listed here. scripts/build-brand-assets.py owns it,
    # generating it from brand-source/wordmark-source.png. This script kept a
    # preserved copy of the OLD 896x169 lockup and would have re-encoded that
    # over the new logo the next time anyone ran it — two scripts writing one
    # file is the bug, so only one of them does now.
    # Video frame measured at most 262x465 CSS px; 640 wide covers 3x phones.
    ("public/compare/human-poster.jpg", 640, "lossy", 80),
    ("public/compare/system-poster.jpg", 640, "lossy", 80),
    # /how-we-build product screenshots. Target 1280 = the source width, i.e.
    # NO resize: measured, they render up to 691 CSS px (single column at a
    # 768px viewport), which needs 1382px at 2x — so 1280 is already slightly
    # under-provisioned and downscaling would be the wrong move. Format is the
    # only win here. q82 measured 40.7 dB PSNR on the text-dense region, well
    # inside visually-lossless, and they display downscaled ~2x regardless.
    ("public/case/video-automation-hub.png", 1280, "lossy", 82),
    ("public/case/analytics-dashboard.png", 1280, "lossy", 82),
]

os.makedirs(SRC_KEEP, exist_ok=True)
total_before = total_after = 0

for path, target_w, mode, q in JOBS:
    stem, _ = os.path.splitext(path)
    out = stem + ".webp"
    keep = os.path.join(SRC_KEEP, os.path.basename(path))

    # Preserve the original once, so re-running never re-encodes an already
    # lossy file. After the first run the original is gone from public/ and the
    # copy in brand-source/ is the only source of truth — read from it.
    if os.path.exists(path) and not os.path.exists(keep):
        shutil.copy2(path, keep)
    if not os.path.exists(keep):
        print(f"  SKIP (no source) {path}")
        continue
    before = os.path.getsize(keep)

    im = Image.open(keep)
    im = im.convert("RGBA" if "A" in im.getbands() or im.mode == "P" else "RGB")
    if im.width > target_w:
        h = round(im.height * target_w / im.width)
        im = im.resize((target_w, h), Image.LANCZOS)

    # Try both encoders and keep the smaller file. Flat UI screenshots (the
    # "system" posts) are mostly large areas of one colour, where lossless WebP
    # beats q82 outright; photographic frames go the other way. Guessing per
    # file by eye was how two of these came out LARGER than their PNG source.
    cand = {}
    im.save(stem + ".ll.webp", "WEBP", lossless=True, method=6)
    cand["webp-lossless"] = stem + ".ll.webp"
    if mode != "lossless":
        im.save(stem + ".ly.webp", "WEBP", quality=q, method=6)
        cand["webp-lossy"] = stem + ".ly.webp"
    # A resized, palette-quantised PNG is a real contender for flat UI
    # screenshots. quantize() only accepts FASTOCTREE for RGBA, so pick the
    # method by band rather than assuming.
    png_try = stem + ".try.png"
    meth = Image.FASTOCTREE if im.mode == "RGBA" else Image.MAXCOVERAGE
    im.quantize(colors=256, method=meth).save(png_try, "PNG", optimize=True)
    cand["png-256"] = png_try

    chosen = min(cand, key=lambda k: os.path.getsize(cand[k]))
    best_size = os.path.getsize(cand[chosen])

    # If nothing beats the original by a worthwhile margin, keep the original
    # untouched. LANCZOS resampling turns flat artwork into gradients, so a
    # re-encode can genuinely be larger — and shipping a needlessly re-encoded
    # file costs quality for nothing.
    if best_size >= before * 0.9:
        for v in cand.values():
            if os.path.exists(v):
                os.remove(v)
        if not os.path.exists(path):
            shutil.copy2(keep, path)
        print(f"  {os.path.basename(path):<20} {before:>7,} B  kept as-is "
              f"(best candidate {best_size:,} B was no better)")
        total_before += before
        total_after += before
        continue

    ext = ".png" if chosen == "png-256" else ".webp"
    out = stem + ext
    shutil.move(cand[chosen], out)
    for v in cand.values():
        if os.path.exists(v):
            os.remove(v)

    after = os.path.getsize(out)
    total_before += before
    total_after += after
    if out != path and os.path.exists(path):
        os.remove(path)
    print(f"  {os.path.basename(path):<20} {before:>7,} -> {after:>7,} B "
          f"({100 - after * 100 // before:>3}% smaller)  {im.width}x{im.height}  [{chosen}]")

print(f"\n  total {total_before:,} -> {total_after:,} B "
      f"({(total_before - total_after) / 1024:.0f} KB saved)")
