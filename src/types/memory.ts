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

export type RoundStatus = 'in-progress' | 'completed'

export type StoodOut =
  | 'kept-happening'
  | 'played-well'
  | 'decisions'
  | 'mental'
  | 'not-sure'

export type TransferFeel =
  | 'clearly-better'
  | 'somewhat-better'
  | 'no-change'
  | 'worse'
  | 'not-enough'

export type ObservationResult = 'worked' | 'showed-up'

export type TestKind =
  | 'contact'
  | 'direction'
  | 'distance'
  | 'putting'
  | 'process'
  | 'custom'

export type PracticeResult = 'yes' | 'no'

export type AdjustmentSource = 'practice' | 'round' | 'manual'

export interface RoundMoment {
  id: string
  roundId: string
  timestamp: string
  createdAt: string
  type: MomentType
  subcategory: MomentSubcategory
  note?: string
  holeNumber?: number
}

export interface SavedRound {
  id: string
  createdAt: string
  completedAt: string | null
  status: RoundStatus
  moments: RoundMoment[]
  holesPlayed?: 9 | 18
  remember?: string
  transcript?: string
  wrapUp?: boolean
  watchNextArea?: FocusArea
  watchNextTitle?: string
  watchNextMomentId?: string
  stoodOut?: StoodOut
}

export interface Focus {
  id: string
  title: string
  area: FocusArea
  createdAt: string
  updatedAt?: string
  status: FocusStatus
  reason?: string
}

export interface PracticeSession {
  id: string
  focusId: string
  date: string
  club?: string
  testType: TestKind
  successCriteria: string
  result?: string
  successCount?: number
  attemptCount?: number
  previousResult?: string
  feltDifferent?: PracticeResult
  notes?: string
  watchNext?: string
  transcript?: string
}

export interface PracticeAttempt {
  id: string
  practiceSessionId: string
  sequence: number
  result: string
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
  result: ObservationResult
  createdAt: string
  transferFeel?: TransferFeel
}

export interface Adjustment {
  id: string
  focusId: string
  createdAt: string
  whatITried: string
  source: AdjustmentSource
  workedAt?: string
}

export interface TalkFields {
  workingOn: string
  tried: string
  worked: string
  didNotWork: string
  remember: string
}

export type PatternStatus =
  | 'unclear'
  | 'one-off'
  | 'watching'
  | 'starting-to-repeat'
  | 'recurring'
  | 'improving'
  | 'not-transferring'
  | 'working'

export interface FocusInsight {
  focusId: string
  title: string
  area: FocusArea
  roundsSeen: number
  roundsWindow: number
  pattern: PatternStatus
  practiceLine: string
  courseLine: string
  statusLine: string
}
