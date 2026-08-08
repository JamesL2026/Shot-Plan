# ShotPlan

[![Version](https://img.shields.io/badge/version-1.0.0-1b4332)](./VERSION.md)
[![Status](https://img.shields.io/badge/status-V1%20preserved-52796f)](./CHANGELOG.md)
[![Deploy](https://img.shields.io/badge/live-Vercel-000000?logo=vercel)](https://shot-plan-pi.vercel.app)
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20TypeScript-2d6a4f)](#tech-stack)

**Tell us what went wrong. Get a focused coaching session — no video, no guesswork.**

ShotPlan is a mobile-first golf practice coach. Version 1 turns a quick check-in into a calm, guided range session and a Round Ready wrap-up.

**Live:** [shot-plan-pi.vercel.app](https://shot-plan-pi.vercel.app)  
**Case study:** [/case-study](https://shot-plan-pi.vercel.app/case-study) · [`case-study.md`](./case-study.md)  
**Version record:** [`VERSION.md`](./VERSION.md) · [`CHANGELOG.md`](./CHANGELOG.md)

---

## Project Overview

ShotPlan helps golfers decide **what to practice next** after a frustrating round. Instead of scrolling drills or filming swings, the app acts like a calm PGA-style coach: start here, stay patient, you’re ready when…

Version 1 is a complete, shippable product milestone. Version 2+ continues **in this same repository**. V1 remains recoverable via the Git tag `v1.0` — not a duplicate project folder.

---

## Problem Statement

Golfers often leave the course knowing something felt off — but at the range they:

- Hit balls without a plan
- Chase the last miss instead of a clear priority
- Get lost in mechanics and tip overload
- Struggle to take range feels onto the course

Version 1 hypothesized that a fast prescription — check-in → short coaching session → one swing thought — would fix that. Research and iteration will refine (and challenge) that hypothesis; see the [case study](./case-study.md).

---

## Screenshots

> Add product screenshots here for the GitHub landing experience.

| Screen | Placeholder |
|--------|-------------|
| Home | `<!-- screenshot: home -->` |
| Check-in | `<!-- screenshot: check-in -->` |
| Coach Brief | `<!-- screenshot: coach-brief -->` |
| Practice Session | `<!-- screenshot: guided-challenge -->` |
| Round Ready | `<!-- screenshot: round-ready -->` |

Suggested paths once captured: `docs/screenshots/home.png`, etc.

---

## Features

- **Check-in** — select up to two miss patterns; optional club focus
- **Coach Brief** — today’s focus, priority (what to ignore), swing thought
- **Guided challenges** — one drill at a time with setup, diagrams, photos, Coach Says
- **Coach voice** — intros, transitions, “You’re Ready When…”, wrap-up
- **Practice Library** — browse by miss
- **Practice Journal** — on-device session history
- **PWA** — installable, phone-first
- **Beta feedback** — Help Improve + admin inbox
- **Case study** — portfolio narrative with research placeholders

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
| Storage (sessions) | `localStorage` (local-first) |

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

For the feedback API and `/inbox` in production:

- `BLOB_READ_WRITE_TOKEN` — Vercel Blob
- `FEEDBACK_ADMIN_SECRET` — unlocks the inbox

Sessions and practice plans work without these; feedback falls back locally when the API is unavailable.

---

## Deployment

Configured for **Vercel**.

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites in `vercel.json` send non-API routes to `index.html`
- API: `api/feedback.ts`

Production URL: https://shot-plan-pi.vercel.app

---

## Roadmap

```
Version 1 — Practice prescriptions
    ↓
Version 2 — Round review
    ↓
Version 3 — Pattern recognition
    ↓
Version 4 — Personalized improvement engine
```

Full narrative: [case study](./case-study.md) and in-app `/case-study`.

---

## Lessons Learned

Version 1 was built to ship fast and learn. Early product lessons:

- A calm coaching tone outperforms documentation-style instruction
- Setup clarity (diagrams + real photos) matters as much as drill quality
- “What should I practice?” is only one user problem — patterns, decisions, and transfer matter too
- In-product feedback and external research should sit beside the code for portfolio honesty

Editable research placeholders live in the case study — **do not invent quotes**.

---

## Future Versions

Development continues on `main` in **this repository**.

- Tag `v1.0` marks the Version 1 freeze
- Version 2 builds on the same codebase
- Restore V1 anytime with `git checkout v1.0`

Git commands to publish the V1 tag are documented in [`VERSION.md`](./VERSION.md#preserve-this-release-with-git).

---

## License / Notes

Private portfolio and product exploration unless otherwise stated by the author.
