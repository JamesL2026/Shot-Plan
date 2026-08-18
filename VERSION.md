# ShotPlan — Version Record

| Field | Value |
|-------|-------|
| **Project** | ShotPlan |
| **Current milestone** | 2.0 — Quick Baseline |
| **Status** | Ready to tag as `v2.0` |
| **Live app** | https://shot-plan-pi.vercel.app |
| **Repository** | Continue in this same repo — no duplicate apps or folders |

Previous versions are preserved through **Git tags and history**, not copies of the project.

| Tag | Product |
|-----|---------|
| `v1.0` | Practice Coach *(already tagged)* |
| `v2.0` | Quick Baseline *(tag after this freeze)* |
| `v3.0` | Round Review *(not built yet)* |

---

## Version 1 — Practice Coach

**Hypothesis:** Golfers struggle to know what to practice after a bad round.

**Product:** The golfer selected a problem such as slice, hook, fat shots, thin shots, chipping, or putting. ShotPlan generated a guided practice session with drills, coaching cues, illustrations, challenges, and a coach-style flow: Check In → Coach Brief → Challenges → Round Ready.

**What this experiment showed:** Drills alone were not a strong enough value proposition. Many golfers already know their common misses. The bigger problem may not be finding another drill.

V1 remains in the product (Check In, library, journal) and is recoverable at tag `v1.0`.

---

## Version 2 — Quick Baseline

**Hypothesis:** A short assessment could help golfers objectively identify which part of their game deserves practice.

**Product:** A 15-shot Quick Baseline across five categories — Driver Control, Iron Control, Wedge Control, Lag Putting, Short Putting. The golfer received a ShotPlan Profile with strongest area and biggest opportunity. Feedback from the profile and Help Improve lands in the inbox.

**What this experiment showed:** The assessment worked technically, but information gain was limited. If a golfer hits three poor iron shots, they often already know their irons were poor. Measurement without a sufficiently new or actionable insight may not create enough value.

---

## Version 3 — Round Review

**Status:** Next experiment. Not implemented.

**Hypothesis:** Golfers may get more value from quickly capturing meaningful mistakes during real rounds and recognizing what repeatedly affects scoring.

**Product principle to test later:** Track mistakes, not every shot.

Do not treat this hypothesis as validated.

---

## Product Experiments

ShotPlan is developed through hypothesis-driven iterations. Each version is an experiment that generated information for the next decision — not a failed product.

### Experiment 1 — Practice Coach

| | |
|---|---|
| **Problem Hypothesis** | After a bad round, golfers waste range time because they do not know what to practice next. |
| **Product Experiment** | Check-in on a miss → guided coaching session with drills, cues, and Round Ready. |
| **User Feedback** | Early qualitative research suggested many golfers already know their obvious misses. Drill discovery alone did not feel like a new enough product. |
| **What I Learned** | Structure and coaching tone help, but “here is another drill” is a weak value proposition if the golfer already knows the miss. |
| **Next Decision** | Test whether a short, objective snapshot of the game would show *which skill* deserves practice. |

### Experiment 2 — Quick Baseline

| | |
|---|---|
| **Problem Hypothesis** | Golfers need an objective read on which part of their game is actually the opportunity. |
| **Product Experiment** | 15-shot Quick Baseline and a ShotPlan Profile (strongest / biggest opportunity). |
| **User Feedback** | The flow can be completed, but a category score often restates what the golfer just felt over those three shots. |
| **What I Learned** | Lightweight measurement can organize performance, yet identifying “irons were poor today” may not be new or actionable enough. |
| **Next Decision** | Test Round Review: capture meaningful mistakes from real rounds and look for what repeats — without building shot-by-shot tracking. |

### Experiment 3 — Round Review *(planned)*

| | |
|---|---|
| **Problem Hypothesis** | Golfers get more value from seeing what repeatedly affected scoring than from more drills or isolated skill scores. |
| **Product Experiment** | Not built yet. Intended principle: track mistakes, not every shot. |
| **User Feedback** | — |
| **What I Learned** | — |
| **Next Decision** | Build and test only after V2 is tagged. |

---

## Known Limitations (V2)

- Local-first sessions and baselines (one device unless the golfer uses the same browser)
- Quick Baseline is a 15-shot snapshot, not a handicap or launch-monitor profile
- V1 practice loop and V2 assessment both live in the app; they are not yet one connected improvement system
- Round logging, mistake patterns, and accounts are out of scope for V2
- Community quotes on the case study stay as placeholders until real notes are pasted

---

## Recovering previous versions

```bash
git checkout v1.0    # Practice Coach freeze
git checkout v2.0    # Quick Baseline freeze (after the tag exists)
```

Continue later work on a branch such as `v3-round-review`. Do not duplicate the repository.
