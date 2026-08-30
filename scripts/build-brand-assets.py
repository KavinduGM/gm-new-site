#!/usr/bin/env python3
"""
Regenerate every brand asset in public/ from the two source files.

Sources live in brand-source/ and are never written to. Everything in public/
that carries the logo is derived here, so a future brand change is one command
rather than eight hand-edits that drift.

Two things this handles that are easy to get wrong by hand:

  * The supplied wordmark sits on a solid #020202 plate with no alpha. The site
    background is #08070c, so dropping it in as-is paints a visibly darker
    rectangle behind the logo — and a much more obvious one on a panel. The
    plate is removed by treating luminance as coverage and un-premultiplying,
    which recovers the true edge colour instead of leaving grey fringes.

  * apple-touch-icon is deliberately full-bleed and fully opaque. iOS applies
    its own rounded mask and composites transparency against white, so a
    pre-rounded icon with transparent corners gets a pale halo on an iPhone.

Run: python3 scripts/build-brand-assets.py
"""
from pathlib import Path

from PIL import Image, ImageDraw
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand-source"
PUB = ROOT / "public"

WORDMARK_SRC = SRC / "wordmark-source.png"
MARK_SRC = SRC / "oo-mark-source.png"

# Site tokens, so generated art matches the CSS rather than approximating it.
BG = (8, 7, 12)          # --c-bg
PLATE = (13, 11, 18)     # --c-panel
GRID = (31, 27, 41)      # measured from the previous og-default.png

# Traced from the supplied mark: each glyph is a circle with the top-left
# quadrant squared off. Fitted against the artwork at 98.78% IoU.
R_OUT, R_IN, PITCH = 205, 104, 453
MARK_W, MARK_H = 2 * PITCH + 2 * R_OUT - PITCH, 2 * R_OUT  # 862 x 410


def unpremultiply(rgb: np.ndarray) -> Image.Image:
    """Light-on-black artwork -> straight RGBA, edges intact."""
    lum = rgb.max(axis=2).astype(np.float64)
    alpha = np.clip(lum, 0, 255)
    safe = np.where(alpha > 0, alpha, 1)
    out = np.clip(rgb.astype(np.float64) * 255.0 / safe[..., None], 0, 255)
    rgba = np.dstack([out, alpha]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def build_wordmark() -> Image.Image:
    im = Image.open(WORDMARK_SRC).convert("RGB")
    a = np.asarray(im).astype(int)
    # Threshold above the plate and above the compression noise sitting on it.
    mask = a.max(axis=2) > 96
    ys, xs = np.where(mask)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    cut = np.asarray(im.crop(box)).astype(int)
    return unpremultiply(cut)


def mark_mask(size: int, width_frac: float) -> Image.Image:
    """The oo mark, rendered at 4x and downsampled so the curves stay clean."""
    ss = 4
    w = int(size * width_frac)
    h = int(round(w * MARK_H / MARK_W))
    scale = (w * ss) / MARK_W
    canvas = Image.new("L", (w * ss, h * ss), 0)
    d = ImageDraw.Draw(canvas)
    for i in (0, 1):
        ox = i * PITCH * scale
        cx, cy = ox + R_OUT * scale, R_OUT * scale
        ro, ri = R_OUT * scale, R_IN * scale
        d.ellipse([cx - ro, cy - ro, cx + ro, cy + ro], fill=255)
        d.rectangle([ox, 0, cx, cy], fill=255)
        d.ellipse([cx - ri, cy - ri, cx + ri, cy + ri], fill=0)
        d.rectangle([cx - ri, cy - ri, cx, cy], fill=0)
    return canvas.resize((w, h), Image.LANCZOS)


# The site accent, not a sample of the artwork. Sampling gave #9a7adf, which
# is 26.2 CIE76 from --c-signal #a06bff — visibly a different violet in the tab
# next to the header logo. Same principle as BG and PLATE above.
ACCENT = (0xA0, 0x6B, 0xFF)  # --c-signal


def icon(size: int, *, rounded: bool, opaque: bool, accent: tuple) -> Image.Image:
    im = Image.new("RGBA", (size, size), (*PLATE, 255) if opaque else (0, 0, 0, 0))
    if not opaque:
        plate = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(plate)
        r = int(size * 0.2009) if rounded else 0   # matches the previous icon.svg
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=(*PLATE, 255))
        im = plate
    m = mark_mask(size, 0.66)
    tint = Image.new("RGBA", m.size, (*accent, 255))
    tint.putalpha(m)
    im.alpha_composite(tint, ((size - m.width) // 2, (size - m.height) // 2))
    return im


def build_svg(accent: tuple) -> str:
    hexc = "#%02x%02x%02x" % accent
    box, inset = 896, 0.66
    w = box * inset
    scale = w / MARK_W
    h = MARK_H * scale
    x0, y0 = (box - w) / 2, (box - h) / 2

    def glyph(i: int) -> str:
        ox = x0 + i * PITCH * scale
        R, r = R_OUT * scale, R_IN * scale
        cx, cy = ox + R, y0 + R
        return (
            f"M{ox:.1f} {y0:.1f}H{cx:.1f}"
            f"A{R:.1f} {R:.1f} 0 1 1 {ox:.1f} {cy:.1f}Z"
            f"M{cx - r:.1f} {cy - r:.1f}H{cx:.1f}"
            f"A{r:.1f} {r:.1f} 0 1 1 {cx - r:.1f} {cy:.1f}Z"
        )

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box} {box}">\n'
        f'<rect width="{box}" height="{box}" rx="180" fill="#%02x%02x%02x"/>\n' % PLATE
        + f'<path fill-rule="evenodd" fill="{hexc}" d="{glyph(0)}{glyph(1)}"/>\n</svg>\n'
    )


def build_og(word: Image.Image) -> Image.Image:
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=GRID)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=GRID)
    target = int(W * 0.52)
    w = word.resize((target, int(target * word.height / word.width)), Image.LANCZOS)
    im.paste(w, ((W - w.width) // 2, (H - w.height) // 2), w)
    return im


def main() -> None:
    accent = ACCENT
    print(f"  accent: rgb{accent} (--c-signal, not sampled)")

    word = build_wordmark()
    print(f"  wordmark trimmed to {word.width}x{word.height} (ratio {word.width / word.height:.2f})")

    # 121px tall covers a 40px CSS logo at 3x DPR, which is what the header
    # asks for at its widest. Palette-encoded because straight RGBA came out at
    # 99KB for an asset on every page; 128 colours is visually lossless here
    # (mean abs error under 1) at less than a third of the bytes.
    logo_h = 121
    logo = word.resize((round(logo_h * word.width / word.height), logo_h), Image.LANCZOS)
    logo.quantize(colors=128, method=Image.FASTOCTREE).save(
        PUB / "logo.png", optimize=True
    )
    kb = (PUB / "logo.png").stat().st_size / 1024
    print(f"  public/logo.png            {logo.width}x{logo.height}  {kb:.1f} KB")

    (PUB / "icon.svg").write_text(build_svg(accent), encoding="utf-8")
    print(f"  public/icon.svg            vector, {len(build_svg(accent))} B")

    for name, size in (("icon-192.png", 192), ("icon-512.png", 512)):
        icon(size, rounded=True, opaque=False, accent=accent).save(PUB / name, optimize=True)
        print(f"  public/{name:<19} {size}x{size}  rounded, transparent corners")

    icon(180, rounded=False, opaque=True, accent=accent).save(PUB / "apple-touch-icon.png", optimize=True)
    print("  public/apple-touch-icon.png 180x180  full-bleed, opaque (iOS masks it itself)")

    ico = icon(64, rounded=True, opaque=False, accent=accent)
    ico.save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  public/favicon.ico          16 / 32 / 48")

    # Flat background, two ink colours and a grid: 64 colours is plenty, and it
    # lands smaller than the RGB original it replaces.
    build_og(word).quantize(colors=64, method=Image.FASTOCTREE).save(
        PUB / "og-default.png", optimize=True
    )
    kb = (PUB / "og-default.png").stat().st_size / 1024
    print(f"  public/og-default.png       1200x630  {kb:.1f} KB  new lockup on the 60px grid")


if __name__ == "__main__":
    main()
