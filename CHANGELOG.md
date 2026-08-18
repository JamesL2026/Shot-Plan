# Changelog

All notable ShotPlan milestones are documented here.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/). This project uses [Semantic Versioning](https://semver.org/) for tagged product experiments.

Each version is an experiment that produced information for the next decision.

---

### v1.0 — Practice Coach

**Status:** Preserved (`v1.0` tag)  
**Date:** 2026-08 (tag `v1.0` on `907fb5e`)

Built:

- Practice prescriptions from a miss check-in
- Guided coaching sessions (brief, challenges, Round Ready)
- Golf drill library and on-device practice journal
- Coach-style challenges, diagrams, and real-setup notes
- Beta Help Improve feedback and admin inbox

Learned:

- Golfers often already understand their obvious misses.
- Drill discovery alone may not solve the deeper improvement problem.

---

### v2.0 — Quick Baseline

**Status:** Current product milestone (tag `v2.0` after this freeze)  
**Theme:** A 15-shot snapshot of five skills

Built:

- 15-shot Quick Baseline (hit 3, log 3, move on)
- Five skill categories: Driver, Iron, Wedge, Lag Putting, Short Putting
- ShotPlan Profile with strongest area and biggest opportunity
- Assessment history on-device, plus two-tap profile feedback in the inbox
- Clearer range instructions so the test does not appear without setup
- V1 practice coach remains available in the same app

Learned:

- A lightweight assessment can structure performance data, but simply identifying the category that performed poorly may not provide enough new information.

---

### v3.0 — Round Review

**Status:** Next experiment — not implemented

**Hypothesis:** Golfers may value identifying recurring mistakes and patterns across actual rounds more than receiving additional drills or isolated skill scores.

This hypothesis has **not** been validated yet. Do not treat Round Review as shipped.

---

## Unreleased

Round Review development should start only after `v2.0` is committed and tagged, on a branch such as `v3-round-review`.
