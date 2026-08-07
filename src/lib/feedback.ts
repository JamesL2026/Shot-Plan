import type { FeedbackAnswers, FeedbackSubmission } from '../types/feedback'

const FEEDBACK_KEY = 'shotplan:feedback'

/**
 * Local feedback store.
 * Swap `submitFeedback` body later to POST to an API; keep the same signature.
 */
export async function submitFeedback(input: {
  answers: FeedbackAnswers
  openedFrom: string
}): Promise<FeedbackSubmission> {
  const submission: FeedbackSubmission = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: 'shotplan-web',
    openedFrom: input.openedFrom,
    answers: input.answers,
  }

  // Local persistence (backend hook point):
  // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(submission) })
  saveFeedbackLocally(submission)

  return submission
}

export function saveFeedbackLocally(submission: FeedbackSubmission): void {
  const existing = getFeedbackSubmissions()
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

export { FEEDBACK_KEY }
