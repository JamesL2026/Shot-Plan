import type { SymptomId } from '../types'

export interface PrePracticeCheck {
  id: string
  title: string
  body: string
  timeNote: string
}

/** Quick reminders shown before practice begins (not full drills). */
export const prePracticeBySymptom: Partial<Record<SymptomId, PrePracticeCheck>> =
  {
    hook: {
      id: 'grip-check',
      title: 'Grip Check',
      body: 'Check that your lead hand is in a neutral position (around two visible knuckles).',
      timeNote: 'This should take less than 30 seconds.',
    },
  }

export function getPrePracticeChecks(
  symptomIds: SymptomId[],
): PrePracticeCheck[] {
  const seen = new Set<string>()
  const checks: PrePracticeCheck[] = []
  for (const id of symptomIds) {
    const check = prePracticeBySymptom[id]
    if (!check || seen.has(check.id)) continue
    seen.add(check.id)
    checks.push(check)
  }
  return checks
}
