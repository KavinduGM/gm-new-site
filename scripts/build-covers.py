#!/usr/bin/env python3
"""
Placeholder cover art for the insight entries.

These stand in until real covers arrive. They are deliberately typographic
rather than illustrative: the entries are measured results, and a stock photo
of a laptop would be the first dishonest thing on the page. Each cover carries
the entry's own headline figure, so it is still telling the truth even as a
placeholder.

Written as SVG so they scale to any container, cost about 2 kB each, and need
no build step. Swapping in a real JPG is a one-line change to the entry's
`cover:` front matter — nothing else has to move.

Regenerate:  python3 scripts/build-covers.py
"""

import os
import re

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'insights', 'covers')

# Ink ramp lifted from src/styles/tokens.css. Kept as literals because an SVG
# file cannot read the stylesheet, and drifting from it would be visible.
VOID = '#08070c'
PANEL = '#0d0b12'
LINE = '#1f1b29'
INK = '#f4f2f7'
INK_3 = '#8b8496'
SIGNAL = '#a06bff'
AMBER = '#ffb44d'

W, H = 1600, 800

COVERS = [
    {
        'slug': 'oap-client-production-review',
        'kind': 'Case study',
        'figure': '9 → 2',
        'unit': 'people',
        'caption': 'Four months of production records, May to August 2026',
        'accent': SIGNAL,
        # Person-hours a month. Real values, drawn to scale, unlabelled — the
        # cover is not making a claim, it is showing the shape of one.
        'series': [1512, 704, 80, 80],
    },
    {
        'slug': 'the-40-percent-you-already-paid-for',
        'kind': 'Report',
        'figure': '40%',
        'unit': 'discarded',
        'caption': 'The rework line that never reaches the cost model',
        'accent': AMBER,
        'series': [12.48, 8.48, 3.13, 3.13],  # cost per usable piece
    },
    {
        'slug': 'the-only-number-a-vendor-cannot-dress-up',
        'kind': 'Article',
        'figure': '6.60',
        'unit': 'pieces / person-hour',
        'caption': 'Four tests to run on any production claim',
        'accent': SIGNAL,
        'series': [0.16, 0.46, 6.60, 6.60],  # usable pieces per person-hour
    },
    {
        'slug': 'what-528-pieces-a-month-costs-the-grid',
        'kind': 'Report',
        'figure': '12.08',
        'unit': 'kWh / month',
        'caption': 'Metered and modelled power across nine devices, then two',
        'accent': SIGNAL,
        'series': [136.40, 65.23, 12.08, 12.08],  # kWh a month
    },
    {
        'slug': 'how-to-read-a-production-efficiency-claim',
        'kind': 'Article',
        'figure': '95.4 / 91.1',
        'unit': 'same measurement',
        'caption': 'Nine questions that decide what a number is worth',
        'accent': AMBER,
        'series': [95.4, 91.1],  # the same energy result under two scopes
    },
]


def esc(s: str) -> str:
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def cover(c: dict) -> str:
    grid = []
    for x in range(0, W + 1, 80):
        grid.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>')
    for y in range(0, H + 1, 80):
        grid.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>')

    # Corner ticks — the same console mark the panels use across the site.
    t, m = 34, 26
    ticks = []
    for cx, cy, dx, dy in ((m, m, 1, 1), (W - m, m, -1, 1),
                           (m, H - m, 1, -1), (W - m, H - m, -1, -1)):
        ticks.append(f'<path d="M{cx} {cy + dy * t}V{cy}H{cx + dx * t}"/>')

    # The figure is the only large element; everything else is metadata around
    # it, which is the same hierarchy the entries themselves use.
    fig_size = 210 if len(c['figure']) <= 6 else 150

    # The entry's own series, to scale, on the right. Unlabelled on purpose:
    # a cover should not be a chart you could misread, but leaving that half
    # of the frame empty made every cover look unfinished.
    series = c['series']
    peak = max(series)
    bw, gap = 78, 26
    span = len(series) * bw + (len(series) - 1) * gap
    bx0 = W - 150 - span
    base = H / 2 + 170
    top = H / 2 - 190
    bars = []
    for i, v in enumerate(series):
        bh = max(6.0, (v / peak) * (base - top))
        x = bx0 + i * (bw + gap)
        # Warm for the human operation, accent for the system, matching the
        # figure blocks inside the entries.
        fill = AMBER if v / peak > 0.35 else c['accent']
        bars.append(
            f'<rect x="{x:.0f}" y="{base - bh:.0f}" width="{bw}" height="{bh:.0f}" rx="3" fill="{fill}" opacity=".9"/>'
        )
    bars.append(f'<line x1="{bx0 - 20:.0f}" y1="{base:.0f}" x2="{bx0 + span + 20:.0f}" y2="{base:.0f}" stroke="{LINE}" stroke-width="2"/>')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{esc(c['kind'])}: {esc(c['caption'])}">
  <defs>
    <radialGradient id="bloom" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{c['accent']}" stop-opacity=".26"/>
      <stop offset="60%" stop-color="{c['accent']}" stop-opacity=".07"/>
      <stop offset="100%" stop-color="{c['accent']}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{PANEL}" stop-opacity="0"/>
      <stop offset="100%" stop-color="{VOID}"/>
    </linearGradient>
  </defs>

  <rect width="{W}" height="{H}" fill="{VOID}"/>
  <g stroke="{LINE}" stroke-width="1" opacity=".55">{''.join(grid)}</g>
  <ellipse cx="{W * 0.72:.0f}" cy="{H * 0.24:.0f}" rx="620" ry="420" fill="url(#bloom)"/>
  <rect width="{W}" height="{H}" fill="url(#floor)"/>
  <g stroke="{c['accent']}" stroke-width="2" fill="none" opacity=".8">{''.join(ticks)}</g>
  <g>{''.join(bars)}</g>

  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
    <circle cx="102" cy="150" r="5" fill="{c['accent']}"/>
    <text x="122" y="157" font-size="24" letter-spacing="4.5" fill="{INK_3}">{esc(c['kind'].upper())}</text>
  </g>

  <text x="96" y="{H / 2 + 78:.0f}" font-size="{fig_size}" font-weight="600"
        letter-spacing="-6"
        font-family="ui-sans-serif, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fill="{INK}">{esc(c['figure'])}</text>

  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
    <text x="100" y="{H / 2 + 132:.0f}" font-size="26" letter-spacing="3" fill="{c['accent']}">{esc(c['unit'].upper())}</text>
    <line x1="100" y1="{H - 148}" x2="{W - 100}" y2="{H - 148}" stroke="{LINE}" stroke-width="1"/>
    <text x="100" y="{H - 104}" font-size="26" letter-spacing="1" fill="{INK_3}">{esc(c['caption'])}</text>
    <text x="{W - 100}" y="{H - 104}" font-size="24" letter-spacing="3.5" text-anchor="end" fill="{INK_3}">GROOVYMARK</text>
  </g>
</svg>
'''


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    for c in COVERS:
        path = os.path.join(OUT, f"{c['slug']}.svg")
        svg = re.sub(r'\n\s+', '\n', cover(c))
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(svg)
        print(f"  {os.path.relpath(path):<58} {len(svg) / 1024:.1f} kB")


if __name__ == '__main__':
    main()
