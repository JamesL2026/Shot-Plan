import type { AdaptedDrill, Drill, SymptomId } from '../types'

/** One short encouragement for the Coach Brief. */
const encouragementBySymptom: Record<SymptomId, string[]> = {
  slice: [
    'Slices are one of the most common misses. We are only chasing a better start line today.',
    'Forget distance today. We are building a straighter ball flight first.',
    'One good strike at a time. Progress beats perfection.',
  ],
  hook: [
    'Hooks happen to good golfers. Today we calm the face and finish in balance.',
    'Do not chase score with this miss. We are building a quieter release.',
    'One balanced finish is all we are looking for.',
  ],
  fat: [
    'Today we are only focusing on clean contact.',
    'Forget distance today. We are chasing crisp turf after the ball.',
    'One great strike is all we are looking for.',
  ],
  thin: [
    'Thin shots are common. We are only chasing solid contact today.',
    'Do not worry about distance. Stay down through the ball.',
    'We are building confidence first. One flush strike at a time.',
  ],
  chipping: [
    'We are building confidence first around the green.',
    'Today we only care about predictable contact and landing spots.',
    'One good chip at a time. Progress beats perfection.',
  ],
  putting: [
    'We are building confidence first on the greens.',
    'Forget making everything. We are chasing a clear start line.',
    'One committed stroke at a time.',
  ],
}

const transitionLines = [
  'Nice.',
  'Good work.',
  'You are making progress.',
  'Let us build on that.',
  'That looked better.',
  'Solid. Keep that feeling.',
]

const nextPressureLines = [
  'Now let us add a little pressure.',
  'Next we will stretch that feel a bit.',
  'Ready for the next piece.',
  'Now we take that into the next challenge.',
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
  if (!primary) return 'Today we are fixing one thing. Stay patient.'
  const options = encouragementBySymptom[primary]
  return pick(options, sessionSeed, 3)
}

export function coachFocusLine(
  primaryFocus: string,
  clubSummary: string | null,
): string {
  const focus = primaryFocus.toLowerCase()
  if (clubSummary) {
    return `Today we are fixing your ${focus} with a ${clubSummary.toLowerCase()} focus.`
  }
  return `Today we are fixing one thing: ${focus}.`
}

export interface CoachTransitionCopy {
  headline: string
  body: string
  cta: string
}

/** Spoken after completing a challenge, before the next one (or Round Ready). */
export function coachTransition(
  completed: Drill | AdaptedDrill,
  next: Drill | AdaptedDrill | undefined,
  sessionSeed: string,
  challengeIndex: number,
): CoachTransitionCopy {
  const headline = pick(transitionLines, sessionSeed, challengeIndex * 7 + 1)

  if (!next) {
    return {
      headline,
      body: 'That is enough for today. Lock in the feel and take it to the course.',
      cta: 'See Round Ready',
    }
  }

  const tip =
    'reflection' in completed && completed.reflection
      ? completed.reflection
      : completed.cue

  const bridge = pick(nextPressureLines, sessionSeed, challengeIndex * 11 + 5)

  return {
    headline,
    body: `${tip} ${bridge}`,
    cta: 'Next challenge',
  }
}

export function coachBiggestWin(
  drills: Array<Drill | AdaptedDrill>,
  swingThought: string,
): string {
  const first = drills[0]
  if (first && 'successCondition' in first && first.successCondition) {
    return first.successCondition
  }
  if (first?.goal) return first.goal
  return swingThought
}

/** Optional pre-practice spoken as a coach moment before challenge one. */
export function coachPrePracticeLines(title: string, body: string): {
  headline: string
  body: string
  cta: string
} {
  return {
    headline: 'Quick check before we start',
    body: `${title}. ${body}`,
    cta: 'I am set',
  }
}
