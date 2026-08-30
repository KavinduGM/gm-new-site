#!/usr/bin/env python3
"""Extends the redactions on the /how-we-build client screenshots.

The shipped images kept a promise the page makes in copy:

    "Their document names, file paths and channel names are blurred out."

They did not. Every box below was measured at 1:1 against the source and covers
something that was legible in the clear:

  SAVE FOLDER  the blur started ~4 chars late and ended ~8 early, leaving the
               "C:\\U" drive-and-user prefix and the "ns Master Folder" tail
  STATE chips  not redacted at all — real exam/state codes in both rows
  EXAM titles  the box covered 2 of 3 lines, shipping the last line intact

Redaction is destructive (heavy pixelation, then a blur so the block edges do
not read as a mosaic that could be inverted) and is applied to the ORIGINAL in
brand-source/raster-sources/, never to an already-encoded file. Re-run and
re-run scripts/optimise-images.py after any change.

Run: python3 scripts/redact-case-shots.py && python3 scripts/optimise-images.py
"""
import os
import shutil

from PIL import Image, ImageFilter

SRC = "brand-source/raster-sources"
OUT = "public/case"

# (x0, y0, x1, y1) on the 1280x720 source.
BOXES = {
    "video-automation-hub.png": [
        # SAVE FOLDER path — starts right of the folder glyph, clears the text end.
        (338, 143, 664, 170),
        # STATE exam-code chips: covers "QA <CODE>", leaves the STATE pill and
        # "· August" so the row still reads as a row rather than as damage.
        (228, 465, 292, 486),
        (228, 604, 292, 625),
        # EXAM titles — all three lines. x starts at 482 so the column's left
        # edge stays clean; y extends past the descenders of the final line.
        (482, 437, 640, 498),
        (482, 578, 640, 640),
    ],
    "analytics-dashboard.png": [
        # Channels table, first row. The existing box was too SHORT vertically:
        # the channel's display name sat above it and its handle below it, so
        # "OAP - OA Practice" read cleanly at 6x. That is the client's channel
        # name, and "OAP" is the very abbreviation the site uses to anonymise
        # them. Extends to the bottom edge because the row is cut off there.
        (110, 660, 312, 720),
    ],
}

BLOCK = 7  # pixelation block size in source pixels


def redact(im, box):
    x0, y0, x1, y1 = box
    region = im.crop(box)
    w, h = region.size
    if w < 1 or h < 1:
        return
    small = region.resize((max(1, w // BLOCK), max(1, h // BLOCK)), Image.BILINEAR)
    region = small.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(2.2))
    im.paste(region, (x0, y0))


for name, boxes in BOXES.items():
    src = os.path.join(SRC, name)
    if not os.path.exists(src):
        print(f"  SKIP (no source) {src}")
        continue
    # Keep a pristine pre-redaction copy the first time only.
    pristine = os.path.join(SRC, name.replace(".png", ".preredaction.png"))
    if not os.path.exists(pristine):
        shutil.copy2(src, pristine)
    im = Image.open(pristine).convert("RGB")
    for b in boxes:
        redact(im, b)
    im.save(src, "PNG", optimize=True)
    print(f"  {name}: {len(boxes)} region(s) redacted -> {src}")
