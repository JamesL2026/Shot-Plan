import { buildSummary } from '../data/roundReview'
import type {
  HoleReview,
  JournalCategory,
  MemorableReason,
  Mistake,
  MistakeCategory,
  MistakeSubcategory,
  PositiveMoment,
  PositiveCategory,
  Round,
  RoundFeel,
  RoundJournal,
} from '../types/round'

const ROUNDS_KEY = 'shotplan:rounds:v1'
const DRAFT_KEY = 'shotplan:round-draft:v1'

const CATEGORIES = new Set<MistakeCategory>([
  'tee',
  'approach',
  'short-game',
  'putting',
  'penalty',
  'decision',
  'mental',
])

const POSITIVES = new Set<PositiveCategory>([
  'great-drive',
  'great-approach',
  'great-wedge',
  'great-save',
  'great-putt',
  'great-decision',
  'great-mental-reset',
])

const FEELS = new Set<RoundFeel>([
  'great',
  'pretty-good',
  'mixed',
  'frustrating',
])

const JOURNAL_CATS = new Set<JournalCategory>([
  'driver',
  'irons',
  'wedges',
  'short-game',
  'putting',
  'mental',
  'decisions',
])

const MEMORABLE = new Set<MemorableReason>([
  'great-execution',
  'bad-decision',
  'mental-mistake',
  'bad-break',
  'unexpected-result',
  'other',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isMistake(value: unknown): value is Mistake {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.roundId === 'string' &&
    typeof value.holeNumber === 'number' &&
    CATEGORIES.has(value.category as MistakeCategory) &&
    typeof value.subcategory === 'string' &&
    typeof value.timestamp === 'string'
  )
}

function isPositive(value: unknown): value is PositiveMoment {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.roundId === 'string' &&
    typeof value.holeNumber === 'number' &&
    POSITIVES.has(value.category as PositiveCategory) &&
    typeof value.timestamp === 'string'
  )
}

function isHoleReview(value: unknown): value is HoleReview {
  if (!isRecord(value)) return false
  if (!Array.isArray(value.mistakes) || !value.mistakes.every(isMistake)) {
    return false
  }
  if (!Array.isArray(value.positives) || !value.positives.every(isPositive)) {
    return false
  }
  if (
    value.memorableReason !== undefined &&
    !MEMORABLE.has(value.memorableReason as MemorableReason)
  ) {
    return false
  }
  if (value.memorableNote !== undefined && typeof value.memorableNote !== 'string') {
    return false
  }
  return (
    typeof value.holeNumber === 'number' &&
    typeof value.score === 'number' &&
    typeof value.rememberThisHole === 'boolean' &&
    typeof value.completedAt === 'string'
  )
}

function isJournal(value: unknown): value is RoundJournal {
  if (!isRecord(value)) return false
  if (value.remember !== undefined && typeof value.remember !== 'string') {
    return false
  }
  if (!Array.isArray(value.workedWell)) return false
  if (!value.workedWell.every((item) => JOURNAL_CATS.has(item as JournalCategory))) {
    return false
  }
  if (
    value.needsAttention !== undefined &&
    !JOURNAL_CATS.has(value.needsAttention as JournalCategory)
  ) {
    return false
  }
  return true
}

function isRound(value: unknown): value is Round {
  if (!isRecord(value)) return false
  if (!Array.isArray(value.holes) || !value.holes.every(isHoleReview)) return false
  if (value.feel !== undefined && !FEELS.has(value.feel as RoundFeel)) return false
  if (value.journal !== undefined && !isJournal(value.journal)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    (value.completedAt === null || typeof value.completedAt === 'string') &&
    (value.status === 'in-progress' || value.status === 'completed') &&
    typeof value.currentHole === 'number'
  )
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

export function getRoundDraft(): Round | null {
  const parsed = readJson(DRAFT_KEY)
  if (!isRound(parsed) || parsed.status !== 'in-progress') return null
  return parsed
}

export function saveRoundDraft(round: Round): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(round))
}

export function clearRoundDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}

export function getCompletedRounds(): Round[] {
  const parsed = readJson(ROUNDS_KEY)
  if (!Array.isArray(parsed)) return []
  return parsed
    .filter(isRound)
    .filter((item) => item.status === 'completed' && item.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt ?? b.createdAt).getTime() -
        new Date(a.completedAt ?? a.createdAt).getTime(),
    )
}

export function getRoundById(id: string): Round | undefined {
  return getCompletedRounds().find((item) => item.id === id)
}

export function saveCompletedRound(round: Round): Round {
  const summary = buildSummary(round.holes)
  const completed: Round = {
    ...round,
    status: 'completed',
    completedAt: round.completedAt ?? new Date().toISOString(),
    summary,
  }
  const existing = getCompletedRounds().filter((item) => item.id !== completed.id)
  existing.unshift(completed)
  localStorage.setItem(ROUNDS_KEY, JSON.stringify(existing))
  clearRoundDraft()
  return completed
}

export function upsertHole(round: Round, hole: HoleReview): Round {
  const holes = round.holes.filter((item) => item.holeNumber !== hole.holeNumber)
  holes.push(hole)
  holes.sort((a, b) => a.holeNumber - b.holeNumber)
  return { ...round, holes }
}

export function makeMistake(
  roundId: string,
  holeNumber: number,
  category: MistakeCategory,
  subcategory: MistakeSubcategory,
): Mistake {
  return {
    id: crypto.randomUUID(),
    roundId,
    holeNumber,
    category,
    subcategory,
    timestamp: new Date().toISOString(),
  }
}

export function makePositive(
  roundId: string,
  holeNumber: number,
  category: PositiveCategory,
): PositiveMoment {
  return {
    id: crypto.randomUUID(),
    roundId,
    holeNumber,
    category,
    timestamp: new Date().toISOString(),
  }
}

export { ROUNDS_KEY, DRAFT_KEY }
