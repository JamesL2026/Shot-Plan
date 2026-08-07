import type { FeedbackAnswers, FeedbackSubmission } from '../types/feedback'

const FEEDBACK_KEY = 'shotplan:feedback'

/**
 * Submits feedback to the server API and keeps a local copy on this device.
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
