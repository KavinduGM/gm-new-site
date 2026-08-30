---
title: 'Nine people to two, and output went up'
description: 'Four months of measured production on one account: nine people on nine devices became two people on two devices, monthly usable output more than doubled, and cost per usable piece fell 3.99×.'
date: 2026-08-12
tags: ['Case study', 'Production economics', 'Measured results', 'Video']
readingTime: 11
category: 'Case study'
kind: 'Case study'
source: 'OAP client in the USA — production records, May to August 2026'
headline: '3.99×'
headlineLabel: 'cheaper per usable piece'
featured: true
metaDescription: 'Four months of measured production on one account: nine people became two, usable output more than doubled, cost per usable piece fell 3.99×.'
cover: '/insights/covers/oap-client-production-review.svg'
coverAlt: 'Nine falling to two over a bar chart of monthly person-hours, dropping from 1,512 to 80.'
draft: false
---

Most efficiency claims in this market have no before. A vendor arrives after the fact, measures the system they sold you, and compares it against a number somebody remembered. We have the before on this account because we ran it: nine people producing content by hand for an online assessment platform in the USA, on our own payroll, for months, until we built [the pipeline](/system/) that replaced most of that work.

This is what four months of records say. May is the full nine-person operation. June is the transition. July and August are the system running. Every figure below comes from cost records, output counts and review decisions on that one account, and the [figures that are estimates rather than measurements](#what-is-measured-and-what-is-not) are named as such at the end.

<ul class="mstrip mstrip--4" role="list">
  <li class="mstrip__item">
    <span class="mstrip__k">Cost per usable piece</span>
    <span class="mstrip__was">was $12.48</span>
    <span class="mstrip__now">$3.13</span>
    <span class="mstrip__x">3.99× cheaper</span>
  </li>
  <li class="mstrip__item">
    <span class="mstrip__k">Human time per usable piece</span>
    <span class="mstrip__was">was 6 h 18 m</span>
    <span class="mstrip__now">9.1 min</span>
    <span class="mstrip__x">41.6× faster</span>
  </li>
  <li class="mstrip__item">
    <span class="mstrip__k">Right first time</span>
    <span class="mstrip__was">was 60%</span>
    <span class="mstrip__now">98.5%</span>
    <span class="mstrip__x">+38.5 points</span>
  </li>
  <li class="mstrip__item">
    <span class="mstrip__k">Carbon per usable piece</span>
    <span class="mstrip__was">was 202 g</span>
    <span class="mstrip__now">8.1 g</span>
    <span class="mstrip__x">24.8× lower</span>
  </li>
</ul>

## The account

The client runs an online assessment platform. The content brief is unglamorous and relentless: long explainer videos on the platform's subject matter, short vertical cuts pulled from them, and community posts to carry both into the feeds. The ratio held remarkably steady for all four months — roughly one long video to 4.3 shorts and 4.3 post sets — which is what makes month-to-month comparison worth anything.

<div class="tbl" tabindex="0" role="region" aria-label="Output by type, scrolls horizontally">

| Pieces produced | May | June | July | August | Total |
| --- | --- | --- | --- | --- | --- |
| Long videos | 40 | 56 | 56 | 56 | 208 |
| Short videos | 180 | 240 | 240 | 240 | 900 |
| Community posts | 180 | 240 | 240 | 240 | 900 |
| **Total produced** | *400* | *536* | **536** | **536** | 2,008 |

</div>

Volume rose 34% between May and June and then held flat. If that were the whole story it would be a modest one. It is not the story, because in May and June **four pieces in ten were thrown away**.

## The number nobody reports

Right first time was 60% under the human operation. Not 60% of the work was bad — 60% cleared review without going back. The other 40% was scripted, voiced, cut, reviewed, rejected, and either reworked or binned. It was paid for at full price either way.

Under the system, right first time is 98.5%. That figure is not an opinion: it comes from actual approve and reject decisions on finished deliverables — the [review gates](/how-we-build/) every run has to clear before anything reaches a queue.

<div class="fig">
  <div class="fig__head">
    <p class="fig__title">Pieces produced, split by what cleared review</p>
    <p class="fig__scale">Bar length ∝ pieces · max 536</p>
  </div>
  <div class="bars">
    <div class="bars__row">
      <span class="bars__k">May</span>
      <div class="bars__track">
        <div class="bars__seg bars__seg--was" style="width:44.8%"></div>
        <div class="bars__seg bars__seg--waste" style="width:29.9%"></div>
      </div>
      <span class="bars__v">240 of 400</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">June</span>
      <div class="bars__track">
        <div class="bars__seg bars__seg--was" style="width:60%"></div>
        <div class="bars__seg bars__seg--waste" style="width:40%"></div>
      </div>
      <span class="bars__v">322 of 536</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">July</span>
      <div class="bars__track">
        <div class="bars__seg" style="width:98.5%"></div>
        <div class="bars__seg bars__seg--waste" style="width:1.5%"></div>
      </div>
      <span class="bars__v">528 of 536</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">Aug</span>
      <div class="bars__track">
        <div class="bars__seg" style="width:98.5%"></div>
        <div class="bars__seg bars__seg--waste" style="width:1.5%"></div>
      </div>
      <span class="bars__v">528 of 536</span>
    </div>
  </div>
  <p class="fig__note">Every piece is weighted equally here — a long video counts the same as a community post. Crude, but the production ratio held all four months, so the months stay comparable.</p>
</div>

Counting only what survived review, monthly usable output went from 240 to 528. **It more than doubled while the team shrank by seven people.** Every cost figure in this case study is priced per *usable* piece for that reason. Reporting cost per piece produced and accuracy separately lets a reader quietly forget to multiply them together, and the whole argument lives in the multiplication.

## Where the money went

Total spend across the four months was **$9,028.65**. Salaries and premises took two thirds of it. The AI tooling that replaced most of that work took under a third.

<div class="tbl" tabindex="0" role="region" aria-label="Cost per month, scrolls horizontally">

| Cost | May | June | July | August | May → now |
| --- | --- | --- | --- | --- | --- |
| Monthly cost | *$2,995.71* | *$2,725.94* | **$1,653.50** | **$1,653.50** | 44.8% less |
| Per piece produced | *$7.49* | *$5.09* | **$3.08** | **$3.08** | 2.43× cheaper |
| Per **usable** piece | *$12.48* | *$8.48* | **$3.13** | **$3.13** | 3.99× cheaper |
| Per long-video cluster | *$74.89* | *$48.68* | **$29.53** | **$29.53** | 2.54× cheaper |

</div>

The gap between the two middle rows is the whole point. Flat cost per piece produced fell 2.43×, which is a decent result and the number most vendors would print. Cost per piece you can actually publish fell **3.99×**, because the old operation was also paying to make the 40% it threw away.

Because the production ratio held, each long video anchors a cluster of roughly nine other pieces. A cluster cost $74.89 to make in May and costs $29.53 now — while clusters per month rose from 40 to 56.

## The measure that survives scrutiny

Cost per piece can always be dismissed as the result of a smaller payroll, and on this account that dismissal has real force: most of the saving did come from headcount. Output per person-hour cannot be dismissed the same way, because volume went **up** at the same time.

Nine people needed 1,512 hours to produce 240 usable pieces. Two people now need 80 hours to produce 528.

<div class="fig">
  <div class="fig__head">
    <p class="fig__title">Person-hours consumed per month</p>
    <p class="fig__scale">8-hour days · max 1,512 h</p>
  </div>
  <div class="bars">
    <div class="bars__row">
      <span class="bars__k">May</span>
      <div class="bars__track"><div class="bars__seg bars__seg--was" style="width:100%"></div></div>
      <span class="bars__v">1,512 h</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">June</span>
      <div class="bars__track"><div class="bars__seg bars__seg--was" style="width:46.6%"></div></div>
      <span class="bars__v">704 h</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">July</span>
      <div class="bars__track"><div class="bars__seg" style="width:5.3%"></div></div>
      <span class="bars__v">80 h</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">Aug</span>
      <div class="bars__track"><div class="bars__seg" style="width:5.3%"></div></div>
      <span class="bars__v">80 h</span>
    </div>
  </div>
  <p class="fig__note">The two people in July and August are the operator running the pipeline and the client's own editor producing long videos. The client's hours are counted against our result deliberately — leaving them out would report 74× instead of 41.6×, and would not be a like-for-like comparison.</p>
</div>

That last note matters more than the headline. **The system does not make the long videos.** Those 56 a month are still cut by hand, along with their thumbnails, and every hour of that work is counted on the automated side of this comparison. The figures below would all look better if we excluded it. They would also be worthless.

<div class="tbl" tabindex="0" role="region" aria-label="People and time, scrolls horizontally">

| People and time | May | June | July | August | May → now |
| --- | --- | --- | --- | --- | --- |
| People | *9* | *4* | **2** | **2** | 7 fewer |
| Devices | *9* | *4* | **2** | **2** | 7 fewer |
| Calendar days used | *21* | *22* | **5** | **5** | 4.2× faster |
| Person-hours | *1,512* | *704* | **80** | **80** | 18.9× fewer |
| Time per usable piece | *378 min* | *131 min* | **9.1 min** | **9.1 min** | 41.6× faster |
| Usable pieces per person-hour | *0.16* | *0.46* | **6.60** | **6.60** | 41.6× more |

</div>

Calendar time collapsed alongside it. A month's output took 21 working days in May and takes **5 days** now, because the pipeline runs unattended overnight and at weekends and is not bound to a shift pattern.

## Nine devices drawing power, or two

The device roster is the part of this that surprised the client. Nine people meant nine machines: three workstations, three tablets, three desktops, all drawing power through a working month, in an office that also had to be lit and cooled. The system runs on one headless PC, alongside the client's own editing workstation.

<div class="tbl" tabindex="0" role="region" aria-label="Devices and power, scrolls horizontally">

| Energy | May | June | July | August | May → now |
| --- | --- | --- | --- | --- | --- |
| Devices | *9* | *4* | **2** | **2** | 7 fewer |
| Electricity | *136.40 kWh* | *65.23 kWh* | **12.08 kWh** | **12.08 kWh** | 91.1% less |
| Carbon | *48.42 kg* | *23.16 kg* | **4.29 kg** | **4.29 kg** | 44.13 kg saved |
| Per usable piece | *202 g* | *72 g* | **8.1 g** | **8.1 g** | 24.8× less |

</div>

Monthly consumption fell 91.1%. Per usable piece it fell 24.8×, and the extra distance between those two numbers is the discarded 40% again: the old setup spent power on work nobody ever saw. Converted at 355 g CO₂e per kWh, the saving is 44.13 kg a month, or **530 kg a year** if every month looks like this one.

Only one figure in this entire review is instrumented: the <span class="tag tag--measured">measured</span> 5.48 kWh drawn by the automation PC, read off its own energy counters. Every workstation, desktop and tablet draw is a researched average. That distinction is set out in full below, and it matters more than any multiplier on this page.

## What is measured, and what is not

<ol class="caveats">
  <li><strong>The 60% accuracy figure is an internal estimate.</strong> The 98.5% comes from real approve and reject decisions on finished work. The two are not measured the same way, and the accuracy-adjusted comparison rests on the weaker of them.</li>
  <li><strong>The adjustment assumes discarded work, not rework.</strong> If the team absorbed its rework inside the same month and the same salaries, cost per usable piece overstates the money gap and May's true figure sits somewhere between $7.49 and $12.48. The time figures hold either way, because rework hours are already inside the 1,512.</li>
  <li><strong>July and August are averaged.</strong> Some August content was produced during July, so the dates costs were recorded against do not match production. Recorded totals were $2,074.63 and $1,232.37; this review uses $1,653.50 for each.</li>
  <li><strong>August carries an $80 allowance</strong> for spend expected before month end, because the month was still running when the figures were taken.</li>
  <li><strong>Payroll and premises were recorded in local currency</strong> and converted at one fixed rate for all four months. That rate swung about 8% across the 90 days before the figures were taken, so those conversions carry a few percent either way.</li>
  <li><strong>Only the automation PC's power is metered.</strong> June's 65.23 kWh applies researched draws to a reduced headcount — it was never measured. July's figure is assumed equal to August's, which is reasonable at identical output volume but is still an assumption.</li>
  <li><strong>Carbon covers grid electricity only.</strong> It excludes commuting for nine people, office lighting and cooling, the embodied carbon of nine devices against two, and the datacentre energy behind the API calls. The first three widen the gap. The last narrows it, is not published by the providers, and is left out rather than guessed at.</li>
  <li><strong>All pieces are weighted equally.</strong> A long video counts the same as a community post. The ratio held across all four months so the comparison is sound, but absolute per-piece cost is a blunt instrument.</li>
  <li><strong>Most of the saving came from headcount, not tooling.</strong> The honest reading is that the pipeline made a smaller team viable at higher volume — not that tooling alone produced the saving. The current $3.13 assumes output holds at 536 a month without the old team.</li>
</ol>

## What this does and does not prove

It proves that on one account, over four months, a custom pipeline let two people out-produce nine at better quality, and that the arithmetic holds up when you count the client's own hours against it and price the waste in.

It does not prove your account will move the same distance. This client had an unusually stable content ratio, a subject matter that rewards repetition, and a team willing to be measured honestly on the way down. A brand producing twelve bespoke pieces a month with a new creative direction each time has a different problem, and we would tell you so on the call — [the volume this is built for](/who-its-for/) starts higher than that.

Whether a build pays for itself at your size, or whether [running it on ours](/engagements/) is the cheaper answer, is a separate and much shorter conversation. What this review does establish is the shape of the question worth asking any vendor, including us: not *what does a piece cost*, but *what does a piece you can actually publish cost, how many person-hours went into it, and which of those numbers did you measure rather than estimate*.
