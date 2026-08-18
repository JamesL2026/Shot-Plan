import type {
  MostUsefulPart,
  MostWorkPart,
  PlanUsefulness,
  RemindedAnswer,
  UseAgainIntent,
} from '../types/feedback'

export interface FeedbackChoice<T extends string | number> {
  value: T
  label: string
}

export const usefulnessChoices: FeedbackChoice<PlanUsefulness>[] = [
  { value: 5, label: 'Yes' },
  { value: 3, label: 'A little' },
  { value: 1, label: 'No' },
]

export const useAgainChoices: FeedbackChoice<UseAgainIntent>[] = [
  { value: 'definitely', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'probably-not', label: 'No' },
]

export const remindedChoices: FeedbackChoice<RemindedAnswer>[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'not-yet', label: 'Not yet' },
  { value: 'no', label: 'No' },
]

export const mostUsefulChoices: FeedbackChoice<MostUsefulPart>[] = [
  { value: 'what-to-practice', label: 'Knowing what to practice' },
  { value: 'remembering-tried', label: 'Remembering what I tried' },
  { value: 'what-worked', label: 'Seeing what worked before' },
  { value: 'practice-to-round', label: 'Connecting practice to a round' },
  { value: 'saving-from-round', label: 'Saving things from a round' },
  { value: 'history-patterns', label: 'History / patterns' },
  { value: 'something-else', label: 'Something else' },
]

export const mostWorkChoices: FeedbackChoice<MostWorkPart>[] = [
  { value: 'logging-round', label: 'Logging during a round' },
  { value: 'practice-tracking', label: 'Practice tracking' },
  { value: 'debriefing', label: 'Debriefing' },
  { value: 'typing-notes', label: 'Typing notes' },
  { value: 'nothing', label: 'Nothing' },
  { value: 'something-else', label: 'Something else' },
]
