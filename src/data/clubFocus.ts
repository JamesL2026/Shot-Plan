import type { ClubFocus, ClubFocusBySymptom, SymptomId } from '../types'

export interface ClubFocusQuestion {
  symptomId: SymptomId
  prompt: string
  options: { value: ClubFocus; label: string }[]
}

/** Symptoms that get a club follow-up after check-in. */
export const clubFocusQuestions: ClubFocusQuestion[] = [
  {
    symptomId: 'slice',
    prompt: 'Where did you notice this the most?',
    options: [
      { value: 'driver', label: 'Driver' },
      { value: 'irons', label: 'Irons' },
      { value: 'both', label: 'Both' },
    ],
  },
  {
    symptomId: 'hook',
    prompt: 'Where did you notice this the most?',
    options: [
      { value: 'driver', label: 'Driver' },
      { value: 'irons', label: 'Irons' },
      { value: 'both', label: 'Both' },
    ],
  },
  {
    symptomId: 'fat',
    prompt: 'What were you hitting?',
    options: [
      { value: 'irons', label: 'Irons' },
      { value: 'wedges', label: 'Wedges' },
      { value: 'both', label: 'Both' },
    ],
  },
  {
    symptomId: 'thin',
    prompt: 'What were you hitting?',
    options: [
      { value: 'irons', label: 'Irons' },
      { value: 'wedges', label: 'Wedges' },
      { value: 'both', label: 'Both' },
    ],
  },
]

export function needsClubFocus(symptomId: SymptomId): boolean {
  return clubFocusQuestions.some((q) => q.symptomId === symptomId)
}

export function getClubFocusQuestion(
  symptomId: SymptomId,
): ClubFocusQuestion | undefined {
  return clubFocusQuestions.find((q) => q.symptomId === symptomId)
}

/** Ordered list of follow-ups for the symptoms the golfer picked. */
export function clubFocusQueue(symptomIds: SymptomId[]): ClubFocusQuestion[] {
  return symptomIds
    .map((id) => getClubFocusQuestion(id))
    .filter((q): q is ClubFocusQuestion => q !== undefined)
}

export function isClubFocus(value: unknown): value is ClubFocus {
  return (
    value === 'driver' ||
    value === 'irons' ||
    value === 'wedges' ||
    value === 'both'
  )
}

export function isValidClubFocusForSymptom(
  symptomId: SymptomId,
  value: ClubFocus,
): boolean {
  const question = getClubFocusQuestion(symptomId)
  if (!question) return false
  return question.options.some((opt) => opt.value === value)
}

export function formatClubFocusLabel(focus: ClubFocus | undefined): string | null {
  if (!focus || focus === 'both') return null
  if (focus === 'driver') return 'Driver'
  if (focus === 'wedges') return 'Wedges'
  return 'Irons'
}

export function parseClubFocusMap(raw: unknown): ClubFocusBySymptom | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const out: ClubFocusBySymptom = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      (key === 'slice' ||
        key === 'hook' ||
        key === 'fat' ||
        key === 'thin' ||
        key === 'chipping' ||
        key === 'putting') &&
      isClubFocus(value) &&
      isValidClubFocusForSymptom(key, value)
    ) {
      out[key] = value
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}
