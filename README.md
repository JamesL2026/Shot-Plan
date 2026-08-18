# ShotPlan

[![Version](https://img.shields.io/badge/version-2.0.0-1b4332)](./VERSION.md)
[![Status](https://img.shields.io/badge/status-V2%20Quick%20Baseline-52796f)](./CHANGELOG.md)
[![Deploy](https://img.shields.io/badge/live-Vercel-000000?logo=vercel)](https://shot-plan-pi.vercel.app)
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20TypeScript-2d6a4f)](#tech-stack)

**A golf practice product built through hypothesis-driven experiments.**

ShotPlan is a mobile-first PWA. Version 1 is a practice coach. Version 2 adds a 15-shot Quick Baseline. Version 3 (Round Review) is the next experiment and is **not built yet**.

**Live:** [shot-plan-pi.vercel.app](https://shot-plan-pi.vercel.app)  
**Case study:** [/case-study](https://shot-plan-pi.vercel.app/case-study) · [`case-study.md`](./case-study.md)  
**Version record:** [`VERSION.md`](./VERSION.md) · [`CHANGELOG.md`](./CHANGELOG.md)

V1 and V2 stay in **this repository**. Restore them with Git tags — not duplicate folders.

---

## Project Overview

ShotPlan tests what actually helps golfers improve after they play, instead of assuming they only need another drill.

- **Version 1 — Practice Coach:** check in on a miss, get a guided range session.
- **Version 2 — Quick Baseline:** hit 15 shots, see a ShotPlan Profile (strongest / opportunity).
- **Version 3 — Round Review:** planned next. Track mistakes, not every shot.

---

## Product Experiments

ShotPlan is developed through short product experiments. Previous versions are not failures; they generated information used to choose the next test.

### Experiment 1 — Practice Coach

| | |
|---|---|
| **Problem Hypothesis** | Golfers don’t know what to practice after a bad round. |
| **Product Experiment** | Miss check-in → coach brief → challenges → Round Ready. |
| **User Feedback** | Many golfers already know their common misses. |
| **What I Learned** | Drills and coaching structure help, but drill discovery is a weak core value. |
| **Next Decision** | Test an objective snapshot of which skill deserves practice. |

### Experiment 2 — Quick Baseline

| | |
|---|---|
| **Problem Hypothesis** | A short assessment can show which part of the game to practice. |
| **Product Experiment** | 15 shots across driver, iron, wedge, lag putting, short putting. |
| **User Feedback** | Category scores often restate what the golfer just felt. |
| **What I Learned** | Measurement without a new, actionable insight may not be enough. |
| **Next Decision** | Test capturing recurring mistakes from real rounds (Round Review). |

### Experiment 3 — Round Review *(next)*

| | |
|---|---|
| **Problem Hypothesis** | Recurring in-round mistakes matter more than more drills or isolated skill scores. |
| **Product Experiment** | Not built. Principle to test: track mistakes, not every shot. |
| **User Feedback** | — |
| **What I Learned** | — |
| **Next Decision** | Build only after V2 is tagged. |

Full narrative: [case study](./case-study.md).

---

## Screenshots

Do not delete existing screenshots. Add files under `docs/screenshots/` when captured. See [`docs/screenshots/README.md`](./docs/screenshots/README.md).

### Version 1 — Practice Coach

| Screen | Placeholder |
|--------|-------------|
| Home | `[Add screenshot: docs/screenshots/v1-home.png]` |
| Check-In | `[Add screenshot: docs/screenshots/v1-check-in.png]` |
| Coach Brief | `[Add screenshot: docs/screenshots/v1-coach-brief.png]` |
| Practice Challenge | `[Add screenshot: docs/screenshots/v1-practice-challenge.png]` |
| Round Ready | `[Add screenshot: docs/screenshots/v1-round-ready.png]` |

### Version 2 — Quick Baseline

| Screen | Placeholder |
|--------|-------------|
| Quick Baseline Start | `[Add screenshot: docs/screenshots/v2-baseline-start.png]` |
| Assessment | `[Add screenshot: docs/screenshots/v2-assessment.png]` |
| Shot Logging | `[Add screenshot: docs/screenshots/v2-shot-logging.png]` |
| ShotPlan Profile | `[Add screenshot: docs/screenshots/v2-profile.png]` |
| Save Baseline | `[Add screenshot: docs/screenshots/v2-save-baseline.png]` |

Version 3 screenshots can be added later.

---

## Features (current app)

**Version 1 still in the app**

- Check-in (up to two miss patterns; optional club focus)
- Coach Brief, guided challenges, Round Ready
- Practice Library and Practice Journal
- PWA, Help Improve, admin inbox

**Version 2 added**

- Test Your Game — 15-shot Quick Baseline
- Five skill scores and a ShotPlan Profile
- On-device assessment history
- Two-tap baseline feedback in the same inbox

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Icons | Lucide |
| PWA | vite-plugin-pwa |
| Hosting | Vercel |
| Feedback API | Vercel Serverless + Blob |
| Analytics | Vercel Analytics |
| Storage | `localStorage` (local-first) |

---

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
npm run lint     # oxlint
```

### Optional environment (feedback)

- `BLOB_READ_WRITE_TOKEN` — Vercel Blob
- `FEEDBACK_ADMIN_SECRET` — unlocks `/inbox`

Sessions and baselines work without these; feedback falls back locally when the API is unavailable.

---

## Deployment

Configured for **Vercel**.

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites in `vercel.json`
- API: `api/feedback.ts`

Production URL: https://shot-plan-pi.vercel.app

---

## Roadmap

```
v1.0 — Practice Coach
    ↓
v2.0 — Quick Baseline
    ↓
v3-round-review — active development (not started)
    ↓
v3.0 — Round Review (only after it is built and tested)
```

---

## Recovering versions

```bash
git checkout v1.0
git checkout v2.0   # after the V2 tag exists
```

Continue Version 3 on a branch after V2 is tagged. See [`VERSION.md`](./VERSION.md).

---

## License / Notes

Private portfolio and product exploration unless otherwise stated by the author.
