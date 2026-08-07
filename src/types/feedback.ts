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

export interface FeedbackAnswers {
  golferType?: GolferType
  playFrequency?: PlayFrequency
  practiceFrequency?: PracticeFrequency
  frustration?: FrustrationArea
  struggles?: StrugglePattern[]
  planUsefulness?: PlanUsefulness
  improvementIdea?: string
  useAgain?: UseAgainIntent
  recommend?: RecommendIntent
}

export interface FeedbackSubmission {
  id: string
  createdAt: string
  /** App version / build label for later analytics. */
  source: 'shotplan-web'
  /** Path where the user opened feedback. */
  openedFrom: string
  answers: FeedbackAnswers
}

export type FeedbackQuestionId = keyof FeedbackAnswers
