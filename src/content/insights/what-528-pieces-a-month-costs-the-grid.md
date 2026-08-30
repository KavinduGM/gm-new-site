---
title: 'What 528 pieces a month costs the grid'
description: 'Four months of metered and modelled power on one content account. Nine devices drew 136 kWh a month; two draw 12. The uncomfortable part is the figure nobody can measure.'
date: 2026-08-21
tags: ['Energy', 'Measured results', 'Production economics']
readingTime: 6
category: 'Energy'
kind: 'Report'
source: 'OAP client in the USA — device roster and power records, May to August 2026'
headline: '91.1%'
headlineLabel: 'less electricity per month'
metaDescription: 'Four months of metered power on one content account. Nine devices drew 136 kWh a month; two draw 12. The hard part is the figure nobody measures.'
cover: '/insights/covers/what-528-pieces-a-month-costs-the-grid.svg'
coverAlt: 'Twelve point zero eight kilowatt-hours set over a bar chart of monthly electricity, falling from 136.'
draft: false
---

The environmental conversation about AI content is almost entirely about inference. Somebody quotes a figure for what a model call costs the grid, somebody else disputes it, and both sides argue about a number neither can check.

Meanwhile nobody counts the laptops.

We had an unusual chance to count them. The account in [our production review](/insights/oap-client-production-review/) ran on nine human-operated devices in May and on two in July, producing more content at the end than at the start. Here is the roster and what it drew.

<div class="tbl" tabindex="0" role="region" aria-label="Device roster and power, scrolls horizontally">

| Month | Devices | kWh | kg CO₂e | Per usable piece |
| --- | --- | --- | --- | --- |
| May | *9* | *136.40* | *48.42* | *202 g* |
| June | *4* | *65.23* | *23.16* | *72 g* |
| July | **2** | **12.08** | **4.29** | **8.1 g** |
| August | **2** | **12.08** | **4.29** | **8.1 g** |
| Four months | — | 225.79 | 80.16 | — |

</div>

Monthly consumption fell **91.1%**. Per usable piece it fell **24.8×**, and the extra distance between those two figures is worth pausing on: the old operation was also spending power on the 40% of its output that failed review. Electricity, like everything else, was being burned on work nobody published.

## Where the power actually was

Nine people meant nine machines, and a machine attached to a person is on for the working day whether or not it is doing anything demanding. Across May the nine averaged about 15 kWh each. The roster is ordinary — three workstations, three tablets and three desktops in May, down to one workstation, one tablet and two desktops in June — and that is the point. There was nothing exotic drawing power. There was just a lot of ordinary equipment, in an office that also had to be lit and cooled, kept awake by a shift pattern.

The two devices that replaced them are a headless PC running [the pipeline](/system/) and the client's own editing workstation, still cutting 56 long videos a month by hand. The headless PC is the only instrumented figure in the whole review: <span class="tag tag--measured">measured</span> 5.48 kWh a month, read off its own energy counters. The workstation's 6.60 kWh is <span class="tag tag--derived">modelled</span> from researched draws for that class of machine.

A pipeline that runs unattended does not need a screen, a keyboard, a chair, a room at 21°C, or nine people getting to that room. Most of the saving here is not clever. It is the removal of everything that surrounds a person doing work.

## The conversion, and what it is worth

Converted at 355 g CO₂e per kWh — the published factor for the grid these machines run on — the saving is **44.13 kg a month** against the May baseline. Extended over a year, if every month looks like this one:

<ul class="mstrip mstrip--3" role="list">
  <li class="mstrip__item">
    <span class="mstrip__k">Avoided per year</span>
    <span class="mstrip__now">530 kg</span>
    <span class="mstrip__x">CO₂e, against the May baseline</span>
  </li>
  <li class="mstrip__item">
    <span class="mstrip__k">Roughly equivalent to</span>
    <span class="mstrip__now">24 trees</span>
    <span class="mstrip__x">absorbing CO₂ for a year</span>
  </li>
  <li class="mstrip__item">
    <span class="mstrip__k">Or about</span>
    <span class="mstrip__now">3,115 km</span>
    <span class="mstrip__x">not driven in a petrol car</span>
  </li>
</ul>

Those last two are standard conversions, and standard conversions are a way of making a number feel like something rather than a way of making it more accurate. 530 kg is the figure. The trees are a translation.

We also left electricity out of the dollar comparison entirely. At commercial tariff, 136 kWh is roughly $16 a month, and it already sits inside the office overhead line in the cost records. Counting it again would have inflated the saving twice over.

## The figure we cannot give you

Here is the part that undermines the headline, which is exactly why it belongs above the fold rather than in an appendix.

**This counts grid electricity and nothing else.** It excludes:

- Commuting for nine people, five days a week
- Office lighting and air-conditioning
- The embodied carbon of manufacturing nine devices rather than two
- **The datacentre energy behind the API calls**

The first three all widen the gap in our favour, and we have not claimed them. The fourth narrows it, and we cannot size it. The providers do not publish per-call energy figures — and there are only [four of them in the whole data map](/trust/) — so any number we put there would be a guess dressed as a measurement — and a guess in our own favour would be worse than useless.

So the honest statement is this: the *on-premises* energy cost of producing 528 usable pieces a month fell 24.8× per piece, and there is an unmeasured amount of energy consumed elsewhere that we have not counted and cannot. Anyone who tells you the total figure for an AI content pipeline, in either direction, is telling you something they do not know.

What we would say with confidence is narrower and probably more useful: in a content operation of this shape, the energy was never mostly in the model. It was in the nine people, the nine machines and the room. That part we could measure, and it fell by 91%.

The full dataset, including the estimates this rests on, is in [the production review](/insights/oap-client-production-review/).
