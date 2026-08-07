import type {
  FrustrationArea,
  GolferType,
  PlanUsefulness,
  PlayFrequency,
  PracticeFrequency,
  RecommendIntent,
  StrugglePattern,
  UseAgainIntent,
} from '../types/feedback'

export interface FeedbackChoice<T extends string | number> {
  value: T
  label: string
}

export type FeedbackStepId =
  | 'intro'
  | 'golferType'
  | 'playFrequency'
  | 'practiceFrequency'
  | 'frustration'
  | 'struggles'
  | 'planUsefulness'
  | 'improvementIdea'
  | 'useAgain'
  | 'recommend'
  | 'thanks'

export const feedbackSteps: FeedbackStepId[] = [
  'intro',
  'golferType',
  'playFrequency',
  'practiceFrequency',
  'frustration',
  'struggles',
  'planUsefulness',
  'improvementIdea',
  'useAgain',
  'recommend',
  'thanks',
]

/** Question steps only (excludes intro + thanks) for progress. */
export const feedbackQuestionSteps: FeedbackStepId[] = feedbackSteps.filter(
  (step) => step !== 'intro' && step !== 'thanks',
)

export const golferTypeChoices: FeedbackChoice<GolferType>[] = [
  { value: 'competitive', label: 'Competitive golfer' },
  { value: 'weekend', label: 'Weekend golfer' },
  { value: 'casual', label: 'Casual golfer' },
  { value: 'beginner', label: 'Beginner' },
]

export const playFrequencyChoices: FeedbackChoice<PlayFrequency>[] = [
  { value: 'multiple-week', label: 'Multiple times a week' },
  { value: 'once-week', label: 'Once a week' },
  { value: 'few-month', label: 'A few times a month' },
  { value: 'occasionally', label: 'Occasionally' },
]

export const practiceFrequencyChoices: FeedbackChoice<PracticeFrequency>[] = [
  { value: 'three-plus-week', label: '3+ times a week' },
  { value: 'one-two-week', label: '1 to 2 times a week' },
  { value: 'few-month', label: 'A few times a month' },
  { value: 'rarely', label: 'Rarely' },
]

export const frustrationChoices: FeedbackChoice<FrustrationArea>[] = [
  { value: 'driver', label: 'Driver' },
  { value: 'irons', label: 'Irons' },
  { value: 'wedges', label: 'Wedges' },
  { value: 'chipping', label: 'Chipping' },
  { value: 'putting', label: 'Putting' },
]

export const struggleChoices: FeedbackChoice<StrugglePattern>[] = [
  { value: 'slice', label: 'Slice' },
  { value: 'hook', label: 'Hook' },
  { value: 'fat', label: 'Fat shots' },
  { value: 'thin', label: 'Thin shots' },
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'distance', label: 'Distance control' },
  { value: 'inconsistent-contact', label: 'Inconsistent contact' },
  { value: 'three-putts', label: 'Three putts' },
  { value: 'poor-chipping', label: 'Poor chipping' },
]

export const usefulnessChoices: FeedbackChoice<PlanUsefulness>[] = [
  { value: 1, label: 'Not useful' },
  { value: 2, label: 'Slightly useful' },
  { value: 3, label: 'Helpful' },
  { value: 4, label: 'Very helpful' },
  { value: 5, label: 'Exactly what I needed' },
]

export const useAgainChoices: FeedbackChoice<UseAgainIntent>[] = [
  { value: 'definitely', label: 'Definitely' },
  { value: 'probably', label: 'Probably' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'probably-not', label: 'Probably not' },
]

export const recommendChoices: FeedbackChoice<RecommendIntent>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
]

export function starsForUsefulness(value: PlanUsefulness): string {
  return '★'.repeat(value)
}
