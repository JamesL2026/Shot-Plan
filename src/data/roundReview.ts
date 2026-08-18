import type {
  ApproachSubcategory,
  CategoryCount,
  DecisionSubcategory,
  HoleReview,
  JournalCategory,
  MemorableReason,
  MentalSubcategory,
  Mistake,
  MistakeCategory,
  MistakeSubcategory,
  PenaltySubcategory,
  PositiveCategory,
  PuttingSubcategory,
  Round,
  RoundFeel,
  RoundSummary,
  ShortGameSubcategory,
  SubcategoryCount,
  TeeSubcategory,
} from '../types/round'

export const HOLES_IN_ROUND = 18

export const MISTAKE_CATEGORIES: {
  value: MistakeCategory
  label: string
}[] = [
  { value: 'tee', label: 'Tee' },
  { value: 'approach', label: 'Approach' },
  { value: 'short-game', label: 'Short Game' },
  { value: 'putting', label: 'Putting' },
  { value: 'penalty', label: 'Penalty' },
  { value: 'decision', label: 'Decision' },
  { value: 'mental', label: 'Mental' },
]

export const TEE_SUBS: { value: TeeSubcategory; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'poor-contact', label: 'Poor Contact' },
  { value: 'trouble', label: 'Trouble' },
  { value: 'penalty', label: 'Penalty' },
  { value: 'other', label: 'Other' },
]

export const APPROACH_SUBS: { value: ApproachSubcategory; label: string }[] = [
  { value: 'fat', label: 'Fat' },
  { value: 'thin', label: 'Thin' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'wrong-club', label: 'Wrong Club' },
  { value: 'poor-distance', label: 'Poor Distance' },
  { value: 'other', label: 'Other' },
]

export const SHORT_GAME_SUBS: {
  value: ShortGameSubcategory
  label: string
}[] = [
  { value: 'chunked', label: 'Chunked' },
  { value: 'skulled', label: 'Skulled' },
  { value: 'poor-distance', label: 'Poor Distance' },
  { value: 'poor-lie', label: 'Poor Lie' },
  { value: 'other', label: 'Other' },
]

export const PUTTING_SUBS: { value: PuttingSubcategory; label: string }[] = [
  { value: 'three-putt', label: 'Three putt' },
  { value: 'short-miss', label: 'Short Miss' },
  { value: 'poor-speed', label: 'Poor Speed' },
  { value: 'poor-read', label: 'Poor Read' },
  { value: 'other', label: 'Other' },
]

export const PENALTY_SUBS: { value: PenaltySubcategory; label: string }[] = [
  { value: 'ob', label: 'OB' },
  { value: 'water', label: 'Water' },
  { value: 'lost-ball', label: 'Lost Ball' },
  { value: 'unplayable', label: 'Unplayable' },
  { value: 'other', label: 'Other' },
]

export const DECISION_SUBS: { value: DecisionSubcategory; label: string }[] = [
  { value: 'wrong-target', label: 'Wrong Target' },
  { value: 'hero-shot', label: 'Hero Shot' },
  { value: 'wrong-club', label: 'Wrong Club' },
  { value: 'aggressive-choice', label: 'Aggressive Choice' },
  { value: 'poor-course-management', label: 'Poor Course Management' },
  { value: 'other', label: 'Other' },
]

export const MENTAL_SUBS: { value: MentalSubcategory; label: string }[] = [
  { value: 'rushed', label: 'Rushed' },
  { value: 'lost-focus', label: 'Lost Focus' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'poor-routine', label: 'Poor Routine' },
  { value: 'other', label: 'Other' },
]

export const SUBS_BY_CATEGORY: Record<
  MistakeCategory,
  { value: MistakeSubcategory; label: string }[]
> = {
  tee: TEE_SUBS,
  approach: APPROACH_SUBS,
  'short-game': SHORT_GAME_SUBS,
  putting: PUTTING_SUBS,
  penalty: PENALTY_SUBS,
  decision: DECISION_SUBS,
  mental: MENTAL_SUBS,
}

export const POSITIVE_CHOICES: { value: PositiveCategory; label: string }[] = [
  { value: 'great-drive', label: 'Great Drive' },
  { value: 'great-approach', label: 'Great Approach' },
  { value: 'great-wedge', label: 'Great Wedge' },
  { value: 'great-save', label: 'Great Save' },
  { value: 'great-putt', label: 'Great Putt' },
  { value: 'great-decision', label: 'Great Decision' },
  { value: 'great-mental-reset', label: 'Great Mental Reset' },
]

export const MEMORABLE_REASONS: { value: MemorableReason; label: string }[] = [
  { value: 'great-execution', label: 'Great execution' },
  { value: 'bad-decision', label: 'Bad decision' },
  { value: 'mental-mistake', label: 'Mental mistake' },
  { value: 'bad-break', label: 'Bad break' },
  { value: 'unexpected-result', label: 'Unexpected result' },
  { value: 'other', label: 'Other' },
]

export const ROUND_FEEL_OPTIONS: { value: RoundFeel; label: string }[] = [
  { value: 'great', label: 'Great' },
  { value: 'pretty-good', label: 'Pretty good' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'frustrating', label: 'Frustrating' },
]

export const JOURNAL_CATEGORIES: { value: JournalCategory; label: string }[] = [
  { value: 'driver', label: 'Driver' },
  { value: 'irons', label: 'Irons' },
  { value: 'wedges', label: 'Wedges' },
  { value: 'short-game', label: 'Short Game' },
  { value: 'putting', label: 'Putting' },
  { value: 'mental', label: 'Mental' },
  { value: 'decisions', label: 'Decisions' },
]

export const COMMON_SCORES = [3, 4, 5, 6, 7, 8] as const

export function categoryLabel(category: MistakeCategory): string {
  return MISTAKE_CATEGORIES.find((item) => item.value === category)?.label ?? category
}

export function subcategoryLabel(
  category: MistakeCategory,
  subcategory: MistakeSubcategory,
): string {
  return (
    SUBS_BY_CATEGORY[category].find((item) => item.value === subcategory)?.label ??
    subcategory
  )
}

export function createEmptyRound(): Round {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    completedAt: null,
    status: 'in-progress',
    currentHole: 1,
    holes: [],
  }
}

export function allMistakes(holes: HoleReview[]): Mistake[] {
  return holes.flatMap((hole) => hole.mistakes)
}

export function countByCategory(mistakes: Mistake[]): CategoryCount[] {
  const counts = new Map<MistakeCategory, number>()
  for (const mistake of mistakes) {
    counts.set(mistake.category, (counts.get(mistake.category) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
}

export function countBySubcategory(mistakes: Mistake[]): SubcategoryCount[] {
  const counts = new Map<string, SubcategoryCount>()
  for (const mistake of mistakes) {
    const key = `${mistake.category}:${mistake.subcategory}`
    const existing = counts.get(key)
    if (existing) {
      existing.count += 1
    } else {
      counts.set(key, {
        category: mistake.category,
        subcategory: mistake.subcategory,
        count: 1,
      })
    }
  }
  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.subcategory.localeCompare(b.subcategory),
  )
}

export function buildInsight(holes: HoleReview[]): string {
  const mistakes = allMistakes(holes)
  if (mistakes.length === 0) {
    return 'You logged a clean card. Nothing stood out as a mistake today.'
  }

  const categories = countByCategory(mistakes)
  const top = categories[0]
  const second = categories[1]
  const subs = countBySubcategory(mistakes)
  const topSub = subs[0]
  const inTopCategory = mistakes.filter((item) => item.category === top.category)

  if (
    top.category === 'putting' &&
    topSub?.category === 'putting' &&
    topSub.subcategory === 'three-putt' &&
    topSub.count >= 2 &&
    inTopCategory.length >= 2
  ) {
    return `${topSub.count} of your ${inTopCategory.length} putting mistakes were three-putts.`
  }

  if (topSub && topSub.count >= 2 && topSub.category === top.category) {
    return `${subcategoryLabel(topSub.category, topSub.subcategory)} was the most common issue in this round.`
  }

  if (second && top.count > second.count) {
    return `You logged more ${categoryLabel(top.category).toLowerCase()} mistakes than ${categoryLabel(second.category).toLowerCase()} mistakes today.`
  }

  return `${categoryLabel(top.category)} was the most common category today.`
}

export function buildSummary(holes: HoleReview[]): RoundSummary {
  const mistakes = allMistakes(holes)
  const mistakeCounts = countByCategory(mistakes)
  const topCategory = mistakeCounts[0]?.category
  const topSubcategories = topCategory
    ? countBySubcategory(mistakes.filter((item) => item.category === topCategory))
    : []

  return {
    totalScore: holes.reduce((sum, hole) => sum + hole.score, 0),
    holesPlayed: holes.length,
    mistakeCounts,
    topSubcategories,
    insight: buildInsight(holes),
  }
}

export function formatRoundDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
