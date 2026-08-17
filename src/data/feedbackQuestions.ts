import type { PlanUsefulness, UseAgainIntent } from '../types/feedback'

export interface FeedbackChoice<T extends string | number> {
  value: T
  label: string
}

/** Three taps max. Short labels so people actually answer. */
export const usefulnessChoices: FeedbackChoice<PlanUsefulness>[] = [
  { value: 5, label: 'Yes' },
  { value: 3, label: 'Sort of' },
  { value: 1, label: 'No' },
]

export const useAgainChoices: FeedbackChoice<UseAgainIntent>[] = [
  { value: 'definitely', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'probably-not', label: 'No' },
]
