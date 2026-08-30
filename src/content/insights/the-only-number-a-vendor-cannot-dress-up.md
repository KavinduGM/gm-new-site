---
title: 'The only number a vendor cannot dress up'
description: 'Cost per piece can be produced by firing people. Output per person-hour cannot, because it only improves if volume holds. Four tests to run on any production claim, including ours.'
date: 2026-08-18
tags: ['Production economics', 'Buying advice', 'Measured results']
readingTime: 6
category: 'Buying advice'
kind: 'Article'
source: 'OAP client in the USA — production records, May to August 2026'
headline: '0.16 → 6.60'
headlineLabel: 'usable pieces per person-hour'
metaDescription: 'Cost per piece can be produced by firing people. Output per person-hour cannot. Four tests to run on any production claim, including our own.'
cover: '/insights/covers/the-only-number-a-vendor-cannot-dress-up.svg'
coverAlt: 'Six point six zero set over a bar chart of usable pieces per person-hour, rising from 0.16.'
draft: false
---

Here is a claim we could make honestly and you should still not accept: *our client's content costs 44.8% less per month than it did in May.* Every word of it is true and supported by records. It is also almost worthless as evidence, because there is a much simpler way to achieve it than building anything. You make fewer things. You make worse things. You let seven people go and hope.

Cost reduction is the easiest metric in this category to produce and therefore the weakest one to buy on. It is a subtraction, and subtraction is available to anybody.

## Output per person-hour is the number that resists this

Divide usable output by the human hours that went into it and most of the cheap tricks stop working. Cut the team and the numerator falls with the denominator. Ship less and the numerator falls faster. Ship rubbish and the numerator falls hardest of all, because output that fails review is not output.

The measure only improves if you are genuinely getting more publishable work out of each hour a person spends. On the account in [our production review](/insights/oap-client-production-review/) it moved like this:

<div class="fig">
  <div class="fig__head">
    <p class="fig__title">Usable pieces per person-hour</p>
    <p class="fig__scale">Bar length ∝ pieces/hour · max 6.60</p>
  </div>
  <div class="bars">
    <div class="bars__row">
      <span class="bars__k">May</span>
      <div class="bars__track"><div class="bars__seg bars__seg--was" style="width:2.4%"></div></div>
      <span class="bars__v">0.16</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">June</span>
      <div class="bars__track"><div class="bars__seg bars__seg--was" style="width:7%"></div></div>
      <span class="bars__v">0.46</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">July</span>
      <div class="bars__track"><div class="bars__seg" style="width:100%"></div></div>
      <span class="bars__v">6.60</span>
    </div>
    <div class="bars__row">
      <span class="bars__k">Aug</span>
      <div class="bars__track"><div class="bars__seg" style="width:100%"></div></div>
      <span class="bars__v">6.60</span>
    </div>
  </div>
  <p class="fig__note">Nine people needed 1,512 hours for 240 usable pieces. Two people now need 80 hours for 528. Volume rose 34% across the same window, which is what stops the ratio being a headcount trick.</p>
</div>

Nine people, 1,512 hours, 240 usable pieces. Two people, 80 hours, 528 usable pieces. The ratio moved 41.6× and the volume went **up** 34% while it happened, which is the only reason the ratio means anything. Had output fallen, the same headline could have been manufactured by sending everybody home.

## Four tests worth running on any claim

These are the questions we would want asked of us, and they are not hard to answer if the answer is good.

### 1. Did volume hold or rise?

An efficiency gain alongside falling output is a capacity cut described in flattering language. It is also why [the volume threshold](/who-its-for/) matters: below a certain output the ratio has nothing to work with. Ask for the absolute output figures for both periods, not the ratio. If a vendor will show you the ratio but not the volumes, you have your answer.

### 2. Is output counted before or after review?

"Pieces produced" and "pieces published" are different numbers, and the gap between them is where every unpleasant surprise lives. On the account above the gap was 40% under the human operation. A vendor quoting produced-not-published figures is quoting a number you cannot spend.

### 3. Whose hours are inside the denominator?

This is the one that gets quietly dropped. In July and August the account still had 56 long videos a month cut by hand, with their thumbnails, by the client's own editor. Those hours sit inside the 80 — on the automated side of our own comparison.

Excluding them would have been defensible on a technicality, since the system does not produce them. It would also have moved the headline from 41.6× to 74×, and we would have been reporting on a scope that no longer resembled the client's actual month. If a vendor's denominator counts only the hours their tool touched, the number is about the tool, not about your operation.

### 4. Which figures were measured and which were estimated?

Ask for the split, in writing. In the review behind this article exactly one figure is instrumented: the 5.48 kWh drawn by the automation PC, read off its own counters. The 98.5% accuracy figure comes from real approve and reject decisions. The 60% it is compared against is an internal estimate, and we say so, because the entire accuracy-adjusted comparison rests on the weaker of the two.

A vendor who cannot tell you which of their numbers are instrumented has not thought about it, and a vendor who says all of them has not either.

## Where this leaves cost per piece

Not nowhere. Cost per usable piece is still the figure that decides whether [a build pays for itself](/engagements/), and on this account it fell from $12.48 to $3.13. But it is a **consequence**, not evidence. It follows from the hours, the volume and the failure rate, and each of those three can be checked independently.

So when someone shows you a cost curve, work backwards from it. Ask for the person-hours. Ask what happened to volume. Ask where review sits in the count. If those three hold up, the cost curve is real and you did not have to take anybody's word for it.

If they do not hold up, you are looking at a subtraction with a chart around it.

The complete dataset behind this article, including the figures that weaken it, is in [the production review](/insights/oap-client-production-review/).
