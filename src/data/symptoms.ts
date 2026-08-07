import type { Symptom, SymptomId } from '../types'

export const symptoms: Symptom[] = [
  {
    id: 'slice',
    label: 'Slice',
    description: 'Ball curves hard right (lefty: curves left)',
  },
  {
    id: 'hook',
    label: 'Hook',
    description: 'Ball curves hard left (lefty: curves right)',
  },
  {
    id: 'fat',
    label: 'Fat shots',
    description: 'Hitting the ground before the ball',
  },
  {
    id: 'thin',
    label: 'Thin shots',
    description: 'Catching the ball too high on the face',
  },
  {
    id: 'chipping',
    label: 'Chipping',
    description: 'Chips go fat, thin, or leave you guessing on distance',
  },
  {
    id: 'putting',
    label: 'Putting',
    description: 'Hard to start putts on line or control speed',
  },
]

const symptomIdSet = new Set<string>(symptoms.map((s) => s.id))

export function isSymptomId(value: string): value is SymptomId {
  return symptomIdSet.has(value)
}

export function getSymptom(id: SymptomId): Symptom | undefined {
  return symptoms.find((s) => s.id === id)
}

/** e.g. "Slice" or "Slice and Fat shots" */
export function formatSymptomList(ids: SymptomId[]): string {
  const labels = ids
    .map((id) => getSymptom(id)?.label)
    .filter((label): label is string => Boolean(label))

  if (labels.length === 0) return ''
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`
}
