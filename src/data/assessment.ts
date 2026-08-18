import type {
  Assessment,
  AssessmentMode,
  AssessmentResult,
  AssessmentShot,
  AssessmentTest,
  AssessmentTestId,
  CommonMiss,
  DriverMissType,
  FullSwingResult,
  IronMissType,
  LagResult,
  MissType,
  ShortPuttResult,
  ShotResult,
  ShotScore,
  SkillScore,
  WedgeMissType,
  WedgeResult,
} from '../types/assessment'

export interface ResultOption {
  result: ShotResult
  label: string
  score: ShotScore
}

export interface MissOption {
  value: MissType
  label: string
}

export interface AssessmentTestDef {
  id: AssessmentTestId
  title: string
  instruction: string
  hitHeadline: string
  hitDetail: string
  logPrompt: string
  club: string
  target: string
  scoreGuide: string
  shotCount: number
  maxPoints: number
  resultPrompt: string
  resultOptions: ResultOption[]
  missPrompt?: string
  missOptions?: MissOption[]
  suggestedDistanceYards?: number
}

const FULL_SWING_OPTIONS: ResultOption[] = [
  { result: 'good', label: 'Good', score: 2 },
  { result: 'playable-miss', label: 'In play', score: 1 },
  { result: 'major-miss', label: 'Trouble', score: 0 },
]

const DRIVER_MISS: MissOption[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'hook', label: 'Hook' },
  { value: 'slice', label: 'Slice' },
  { value: 'other', label: 'Other' },
]

const IRON_MISS: MissOption[] = [
  { value: 'fat', label: 'Fat' },
  { value: 'thin', label: 'Thin' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'shank', label: 'Shank' },
  { value: 'other', label: 'Other' },
]

const WEDGE_MISS: MissOption[] = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'poor-contact', label: 'Poor Contact' },
  { value: 'other', label: 'Other' },
]

const MISS_LABEL: Record<MissType, string> = {
  left: 'Left',
  right: 'Right',
  top: 'Top',
  hook: 'Hook',
  slice: 'Slice',
  other: 'Other',
  fat: 'Fat',
  thin: 'Thin',
  shank: 'Shank',
  short: 'Short',
  long: 'Long',
  'poor-contact': 'Poor Contact',
}

/** Only active MVP mode. Full Combine can reuse this page later. */
export const ACTIVE_ASSESSMENT_MODE: AssessmentMode = 'quick-baseline'

export const QUICK_BASELINE_SHOTS_PER_TEST = 3
export const QUICK_BASELINE_MAX_POINTS = 6

export const ASSESSMENT_TESTS: AssessmentTestDef[] = [
  {
    id: 'driver-control',
    title: 'Driver Control',
    instruction:
      'Grab your driver. Pick one fairway or target. Hit 3 balls at it, same target each time.',
    hitHeadline: 'Hit 3 drives',
    hitDetail: 'Pocket your phone. Hit all 3. Then come back and log them.',
    logPrompt: 'How did your 3 drives go?',
    club: 'Driver',
    target: 'One fairway or flag',
    scoreGuide:
      "Good = you'd play it. In play = not great, still okay. Trouble = reload or penalty.",
    shotCount: QUICK_BASELINE_SHOTS_PER_TEST,
    maxPoints: QUICK_BASELINE_MAX_POINTS,
    resultPrompt: 'How was it?',
    resultOptions: FULL_SWING_OPTIONS,
    missPrompt: 'What kind of miss? Optional.',
    missOptions: DRIVER_MISS,
  },
  {
    id: 'iron-control',
    title: 'Iron Control',
    instruction:
      'Grab a mid iron (7, 8, or 9). Pick one target. Hit 3 shots at that same target.',
    hitHeadline: 'Hit 3 iron shots',
    hitDetail: 'Pocket your phone. Hit all 3. Then come back and log them.',
    logPrompt: 'How did your 3 iron shots go?',
    club: 'Mid iron (7, 8, or 9)',
    target: 'One flag or landing spot',
    scoreGuide:
      "Good = you'd play it. In play = not great, still okay. Trouble = reload or penalty.",
    shotCount: QUICK_BASELINE_SHOTS_PER_TEST,
    maxPoints: QUICK_BASELINE_MAX_POINTS,
    resultPrompt: 'How was it?',
    resultOptions: FULL_SWING_OPTIONS,
    missPrompt: 'What kind of miss? Optional.',
    missOptions: IRON_MISS,
  },
  {
    id: 'wedge-control',
    title: 'Wedge Control',
    instruction:
      'Grab one wedge. Pick a target about 75 yards out, or the closest thing you have. Hit 3 shots to that same target.',
    hitHeadline: 'Hit 3 wedge shots',
    hitDetail: 'Pocket your phone. Hit all 3. Then come back and log them.',
    logPrompt: 'How did your 3 wedge shots go?',
    club: 'One wedge',
    target: 'About 75 yards, one target',
    scoreGuide:
      'Close = near the target. A little off = short, long, or wide. Way off = nowhere near.',
    shotCount: QUICK_BASELINE_SHOTS_PER_TEST,
    maxPoints: QUICK_BASELINE_MAX_POINTS,
    resultPrompt: 'How was it?',
    resultOptions: [
      { result: 'target-zone', label: 'Close', score: 2 },
      { result: 'slight-miss', label: 'A little off', score: 1 },
      { result: 'big-miss', label: 'Way off', score: 0 },
    ],
    missPrompt: 'What kind of miss? Optional.',
    missOptions: WEDGE_MISS,
    suggestedDistanceYards: 75,
  },
  {
    id: 'lag-putting',
    title: 'Lag Putting',
    instruction:
      'On a green or a flat patch, drop 3 balls about 30 feet from a hole (or a tee). Hit all 3 toward it.',
    hitHeadline: 'Hit 3 lag putts',
    hitDetail: 'From about 30 feet. Hit all 3, then log how close they finished.',
    logPrompt: 'How close did each putt finish?',
    club: 'Putter',
    target: 'About 30 feet to a hole',
    scoreGuide: 'Tap how far each ball finished from the hole.',
    shotCount: QUICK_BASELINE_SHOTS_PER_TEST,
    maxPoints: QUICK_BASELINE_MAX_POINTS,
    resultPrompt: 'Where did it finish?',
    resultOptions: [
      { result: 'inside-3', label: 'Inside 3 ft', score: 2 },
      { result: 'three-to-six', label: '3-6 ft', score: 1 },
      { result: 'more-than-6', label: '6+ ft', score: 0 },
    ],
  },
  {
    id: 'short-putting',
    title: 'Short Putting',
    instruction:
      "Place 3 balls about 4 feet from a hole. Hit each one. Made or missed, that's it.",
    hitHeadline: 'Hit 3 short putts',
    hitDetail: 'From about 4 feet. Hit all 3, then log made or missed.',
    logPrompt: 'Did each putt go in?',
    club: 'Putter',
    target: 'About 4 feet',
    scoreGuide: 'Made or missed. No maybes.',
    shotCount: QUICK_BASELINE_SHOTS_PER_TEST,
    maxPoints: QUICK_BASELINE_MAX_POINTS,
    resultPrompt: 'Did it go in?',
    resultOptions: [
      { result: 'made', label: 'Made', score: 2 },
      { result: 'missed', label: 'Missed', score: 0 },
    ],
  },
]

const TEST_BY_ID = new Map(ASSESSMENT_TESTS.map((test) => [test.id, test]))

export function getAssessmentTest(id: AssessmentTestId): AssessmentTestDef {
  const test = TEST_BY_ID.get(id)
  if (!test) throw new Error(`Unknown assessment test: ${id}`)
  return test
}

export function scoreToPercent(rawPoints: number, maxPoints: number): number {
  if (maxPoints <= 0) return 0
  return Math.round((rawPoints / maxPoints) * 100)
}

export function averageScores(scores: number[]): number {
  if (scores.length === 0) return 0
  const sum = scores.reduce((total, score) => total + score, 0)
  return Math.round(sum / scores.length)
}

const OPPORTUNITY_LINE: Record<AssessmentTestId, string> = {
  'driver-control':
    'Driver control showed the most room to improve in today\'s baseline.',
  'iron-control':
    'Iron control showed the most room to improve in today\'s baseline.',
  'wedge-control':
    'Wedge distance control showed the most room to improve in today\'s baseline.',
  'lag-putting':
    'Lag putting showed the most room to improve in today\'s baseline.',
  'short-putting':
    'Short putting showed the most room to improve in today\'s baseline.',
}

export function emptyTest(def: AssessmentTestDef): AssessmentTest {
  return {
    id: def.id,
    title: def.title,
    shots: [],
    rawPoints: 0,
    maxPoints: def.maxPoints,
    shotPlanScore: 0,
  }
}

export function createEmptyAssessment(): Assessment {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    completedAt: null,
    source: 'manual',
    mode: ACTIVE_ASSESSMENT_MODE,
    tests: ASSESSMENT_TESTS.map(emptyTest),
    result: null,
  }
}

export function withRecordedShot(
  test: AssessmentTest,
  shot: AssessmentShot,
): AssessmentTest {
  const shots = [...test.shots, shot]
  const rawPoints = shots.reduce((sum, item) => sum + item.score, 0)
  return {
    ...test,
    shots,
    rawPoints,
    shotPlanScore: scoreToPercent(rawPoints, test.maxPoints),
  }
}

const MIN_MISS_COUNT = 2

export function mostCommonMissFromTests(tests: AssessmentTest[]): CommonMiss | null {
  const counts = new Map<MissType, number>()
  for (const test of tests) {
    for (const shot of test.shots) {
      if (!shot.missType) continue
      counts.set(shot.missType, (counts.get(shot.missType) ?? 0) + 1)
    }
  }

  let best: CommonMiss | null = null
  for (const [type, count] of counts) {
    if (count < MIN_MISS_COUNT) continue
    if (!best || count > best.count) {
      best = { type, label: MISS_LABEL[type], count }
    }
  }
  return best
}

export function buildResult(tests: AssessmentTest[]): AssessmentResult {
  const skills: SkillScore[] = tests.map((test) => ({
    testId: test.id,
    label: test.title,
    score: test.shotPlanScore,
  }))

  const strongest = skills.reduce((best, skill) =>
    skill.score > best.score ? skill : best,
  )
  const biggestOpportunity = skills.reduce((worst, skill) =>
    skill.score < worst.score ? skill : worst,
  )

  return {
    overallScore: averageScores(skills.map((skill) => skill.score)),
    skills,
    strongest,
    biggestOpportunity,
    opportunitySentence: OPPORTUNITY_LINE[biggestOpportunity.testId],
    mostCommonMiss: mostCommonMissFromTests(tests),
  }
}

export function completeAssessment(assessment: Assessment): Assessment {
  const tests = assessment.tests.map((test) => {
    const rawPoints = test.shots.reduce((sum, shot) => sum + shot.score, 0)
    return {
      ...test,
      rawPoints,
      shotPlanScore: scoreToPercent(rawPoints, test.maxPoints),
    }
  })

  return {
    ...assessment,
    tests,
    completedAt: new Date().toISOString(),
    result: buildResult(tests),
  }
}

export function isMajorMissResult(result: ShotResult): boolean {
  return result === 'major-miss'
}

export function showsOptionalMiss(result: ShotResult): boolean {
  return result === 'major-miss' || result === 'big-miss'
}

export function isFullSwingResult(result: ShotResult): result is FullSwingResult {
  return result === 'good' || result === 'playable-miss' || result === 'major-miss'
}

export function isWedgeResult(result: ShotResult): result is WedgeResult {
  return (
    result === 'target-zone' ||
    result === 'inside-target' ||
    result === 'slight-miss' ||
    result === 'big-miss'
  )
}

export function isLagResult(result: ShotResult): result is LagResult {
  return (
    result === 'inside-3' ||
    result === 'three-to-six' ||
    result === 'more-than-6'
  )
}

export function isShortPuttResult(
  result: ShotResult,
): result is ShortPuttResult {
  return result === 'made' || result === 'missed'
}

export function isDriverMiss(value: string): value is DriverMissType {
  return (
    value === 'left' ||
    value === 'right' ||
    value === 'top' ||
    value === 'hook' ||
    value === 'slice' ||
    value === 'other'
  )
}

export function isIronMiss(value: string): value is IronMissType {
  return (
    value === 'fat' ||
    value === 'thin' ||
    value === 'left' ||
    value === 'right' ||
    value === 'shank' ||
    value === 'other'
  )
}

export function isWedgeMiss(value: string): value is WedgeMissType {
  return (
    value === 'short' ||
    value === 'long' ||
    value === 'left' ||
    value === 'right' ||
    value === 'poor-contact' ||
    value === 'other'
  )
}
