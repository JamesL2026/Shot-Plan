import type {
  FeedbackAnswers,
  FeedbackSubmission,
  FeedbackUsage,
} from '../types/feedback'
import { storage } from './memoryStorage'

const FEEDBACK_KEY = 'shotplan:feedback'

/**
 * Submits feedback to the server API and keeps a local copy on this device.
 */
export async function submitFeedback(input: {
  answers: FeedbackAnswers
  openedFrom: string
  usage?: FeedbackUsage
  id?: string
  createdAt?: string
}): Promise<FeedbackSubmission> {
  const submission: FeedbackSubmission = {
    id: input.id ?? crypto.randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    source: 'shotplan-web',
    openedFrom: input.openedFrom,
    usage: input.usage,
    answers: input.answers,
  }

  saveFeedbackLocally(submission)

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })
    if (!response.ok) {
      console.warn('Feedback API error', response.status, await response.text())
    }
  } catch (error) {
    console.warn('Feedback API unreachable; saved locally only.', error)
  }

  return submission
}

export function saveFeedbackLocally(submission: FeedbackSubmission): void {
  const existing = getFeedbackSubmissions().filter(
    (item) => item.id !== submission.id,
  )
  existing.unshift(submission)
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(existing))
  } catch {
    // Quota or private mode — still succeed in-memory for this session.
  }
}

export function getFeedbackSubmissions(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isFeedbackSubmission)
  } catch {
    return []
  }
}

export async function fetchFeedbackInbox(
  secret: string,
): Promise<FeedbackSubmission[]> {
  const response = await fetch('/api/feedback', {
    headers: { 'X-Feedback-Secret': secret },
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }
  const data: unknown = await response.json()
  if (!data || typeof data !== 'object') return []
  const submissions = (data as { submissions?: unknown }).submissions
  if (!Array.isArray(submissions)) return []
  return submissions.filter(isFeedbackSubmission)
}

export async function deleteFeedbackSubmission(
  secret: string,
  id: string,
): Promise<void> {
  const response = await fetch(`/api/feedback?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'X-Feedback-Secret': secret },
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Delete failed (${response.status})`)
  }
}

/** Local calendar day key for grouping (YYYY-MM-DD). */
export function feedbackDayKey(iso: string): string {
  const date = new Date(iso)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Short tab label like 8/7. */
export function feedbackDayLabel(dayKey: string): string {
  const [, month, day] = dayKey.split('-')
  return `${Number(month)}/${Number(day)}`
}

function isFeedbackSubmission(value: unknown): value is FeedbackSubmission {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.createdAt === 'string' &&
    s.source === 'shotplan-web' &&
    typeof s.openedFrom === 'string' &&
    typeof s.answers === 'object' &&
    s.answers !== null
  )
}

export function feedbackKindLabel(kind?: string): string {
  return kind === 'quick-baseline' ? 'Quick Baseline' : 'Help Improve'
}

export function profileAccuracyLabel(value?: string): string {
  if (value === 'accurate') return 'Yes'
  if (value === 'mostly') return 'Mostly'
  if (value === 'inaccurate') return 'No'
  return value ?? ''
}

export function practiceChangeLabel(value?: string): string {
  if (value === 'yes') return 'Yes'
  if (value === 'maybe') return 'Maybe'
  if (value === 'no') return 'No'
  return value ?? ''
}

export function collectFeedbackUsage(): FeedbackUsage {
  const rounds = storage.getRounds()
  const sessions = storage.getPracticeSessions()
  const draft = storage.getRoundDraft()
  return {
    completedPractice: sessions.length > 0,
    completedRound: rounds.length > 0,
    roundCount: rounds.length,
    practiceCount: sessions.length,
    voiceUsed:
      rounds.some((round) => Boolean(round.transcript?.trim())) ||
      sessions.some((session) => Boolean(session.transcript?.trim())) ||
      Boolean(draft?.transcript?.trim()),
  }
}

export function usefulnessLabel(value?: number): string {
  if (value === 5) return 'Yes'
  if (value === 4) return 'Very helpful'
  if (value === 3) return 'A little'
  if (value === 2) return 'Slightly'
  if (value === 1) return 'No'
  return value != null ? `${value} / 5` : ''
}

export function useAgainLabel(value?: string): string {
  if (value === 'definitely' || value === 'probably') return 'Yes'
  if (value === 'maybe') return 'Maybe'
  if (value === 'probably-not') return 'No'
  return value ?? ''
}

export function remindedLabel(value?: string): string {
  if (value === 'yes') return 'Yes'
  if (value === 'not-yet') return 'Not yet'
  if (value === 'no') return 'No'
  return value ?? ''
}

export function mostUsefulLabel(value?: string): string {
  switch (value) {
    case 'what-to-practice':
      return 'Knowing what to practice'
    case 'remembering-tried':
      return 'Remembering what I tried'
    case 'what-worked':
      return 'Seeing what worked before'
    case 'practice-to-round':
      return 'Connecting practice to a round'
    case 'saving-from-round':
      return 'Saving things from a round'
    case 'history-patterns':
      return 'History / patterns'
    case 'something-else':
      return 'Something else'
    default:
      return value ?? ''
  }
}

export function mostWorkLabel(value?: string): string {
  switch (value) {
    case 'logging-round':
      return 'Logging during a round'
    case 'practice-tracking':
      return 'Practice tracking'
    case 'debriefing':
      return 'Debriefing'
    case 'typing-notes':
      return 'Typing notes'
    case 'nothing':
      return 'Nothing'
    case 'something-else':
      return 'Something else'
    default:
      return value ?? ''
  }
}

export { FEEDBACK_KEY }
