# ShotPlan — Version 1

| Field | Value |
|-------|-------|
| **Project** | ShotPlan |
| **Version** | 1.0 |
| **Status** | Preserved milestone (`v1.0` tag recommended) |
| **Live app** | https://shot-plan-pi.vercel.app |
| **Repository** | Continue Version 2 in this same repo |

Version 1 is preserved through **Git tags**, not duplicate folders or separate apps.

---

## Purpose

Version 1 attempted to solve a simple post-round problem:

> After a bad round, golfers waste range time because they do not know what to practice next.

ShotPlan V1 turns a quick check-in into a calm, coach-led practice session — focused drills, one swing thought, and a Round Ready wrap-up — without video analysis or accounts.

---

## Target User

- Mid-handicap and developing golfers who practice alone
- Players who leave the course frustrated and want a clear next step
- Beginners who need guidance, and serious amateurs who want structure without a full lesson
- Mobile users at the range (PWA / phone-first)

---

## Core Features

- **Check-in** — pick up to two miss patterns (slice, hook, fat, thin, chipping, putting)
- **Club focus** — optional driver / irons / wedge context where relevant
- **Coach brief** — today’s focus, priority (what to ignore), estimated time, swing thought
- **Guided practice** — one challenge at a time with setup, diagram, real-setup photo, Coach Says
- **Coach transitions** — short human encouragement between challenges
- **Round Ready / Coach’s Wrap-Up** — focus, challenges completed, biggest win, reflection
- **Follow-up** — quick “did you try it / did it help” after a session
- **Practice Library** — browse drills by miss
- **Practice Journal** — reopen past on-device sessions
- **Drill diagrams + photos** — setup clarity without video
- **PWA** — installable, mobile-first shell
- **Beta feedback** — in-app Help Improve sheet
- **Feedback inbox** — admin-only `/inbox` for reviewing submissions
- **Portfolio case study** — `/case-study` documenting product journey (placeholders for research)

---

## Known Limitations

- Local-first only — no accounts; journal lives on one device
- Symptom check-in may oversimplify golfers who think in patterns across rounds
- Practice prescriptions help structure the range; they do not guarantee on-course transfer
- Pre-practice checks are limited (e.g. grip for hook)
- Feedback and inbox depend on Vercel Blob + admin secret configuration
- No round logging, scorecards, or shot tracking in V1
- No personalized model beyond curated drills and session seed variation

---

## Lessons Learned

(Summarized for product direction — fill with specifics as research is pasted into the case study.)

1. **Shipping a focused MVP beats waiting for a perfect coach AI.**
2. **Tone matters** — golfers respond better to a calm coach voice than to manual-style instructions.
3. **Clarity of setup** (diagrams, photos, short steps) reduces abandonment at the range.
4. **Assumptions need validation** — “golfers don’t know what to practice” is only part of the story; many already know their miss and struggle with patterns, decisions, and transfer.
5. **In-app feedback loops** are essential for a beta; portfolio-quality research should sit next to the product.

---

## Future Direction

Version 2 and beyond will evolve **inside this repository**:

| Version | Direction |
|---------|-----------|
| **V1** | Practice prescriptions (this milestone) |
| **V2** | Round review — capture what happened, not only what to drill |
| **V3** | Pattern recognition across sessions and rounds |
| **V4** | Personalized improvement engine |

See `CHANGELOG.md`, `case-study.md`, and the in-app page at `/case-study`.

---

## Preserve this release with Git

Do **not** duplicate the project. Tag this commit so V1 remains recoverable forever.

```bash
# Stage everything for the V1 release
git add .

# Create the release commit
git commit -m "Release: ShotPlan V1"

# Tag this exact commit as Version 1.0
git tag v1.0

# Push the commit to GitHub
git push

# Push the tag so V1 is recoverable remotely
git push --tags
```

### What each command does

| Command | Purpose |
|---------|---------|
| `git add .` | Stages all current changes for commit. |
| `git commit -m "Release: ShotPlan V1"` | Records the V1 milestone with a clear message. |
| `git tag v1.0` | Labels this commit as Version 1.0 for easy checkout later. |
| `git push` | Publishes the commit to the remote (`origin`). |
| `git push --tags` | Publishes the `v1.0` tag so others (and future you) can restore V1. |

### Restore Version 1 later

```bash
git checkout v1.0
```

Then continue Version 2 on `main` as usual.
