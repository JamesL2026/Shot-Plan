# ShotPlan Case Study

Portfolio narrative for ShotPlan as a sequence of product experiments.  
In-app mirror: [/case-study](https://shot-plan-pi.vercel.app/case-study)

> Feedback tables below are **placeholders** unless a real note is pasted. Do not fabricate quotes.

---

## Problem

What I originally thought existed:

Golfers finish a round frustrated, then waste range time because they do not know **what to practice next**.

What later research suggested:

Many golfers already know their obvious misses. The harder job may be noticing what *repeats* across real rounds — not finding another drill.

---

## How ShotPlan Evolved

```
Practice Coach
    ↓
User Research
    ↓
Quick Baseline
    ↓
Self Testing
    ↓
Round Review
```

Round Review is the **next** experiment. It is not built yet.

### Practice Coach → User Research

| | |
|---|---|
| **What I believed** | Golfers don’t know what to practice after a bad round. |
| **What I built** | Check-in on a miss, then a guided coaching session with drills, cues, and Round Ready. |
| **What users or testing revealed** | Drills can structure practice, but many golfers already know their common misses. Another drill is often not new value. |
| **What changed** | Treat V1 as an experiment that informed the next test, not as the final product. |

### User Research → Quick Baseline

| | |
|---|---|
| **What I believed** | An objective 15-shot snapshot would show which skill deserves practice. |
| **What I built** | Quick Baseline: driver, iron, wedge, lag putting, short putting — then a ShotPlan Profile. |
| **What users or testing revealed** | The test works, but a poor iron score often restates what the golfer just felt over those three shots. |
| **What changed** | Measurement without a sufficiently new insight may not be enough to keep building in that direction. |

### Quick Baseline → Self Testing → Round Review

| | |
|---|---|
| **What I believed** | If category scores are not new enough, golfers may get more from capturing meaningful mistakes in real rounds. |
| **What I built** | Nothing for Round Review yet. V2 is frozen first. |
| **What users or testing revealed** | Early qualitative themes (below) point toward recurring patterns, not more isolated scores. |
| **What changed** | Next experiment: track mistakes, not every shot. Hypothesis not validated. |

---

## Version 1 — Practice Coach

**Check in → Coach Brief → Guided challenges → Round Ready**

Curated drills, diagrams, real-setup photos, a calm coaching voice, journal, library, and beta feedback — without accounts or video.

### Screenshot placeholders

| Screen | Placeholder |
|--------|-------------|
| Home | `[Add screenshot: docs/screenshots/v1-home.png]` |
| Check-In | `[Add screenshot: docs/screenshots/v1-check-in.png]` |
| Coach Brief | `[Add screenshot: docs/screenshots/v1-coach-brief.png]` |
| Practice Challenge | `[Add screenshot: docs/screenshots/v1-practice-challenge.png]` |
| Round Ready | `[Add screenshot: docs/screenshots/v1-round-ready.png]` |

---

## Version 2 — Quick Baseline

**15 shots. Five skills. A ShotPlan Profile.**

Driver Control, Iron Control, Wedge Control, Lag Putting, Short Putting. Strongest area and biggest opportunity. V1 practice coach remains in the same app.

### Screenshot placeholders

| Screen | Placeholder |
|--------|-------------|
| Quick Baseline Start | `[Add screenshot: docs/screenshots/v2-baseline-start.png]` |
| Assessment | `[Add screenshot: docs/screenshots/v2-assessment.png]` |
| Shot Logging | `[Add screenshot: docs/screenshots/v2-shot-logging.png]` |
| ShotPlan Profile | `[Add screenshot: docs/screenshots/v2-profile.png]` |
| Save Baseline | `[Add screenshot: docs/screenshots/v2-save-baseline.png]` |

---

## Version 3 — Round Review

**Status:** Next experiment. Not implemented.

**Hypothesis:** Golfers may value identifying recurring mistakes across actual rounds more than additional drills or isolated skill scores.

**Principle to test:** Track mistakes, not every shot.

This hypothesis has not been validated.

---

## What Golfers Told Me

Paste **real** Reddit, X, friends, and golf-team notes. Leave unused rows as placeholders.

Do not invent quotes.

### Structured placeholders

#### Reddit

| Field | Content |
|-------|---------|
| Source | Reddit |
| Golfer context / handicap if known | `[e.g. 12 handicap, weekend golfer]` |
| Feedback | `[Paste the real comment]` |
| Underlying problem | `[What this points to]` |
| Product decision | `[What you changed, validated, or will test next]` |

#### Twitter / X

| Field | Content |
|-------|---------|
| Source | Twitter / X |
| Golfer context / handicap if known | `[If known]` |
| Feedback | `[Paste the real post or reply]` |
| Underlying problem | `[What this points to]` |
| Product decision | `[Decision]` |

#### Friends

| Field | Content |
|-------|---------|
| Source | Friends |
| Golfer context / handicap if known | `[If known]` |
| Feedback | `[Paste the real note]` |
| Underlying problem | `[What this points to]` |
| Product decision | `[Decision]` |

#### Golf Team

| Field | Content |
|-------|---------|
| Source | Golf Team |
| Golfer context / handicap if known | `[If known]` |
| Feedback | `[Paste the real note]` |
| Underlying problem | `[What this points to]` |
| Product decision | `[Decision]` |

### Themes from early qualitative research

These are **themes observed so far**, not universal truths. They come from early conversations and community reading, not from a large validated study.

| Theme | How it showed up |
|-------|------------------|
| One bad round often does not justify changing anything | Golfers talk about waiting to see if a miss repeats. |
| Golfers look for recurring patterns | “What keeps showing up” matters more than one hole. |
| Many golfers already know their obvious weak areas | Slice, putting, and fat irons are often already named. |
| Some golfers struggle to stick to their intended plan | The issue is follow-through, not lack of a tip. |
| Focused practice matters more than simply hitting balls | Random range sessions come up as wasted time. |
| Mental mistakes and decision-making can matter alongside technique | Club choice, targets, and composure sit next to swing faults. |
| Some golfers already create their own manual systems for recording mistakes | Notes, photos, or scorecard marks — ShotPlan is not the first instinct to log what went wrong. |

---

## Product Experiments

See [`VERSION.md`](./VERSION.md#product-experiments) for Problem Hypothesis → Product Experiment → User Feedback → What I Learned → Next Decision.

---

## Roadmap

1. **v1.0** — Practice Coach *(tagged)*  
2. **v2.0** — Quick Baseline *(current freeze)*  
3. **v3-round-review** — development branch after V2 is tagged  
4. **v3.0** — Round Review, only after it is built and tested  

---

## Recovering versions

```bash
git checkout v1.0
git checkout v2.0
```

Continue in this repository. No duplicate apps or `shotplan-v1` folders.
