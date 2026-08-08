# Changelog

All notable milestones for ShotPlan are documented here.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/), and this project uses [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — ShotPlan Version 1

**Status:** Preserved product milestone  
**Theme:** Calm, coach-led practice prescriptions after a bad round

### Features

- Symptom check-in (up to two misses) with optional club focus
- Coach brief: focus, today’s priority, estimated time, swing thought
- Guided single-challenge practice flow with coach intros and Coach Says cues
- Alignment diagrams and real-setup photos for drills
- Coach transitions between challenges
- Round Ready wrap-up with reflection and confidence-oriented closers
- Post-session follow-up prompts
- Practice Library filtered by miss pattern
- Practice Journal (on-device session history)
- Installable PWA (Vite + Workbox)
- In-app beta feedback (“Help Improve”) with optional Vercel Blob storage
- Admin feedback inbox at `/inbox`
- Portfolio case study page at `/case-study` (research placeholders)

### Bug Fixes

- Diagram labels and notes positioned to avoid clipping
- View badges moved outside SVG artwork
- Success / readiness copy clarified with countable practice goals
- Real-setup captions styled as coach asides (not duplicate bullet lists)
- Production SPA routing via Vercel rewrites for client-side paths

### Known Limitations

- No user accounts or cross-device sync
- No round logging or multi-round pattern engine
- Prescription quality depends on curated drill content, not learned personalization
- On-course transfer is not measured in V1
- Community research quotes on the case study are placeholders until filled by the author

### Roadmap

| Version | Focus |
|---------|--------|
| **1.x** | Practice prescriptions (current) |
| **2.0** | Round review |
| **3.0** | Pattern recognition |
| **4.0** | Personalized improvement engine |

Details: `VERSION.md`, `case-study.md`, in-app `/case-study`.

---

## Unreleased

Work toward Version 2 will continue on `main` after the `v1.0` tag.
