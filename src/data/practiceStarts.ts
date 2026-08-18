import type { FocusArea } from '../types/memory'

export interface PracticeStart {
  explanation: string
  baseline: string
  support: string
  optionalTest: string
  transfer: string
  ideaTitle: string
  ideaCopy: string
  ideaPicks?: string[]
  ideaPickHint?: string
}

export const PRACTICE_STARTS: Record<FocusArea, PracticeStart> = {
  'iron-contact': {
    explanation: 'Observe your usual contact. This is not a swing diagnosis.',
    baseline: 'Hit 5 normal shots with a comfortable mid-iron, such as a 7-iron.',
    support: "Don't change anything yet. We're establishing your normal result.",
    optionalTest: 'Now test one thing you already want to try.',
    transfer:
      'Hit 5 shots at changing targets with your normal routine and less conscious mechanical thought.',
    ideaTitle: 'Find your strike',
    ideaCopy:
      'Make 5 controlled swings with one mid-iron and pay attention to where the club meets the ground after the ball. Look for repeatable contact rather than maximum distance. A line or tee marker on the ground can help if you have one.',
  },
  'wedge-distance': {
    explanation: 'Distance control, not a particular swing mechanic.',
    baseline:
      'Choose one useful wedge distance or visible landing target. Hit 5 normal shots.',
    support: 'Use a specific target. Do not worry about your best-ever distance.',
    optionalTest: 'Try a distance-control feel or routine you already want to test.',
    transfer: 'Change the distance. Do not use the same target every time.',
    ideaTitle: 'Build a distance you can repeat',
    ideaCopy:
      'Pick one distance and hit 5 shots toward it. The point is a repeatable reference, not a specific swing length.',
    ideaPicks: ['40 yards', '60 yards', '80 yards'],
    ideaPickHint:
      'If you already know a wedge distance, use that. Otherwise pick a beginner distance.',
  },
  'driver-direction': {
    explanation: 'Target selection, start direction, and repeatability.',
    baseline: 'Choose a visible fairway-width target. Hit 5 normal drives.',
    support: 'Pick your target first and use your normal setup and routine.',
    optionalTest: 'Use a feel, setup, or routine you already want to test.',
    transfer: 'Change targets between shots and use the normal pre-shot routine.',
    ideaTitle: 'Pick your fairway',
    ideaCopy:
      'Choose a fairway-width landing area. Before each shot, pick the side you can afford to miss on, then commit to the target.',
  },
  'putting-speed': {
    explanation: 'Distance control, not make percentage.',
    baseline:
      'Use a reasonably flat area. Choose a target around 20 feet away if practical. Hit 5 putts.',
    support: 'The goal is distance control, not making the putt.',
    optionalTest: 'Use a feel or routine you already want to test.',
    transfer: 'Change the distance and repeat.',
    ideaTitle: 'Find your stopping zone',
    ideaCopy:
      'Try to finish each putt inside a simple safety zone around your target. Change the distance as you go, not the mechanics.',
    ideaPicks: ['10 feet', '20 feet', '30 feet'],
    ideaPickHint: 'Pick a distance if you have the space. Then change it on transfer.',
  },
  'start-line': {
    explanation: 'Start direction toward a target you pick.',
    baseline:
      'Use a relatively straight putt when possible. Choose a clear start point. Hit 5 putts. For longer shots, use Left, Target, Right with a visible range target.',
    support: 'Choose your start point before the stroke and commit to it.',
    optionalTest: 'Use a feel or routine you already want to test.',
    transfer: 'Change the start point or distance.',
    ideaTitle: 'Pick your start point',
    ideaCopy:
      'Before each putt, pick the exact point where you want the ball to start. Set up to that point and commit. A visible spot on the ground can help if you have one.',
  },
  'decision-routine': {
    explanation: 'A good decision can produce a bad shot.',
    baseline:
      'Create 5 simulated golf situations. For each: choose club, choose target, consider the safer miss when relevant, commit, then hit.',
    support: 'Pick the target, choose the shot, then commit. Do not keep solving the hole once you are over the ball.',
    optionalTest: 'Use a decision routine you already want to test.',
    transfer: 'Change the scenario and target.',
    ideaTitle: 'Decide before you swing',
    ideaCopy:
      "Pick the target, choose the shot, then commit. Don't keep solving the hole once you're over the ball.",
  },
  'mental-reset': {
    explanation: 'The next shot. Not fixing the whole round.',
    baseline:
      'Create 5 reset opportunities. After a poor result: step away, take one slow breath, choose the next target, restart the normal routine.',
    support: 'Accept it, reset your attention, choose the next target, and play the next shot.',
    optionalTest: 'Use a reset you already want to test.',
    transfer: 'Continue a normal session and only use the reset when something goes wrong.',
    ideaTitle: 'Reset for the next shot',
    ideaCopy:
      'Accept it, reset your attention, choose the next target, and play the next shot. No scripted self-talk required.',
  },
  custom: {
    explanation: 'No predefined mechanic. You name what you want to learn.',
    baseline: 'Hit 5 normal shots or reps the way you usually do.',
    support: "Don't change anything yet. We're establishing your normal result.",
    optionalTest: 'Now test one thing you already want to try.',
    transfer:
      'A few more with your normal routine and less conscious mechanical thought.',
    ideaTitle: 'Notice what happens',
    ideaCopy:
      'Hit 5 more the way you usually do. Notice what happens. ShotPlan will not invent an instruction.',
  },
}

export type PracticeCompare = 'better' | 'same' | 'worse'

export function transferPrompt(result: PracticeCompare | null): {
  title: string
  body: string
  primary: 'transfer' | 'finish'
} {
  if (result === 'better') {
    return {
      title: 'Can it hold up?',
      body: 'Use changing targets and your normal routine. Try to use less conscious mechanical thought.',
      primary: 'transfer',
    }
  }
  if (result === 'worse') {
    return {
      title: 'Want to test it once more?',
      body: 'The first test was worse than your baseline. You can try a few normal shots again, or finish here.',
      primary: 'finish',
    }
  }
  return {
    title: 'Want to test it under normal conditions?',
    body: 'You can try it with changing targets and your normal routine, or stop here.',
    primary: 'transfer',
  }
}

export function sessionHeadline(input: {
  test: PracticeCompare | null
  transfer: PracticeCompare | null
}): string {
  if (input.test === 'worse') return 'Worse in this test.'
  if (input.test === 'better' && input.transfer === 'better') {
    return 'Better in both tests.'
  }
  if (input.test === 'better' && input.transfer) {
    return 'Better in the test. Mixed in transfer.'
  }
  if (input.test === 'better') return 'Better in this test.'
  if (input.test === 'same') return 'About the same.'
  if (input.test === null) return 'Baseline saved. Not enough evidence yet.'
  return 'No improvement in this test.'
}

export function comparePractice(
  baseline: string[],
  test: string[],
  success: string,
): PracticeCompare | null {
  if (baseline.length === 0 || test.length === 0) return null
  const before = baseline.filter((item) => item === success).length
  const after = test.filter((item) => item === success).length
  const beforeRate = before / baseline.length
  const afterRate = after / test.length
  if (afterRate > beforeRate) return 'better'
  if (afterRate < beforeRate) return 'worse'
  return 'same'
}

export function compareCopy(result: PracticeCompare): { title: string; body: string } {
  if (result === 'better') {
    return {
      title: 'Better in this test',
      body: "Promising, but one session isn't enough to know yet. Is this promising enough to keep testing?",
    }
  }
  if (result === 'worse') {
    return {
      title: 'Worse in this test',
      body: "Don't mark this as helpful yet.",
    }
  }
  return {
    title: 'About the same',
    body: 'Not enough evidence that this helped.',
  }
}

/** Split a few listed thoughts without diagnosing them. */
export function splitExperiments(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const parts = trimmed
    .split(/\s*(?:,|;|\/|\band\b)\s+/i)
    .map((part) => part.replace(/^and\s+/i, '').trim())
    .filter((part) => part.length > 1)
  return parts.length >= 2 ? parts : []
}

export function groupHelpful(adjustments: { whatITried: string; workedAt?: string }[]) {
  const map = new Map<
    string,
    { label: string; helpful: number; tried: number }
  >()
  for (const item of adjustments) {
    const key = item.whatITried.trim().toLowerCase()
    if (!key) continue
    const current = map.get(key) ?? {
      label: item.whatITried.trim(),
      helpful: 0,
      tried: 0,
    }
    current.tried += 1
    if (item.workedAt) current.helpful += 1
    map.set(key, current)
  }
  return [...map.values()].sort((a, b) => b.helpful - a.helpful || b.tried - a.tried)
}
