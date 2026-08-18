/** Feedback survey — local-first, backend-ready. */

export type GolferType =
  | 'competitive'
  | 'weekend'
  | 'casual'
  | 'beginner'

export type PlayFrequency =
  | 'multiple-week'
  | 'once-week'
  | 'few-month'
  | 'occasionally'

export type PracticeFrequency =
  | 'three-plus-week'
  | 'one-two-week'
  | 'few-month'
  | 'rarely'

export type FrustrationArea =
  | 'driver'
  | 'irons'
  | 'wedges'
  | 'chipping'
  | 'putting'

export type StrugglePattern =
  | 'slice'
  | 'hook'
  | 'fat'
  | 'thin'
  | 'push'
  | 'pull'
  | 'distance'
  | 'inconsistent-contact'
  | 'three-putts'
  | 'poor-chipping'

export type PlanUsefulness = 1 | 2 | 3 | 4 | 5

export type UseAgainIntent = 'definitely' | 'probably' | 'maybe' | 'probably-not'

export type RecommendIntent = 'yes' | 'maybe' | 'no'

export type RemindedAnswer = 'yes' | 'not-yet' | 'no'

export type MostUsefulPart =
  | 'what-to-practice'
  | 'remembering-tried'
  | 'what-worked'
  | 'practice-to-round'
  | 'saving-from-round'
  | 'history-patterns'
  | 'something-else'

export type MostWorkPart =
  | 'logging-round'
  | 'practice-tracking'
  | 'debriefing'
  | 'typing-notes'
  | 'nothing'
  | 'something-else'

export type FeedbackKind = 'help-improve' | 'quick-baseline'

export interface FeedbackUsage {
  completedPractice: boolean
  completedRound: boolean
  roundCount: number
  practiceCount: number
  voiceUsed: boolean
}

export type ProfileAccuracyAnswer = 'accurate' | 'mostly' | 'inaccurate'

export type PracticeChangeAnswer = 'yes' | 'maybe' | 'no'

export interface FeedbackAnswers {
  kind?: FeedbackKind
  golferType?: GolferType
  playFrequency?: PlayFrequency
  practiceFrequency?: PracticeFrequency
  frustration?: FrustrationArea
  struggles?: StrugglePattern[]
  planUsefulness?: PlanUsefulness
  improvementIdea?: string
  useAgain?: UseAgainIntent
  recommend?: RecommendIntent
  remindedOfForgotten?: RemindedAnswer
  mostUseful?: MostUsefulPart
  mostWork?: MostWorkPart
  oneChange?: string
  profileAccuracy?: ProfileAccuracyAnswer
  wouldChangePractice?: PracticeChangeAnswer
  assessmentId?: string
  overallScore?: number
  strongest?: string
  opportunity?: string
}

export interface FeedbackSubmission {
  id: string
  createdAt: string
  /** App version / build label for later analytics. */
  source: 'shotplan-web'
  /** Path where the user opened feedback. */
  openedFrom: string
  /** Silent local usage. Not asked. No personal data. */
  usage?: FeedbackUsage
  answers: FeedbackAnswers
}

export type FeedbackQuestionId = keyof FeedbackAnswers
