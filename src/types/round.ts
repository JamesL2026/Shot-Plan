/** Round Review types. Lightweight hole reflection — not shot tracking. */

export type MistakeCategory =
  | 'tee'
  | 'approach'
  | 'short-game'
  | 'putting'
  | 'penalty'
  | 'decision'
  | 'mental'

export type TeeSubcategory =
  | 'left'
  | 'right'
  | 'poor-contact'
  | 'trouble'
  | 'penalty'
  | 'other'

export type ApproachSubcategory =
  | 'fat'
  | 'thin'
  | 'left'
  | 'right'
  | 'wrong-club'
  | 'poor-distance'
  | 'other'

export type ShortGameSubcategory =
  | 'chunked'
  | 'skulled'
  | 'poor-distance'
  | 'poor-lie'
  | 'other'

export type PuttingSubcategory =
  | 'three-putt'
  | 'short-miss'
  | 'poor-speed'
  | 'poor-read'
  | 'other'

export type PenaltySubcategory =
  | 'ob'
  | 'water'
  | 'lost-ball'
  | 'unplayable'
  | 'other'

export type DecisionSubcategory =
  | 'wrong-target'
  | 'hero-shot'
  | 'wrong-club'
  | 'aggressive-choice'
  | 'poor-course-management'
  | 'other'

export type MentalSubcategory =
  | 'rushed'
  | 'lost-focus'
  | 'frustrated'
  | 'poor-routine'
  | 'other'

export type MistakeSubcategory =
  | TeeSubcategory
  | ApproachSubcategory
  | ShortGameSubcategory
  | PuttingSubcategory
  | PenaltySubcategory
  | DecisionSubcategory
  | MentalSubcategory

export type MistakeType = MistakeCategory

export type PositiveCategory =
  | 'great-drive'
  | 'great-approach'
  | 'great-wedge'
  | 'great-save'
  | 'great-putt'
  | 'great-decision'
  | 'great-mental-reset'

export type MemorableReason =
  | 'great-execution'
  | 'bad-decision'
  | 'mental-mistake'
  | 'bad-break'
  | 'unexpected-result'
  | 'other'

export type RoundFeel = 'great' | 'pretty-good' | 'mixed' | 'frustrating'

export type JournalCategory =
  | 'driver'
  | 'irons'
  | 'wedges'
  | 'short-game'
  | 'putting'
  | 'mental'
  | 'decisions'

export interface Mistake {
  id: string
  roundId: string
  holeNumber: number
  category: MistakeCategory
  subcategory: MistakeSubcategory
  timestamp: string
  note?: string
}

export interface PositiveMoment {
  id: string
  roundId: string
  holeNumber: number
  category: PositiveCategory
  timestamp: string
}

export interface HoleReview {
  holeNumber: number
  score: number
  mistakes: Mistake[]
  positives: PositiveMoment[]
  rememberThisHole: boolean
  memorableReason?: MemorableReason
  memorableNote?: string
  completedAt: string
}

export interface CategoryCount {
  category: MistakeCategory
  count: number
}

export interface SubcategoryCount {
  category: MistakeCategory
  subcategory: MistakeSubcategory
  count: number
}

export interface RoundSummary {
  totalScore: number
  holesPlayed: number
  mistakeCounts: CategoryCount[]
  topSubcategories: SubcategoryCount[]
  insight: string
}

export interface RoundJournal {
  remember?: string
  workedWell: JournalCategory[]
  needsAttention?: JournalCategory
}

export interface Round {
  id: string
  createdAt: string
  completedAt: string | null
  status: 'in-progress' | 'completed'
  currentHole: number
  holes: HoleReview[]
  feel?: RoundFeel
  journal?: RoundJournal
  summary?: RoundSummary
}
