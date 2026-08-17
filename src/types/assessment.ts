/**
 * Baseline assessment types.
 *
 * Active MVP mode: Quick Baseline (15 shots).
 * Reserved for later: Full Combine, launch monitor, video, and Transfer Gap
 * (block vs variable practice). Do not add those in the UI until those milestones.
 */
export type AssessmentSource = 'manual' | 'launch-monitor' | 'video'

export type AssessmentMode = 'quick-baseline' | 'full-combine'

export type AssessmentTestId =
  | 'driver-control'
  | 'iron-control'
  | 'wedge-control'
  | 'lag-putting'
  | 'short-putting'

export type FullSwingResult = 'good' | 'playable-miss' | 'major-miss'

export type WedgeResult = 'target-zone' | 'inside-target' | 'slight-miss' | 'big-miss'

export type LagResult = 'inside-3' | 'three-to-six' | 'more-than-6'

export type ShortPuttResult = 'made' | 'missed'

export type ShotResult =
  | FullSwingResult
  | WedgeResult
  | LagResult
  | ShortPuttResult

export type DriverMissType = 'left' | 'right' | 'top' | 'hook' | 'slice' | 'other'

export type IronMissType = 'fat' | 'thin' | 'left' | 'right' | 'shank' | 'other'

export type WedgeMissType =
  | 'short'
  | 'long'
  | 'left'
  | 'right'
  | 'poor-contact'
  | 'other'

export type MissType = DriverMissType | IronMissType | WedgeMissType

export type ShotScore = 0 | 1 | 2

export interface AssessmentShot {
  id: string
  testId: AssessmentTestId
  shotNumber: number
  club: string
  result: ShotResult
  missType?: MissType
  score: ShotScore
  timestamp: string
  /** Optional target distance in yards (wedge). */
  distanceYards?: number
}

export interface AssessmentTest {
  id: AssessmentTestId
  title: string
  shots: AssessmentShot[]
  rawPoints: number
  maxPoints: number
  shotPlanScore: number
}

export interface SkillScore {
  testId: AssessmentTestId
  label: string
  score: number
}

export interface CommonMiss {
  type: MissType
  label: string
  count: number
}

export interface AssessmentResult {
  overallScore: number
  skills: SkillScore[]
  strongest: SkillScore
  biggestOpportunity: SkillScore
  opportunitySentence: string
  mostCommonMiss: CommonMiss | null
}

export interface Assessment {
  id: string
  createdAt: string
  completedAt: string | null
  source: AssessmentSource
  mode: AssessmentMode
  tests: AssessmentTest[]
  result: AssessmentResult | null
  feedback?: AssessmentFeedback
}

export type ProfileAccuracy = 'accurate' | 'mostly' | 'inaccurate'

export type AccuracyReason =
  | 'sample-too-small'
  | 'score-wrong'
  | 'strongest-wrong'
  | 'opportunity-wrong'
  | 'not-course'
  | 'other'

export type PracticeChange = 'yes' | 'maybe' | 'no'

export interface AssessmentFeedback {
  assessmentId: string
  timestamp: string
  profileAccuracy?: ProfileAccuracy
  accuracyReason?: AccuracyReason
  accuracyComment?: string
  wouldChangePractice?: PracticeChange
}

export interface AssessmentDraft {
  assessment: Assessment
  testIndex: number
  /** In-progress log for the current test. Shots are saved only after Continue. */
  pendingLog?: Array<{
    result: ShotResult
    score: ShotScore
    missType?: MissType
  } | null>
}
