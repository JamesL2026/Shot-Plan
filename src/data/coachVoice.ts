import type { AdaptedDrill, Drill, SymptomId } from '../types'

/** One short encouragement for the Coach Brief. */
const encouragementBySymptom: Record<SymptomId, string[]> = {
  slice: [
    "Slices are common. Today we're only chasing a straighter start.",
    "Forget distance today. Straighter first.",
    'One good swing at a time.',
  ],
  hook: [
    "Hooks happen to good golfers. Today we're finishing in balance.",
    "Don't chase score. Calm your hands and finish tall.",
    'One balanced finish is enough.',
  ],
  fat: [
    "Today we only care about clean contact.",
    'Forget distance. Hit the ball first.',
    'One solid strike is enough.',
  ],
  thin: [
    "Thin shots are common. Today we're chasing solid contact.",
    'Stay down through the ball. Distance can wait.',
    'One flush strike at a time.',
  ],
  chipping: [
    "Today we're building simple, repeatable chips.",
    'Only care about solid contact and a clear landing spot.',
    'One good chip at a time.',
  ],
  putting: [
    "Today we're building confidence on the greens.",
    "Forget making everything. Start it on line.",
    'One committed stroke at a time.',
  ],
}

/** What to ignore today — mental priority before challenge one. */
const priorityBySymptom: Record<SymptomId, { ignore: string; focus: string }> =
  {
    slice: {
      ignore: 'Forget curve today.',
      focus: 'Only focus on starting the ball on a better line.',
    },
    hook: {
      ignore: "Don't force the release.",
      focus: 'Finish balanced. Let the face quiet itself.',
    },
    fat: {
      ignore: 'Ignore distance.',
      focus: "Today we're only chasing clean contact.",
    },
    thin: {
      ignore: "Don't try to help the ball up.",
      focus: 'Stay down. Ball first. Then brush.',
    },
    chipping: {
      ignore: 'Same motion.',
      focus: 'Only change distance.',
    },
    putting: {
      ignore: "Don't try to make putts.",
      focus: 'Train your speed and start line.',
    },
  }

const transitionLines = [
  'Nice.',
  'Good work.',
  "You're making progress.",
  "Let's build on that.",
  'That looked much better.',
  'Solid. Keep that feeling.',
  'Good.',
  'Well done.',
]

const nextBridgeLines = [
  "If that became automatic, let's make it a little harder.",
  "If contact still felt inconsistent, slow the next few swings.",
  "Good. Now let's test it.",
  "Now let's stretch that feel a bit.",
  'Ready for the next piece.',
  'Now we take that into the next challenge.',
  "Let's keep building.",
]

function hashSeed(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return h
}

function pick<T>(items: T[], seed: string, salt: number): T {
  const index = (hashSeed(seed) + salt) % items.length
  return items[index]!
}

export function coachEncouragement(
  symptomIds: SymptomId[],
  sessionSeed: string,
): string {
  const primary = symptomIds[0]
  if (!primary) return "Today we're fixing one thing. Stay patient."
  const options = encouragementBySymptom[primary]
  return pick(options, sessionSeed, 3)
}

export function coachFocusLine(
  primaryFocus: string,
  clubSummary: string | null,
): string {
  const focus = primaryFocus.toLowerCase()
  if (clubSummary) {
    return `Today we're fixing your ${focus} with a ${clubSummary.toLowerCase()} focus.`
  }
  return `Today we're fixing one thing: ${focus}.`
}

/** Card before the first drill: what to ignore. */
export function coachPriority(symptomIds: SymptomId[]): {
  title: string
  lines: string[]
} | null {
  const primary = symptomIds[0]
  if (!primary) return null
  const entry = priorityBySymptom[primary]
  return {
    title: "Today's Priority",
    lines: [entry.ignore, entry.focus],
  }
}

export interface CoachTransitionCopy {
  headline: string
  body: string
  cta: string
}

/** Spoken after completing a challenge, before the next one (or Round Ready). */
export function coachTransition(
  _completed: Drill | AdaptedDrill,
  next: Drill | AdaptedDrill | undefined,
  sessionSeed: string,
  challengeIndex: number,
): CoachTransitionCopy {
  const headline = pick(transitionLines, sessionSeed, challengeIndex * 7 + 1)

  if (!next) {
    return {
      headline,
      body: "That's enough for today. Lock in the feel and take it to the course.",
      cta: 'See Round Ready',
    }
  }

  const bridge = pick(nextBridgeLines, sessionSeed, challengeIndex * 11 + 5)
  const nextName = next.name.replace(/\s+drill$/i, '')

  return {
    headline,
    body: `${bridge} Next up: ${nextName}.`,
    cta: "Let's go",
  }
}

export function coachBiggestWin(
  drills: Array<Drill | AdaptedDrill>,
  swingThought: string,
): string {
  const first = drills[0]
  if (first && 'objective' in first && first.objective) {
    return first.objective
  }
  if (first?.goal) return first.goal
  return swingThought
}

/** Optional pre-practice spoken as a coach moment before challenge one. */
export function coachPrePracticeLines(
  title: string,
  body: string,
): {
  headline: string
  body: string
  cta: string
} {
  return {
    headline: 'Quick check before we start',
    body: `${title}. ${body}`,
    cta: "I'm set",
  }
}
