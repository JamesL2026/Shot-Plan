/** ShotPlan memory loop — observations, not diagnoses. */

export type MomentType = 'shot' | 'decision' | 'mental' | 'good'

export type ShotSubcategory =
  | 'fat'
  | 'thin'
  | 'left'
  | 'right'
  | 'poor-distance'
  | 'poor-contact'
  | 'other'

export type DecisionSubcategory =
  | 'wrong-club'
  | 'wrong-target'
  | 'too-aggressive'
  | 'hero-shot'
  | 'other'

export type MentalSubcategory =
  | 'rushed'
  | 'lost-focus'
  | 'frustrated'
  | 'poor-routine'
  | 'other'

export type GoodSubcategory =
  | 'great-drive'
  | 'great-approach'
  | 'great-wedge'
  | 'great-save'
  | 'great-putt'
  | 'great-decision'
  | 'reset-well'
  | 'other'

export type MomentSubcategory =
  | ShotSubcategory
  | DecisionSubcategory
  | MentalSubcategory
  | GoodSubcategory

export type FocusArea =
  | 'iron-contact'
  | 'wedge-distance'
  | 'driver-direction'
  | 'putting-speed'
  | 'start-line'
  | 'decision-routine'
  | 'mental-reset'
  | 'custom'

export type FocusStatus = 'active' | 'completed' | 'paused' | 'archived'

export type StoodOut =
  | 'kept-happening'
  | 'one-mistake'
  | 'played-well'
  | 'decisions'
  | 'mental'
  | 'not-sure'

export type PracticeTestType =
  | 'contact'
  | 'direction'
  | 'distance'
  | 'putting'
  | 'process'
  | 'custom'

export type AttemptResult = string

export type CourseObservationResult = 'worked' | 'showed-up'

export type TransferFeel =
  | 'clearly-better'
  | 'somewhat-better'
  | 'no-change'
  | 'worse'
  | 'not-enough'

export type ExperimentHelp = 'yes' | 'somewhat' | 'no' | 'not-sure'

export type PatternLabel =
  | 'one-off'
  | 'watching'
  | 'starting-to-repeat'
  | 'recurring'
  | 'improving'
  | 'not-transferring'
  | 'working'
  | 'unclear'

export interface Moment {
  id: string
  roundId: string
  timestamp: string
  createdAt: string
  type: MomentType
  subcategory: MomentSubcategory
  note?: string
  holeNumber?: number
}

export interface Round {
  id: string
  createdAt: string
  completedAt: string | null
  status: 'in-progress' | 'completed'
  moments: Moment[]
  holesPlayed?: 9 | 18
  wrapUp?: boolean
  stoodOut?: StoodOut
  remember?: string
  focusHelped?: ExperimentHelp
  watchNextArea?: FocusArea
  watchNextTitle?: string
  watchNextMomentId?: string
  transcript?: string
}

export interface Focus {
  id: string
  title: string
  area: FocusArea
  reason?: string
  whyItMatters?: string
  createdAt: string
  updatedAt?: string
  status: FocusStatus
  notes?: string
}

export interface PracticeAttempt {
  id: string
  practiceSessionId: string
  sequence: number
  result: AttemptResult
  note?: string
}

export interface PracticeSession {
  id: string
  focusId: string
  date: string
  club?: string
  testType: PracticeTestType
  successCriteria: string
  result?: string
  successCount?: number
  attemptCount?: number
  previousResult?: string
  feltDifferent?: string
  notes?: string
  watchNext?: string
  transcript?: string
  whatWasTried?: string
  baselineResult?: string
  baselineSuccessCount?: number
  baselineAttemptCount?: number
  testResult?: string
  transferResult?: string
  experimentHelped?: ExperimentHelp
}

export interface Adjustment {
  id: string
  focusId: string
  createdAt: string
  whatITried: string
  source: 'practice' | 'round' | 'manual'
  workedAt?: string
}

export interface SwingCheckpoint {
  id: string
  practiceSessionId: string
  club?: string
  focus: string
  localReference: string
  note?: string
  createdAt: string
}

export interface CourseObservation {
  id: string
  roundId: string
  focusId: string
  result: CourseObservationResult
  note?: string
  createdAt: string
  transferFeel?: TransferFeel
}

export interface ProgressInsight {
  focusId: string
  title: string
  area: FocusArea
  roundsSeen: number
  roundsWindow: number
  pattern: PatternLabel
  practiceLine: string
  courseLine: string
  statusLine: string
}
