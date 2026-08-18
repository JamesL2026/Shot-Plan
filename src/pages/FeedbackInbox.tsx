import { useMemo, useState, type FormEvent } from 'react'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  deleteFeedbackSubmission,
  feedbackDayKey,
  feedbackDayLabel,
  feedbackKindLabel,
  fetchFeedbackInbox,
  mostUsefulLabel,
  mostWorkLabel,
  practiceChangeLabel,
  profileAccuracyLabel,
  remindedLabel,
  useAgainLabel,
  usefulnessLabel,
} from '../lib/feedback'
import type { FeedbackSubmission } from '../types/feedback'

const SECRET_KEY = 'shotplan:feedback-admin-secret'

export function FeedbackInbox() {
  const [secret, setSecret] = useState(
    () => sessionStorage.getItem(SECRET_KEY) ?? '',
  )
  const [items, setItems] = useState<FeedbackSubmission[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(
    () => Boolean(sessionStorage.getItem(SECRET_KEY)),
  )

  const dayKeys = useMemo(() => {
    const keys = new Set<string>()
    for (const item of items) {
      keys.add(feedbackDayKey(item.createdAt))
    }
    return [...keys].sort((a, b) => (a < b ? 1 : -1))
  }, [items])

  const selectedDay = activeDay && dayKeys.includes(activeDay) ? activeDay : dayKeys[0] ?? null

  const dayItems = useMemo(() => {
    if (!selectedDay) return []
    return items.filter((item) => feedbackDayKey(item.createdAt) === selectedDay)
  }, [items, selectedDay])

  async function load(nextSecret: string) {
    setLoading(true)
    setError(null)
    try {
      const submissions = await fetchFeedbackInbox(nextSecret)
      sessionStorage.setItem(SECRET_KEY, nextSecret)
      setItems(submissions)
      setUnlocked(true)
      if (submissions.length > 0) {
        setActiveDay(feedbackDayKey(submissions[0].createdAt))
      } else {
        setActiveDay(null)
      }
    } catch (err) {
      setUnlocked(false)
      setItems([])
      setActiveDay(null)
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load feedback. Check your secret and Blob setup.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleUnlock(event: FormEvent) {
    event.preventDefault()
    const trimmed = secret.trim()
    if (!trimmed) {
      setError('Enter your feedback admin secret.')
      return
    }
    void load(trimmed)
  }

  async function handleDelete(item: FeedbackSubmission) {
    const trimmed = secret.trim()
    if (!trimmed) {
      setError('Enter your feedback admin secret.')
      return
    }
    const confirmed = window.confirm('Delete this feedback? This cannot be undone.')
    if (!confirmed) return

    setDeletingId(item.id)
    setError(null)
    try {
      await deleteFeedbackSubmission(trimmed, item.id)
      setItems((prev) => {
        const next = prev.filter((entry) => entry.id !== item.id)
        const remainingDays = [
          ...new Set(next.map((entry) => feedbackDayKey(entry.createdAt))),
        ].sort((a, b) => (a < b ? 1 : -1))
        const dayOfDeleted = feedbackDayKey(item.createdAt)
        if (!remainingDays.includes(dayOfDeleted)) {
          setActiveDay(remainingDays[0] ?? null)
        }
        return next
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete this feedback.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="page feedback-inbox animate-in">
      <BackLink to="/">Home</BackLink>

      <div className="page-intro">
        <p className="page-intro__kicker">Owner only</p>
        <h1>Feedback inbox</h1>
        <p className="muted">
          Help Improve and Quick Baseline answers from the live app.
        </p>
      </div>

      <Card padding="lg" className="feedback-inbox__unlock">
        <form onSubmit={handleUnlock} className="feedback-inbox__form">
          <label className="feedback-inbox__label" htmlFor="feedback-secret">
            Admin secret
          </label>
          <input
            id="feedback-secret"
            type="password"
            className="feedback-inbox__input"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="current-password"
            placeholder="FEEDBACK_ADMIN_SECRET"
          />
          <Button type="submit" variant="primary" block disabled={loading}>
            {loading ? 'Loading…' : unlocked ? 'Refresh inbox' : 'Open inbox'}
          </Button>
        </form>
        {error && <p className="feedback-inbox__error">{error}</p>}
      </Card>

      {unlocked && (
        <div className="feedback-inbox__list">
          <p className="muted">
            {items.length === 0
              ? 'No submissions yet.'
              : `${items.length} submission${items.length === 1 ? '' : 's'}`}
          </p>

          {dayKeys.length > 0 && (
            <div
              className="feedback-inbox__days"
              role="tablist"
              aria-label="Feedback by day"
            >
              {dayKeys.map((day) => {
                const count = items.filter(
                  (item) => feedbackDayKey(item.createdAt) === day,
                ).length
                const selected = day === selectedDay
                return (
                  <button
                    key={day}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={
                      selected
                        ? 'feedback-inbox__day feedback-inbox__day--active'
                        : 'feedback-inbox__day'
                    }
                    onClick={() => setActiveDay(day)}
                  >
                    <span className="feedback-inbox__day-date">
                      {feedbackDayLabel(day)}
                    </span>
                    <span className="feedback-inbox__day-count">{count}</span>
                  </button>
                )
              })}
            </div>
          )}

          {selectedDay && (
            <p className="feedback-inbox__day-heading muted">
              {feedbackDayLabel(selectedDay)} · {dayItems.length}{' '}
              {dayItems.length === 1 ? 'response' : 'responses'}
            </p>
          )}

          {dayItems.map((item) => (
            <Card key={item.id} padding="lg" className="feedback-inbox__card">
              <div className="feedback-inbox__card-top">
                <p className="feedback-inbox__meta">
                  {new Date(item.createdAt).toLocaleString()} ·{' '}
                  {feedbackKindLabel(item.answers.kind)}
                </p>
                <button
                  type="button"
                  className="feedback-inbox__delete"
                  disabled={deletingId === item.id}
                  onClick={() => void handleDelete(item)}
                >
                  {deletingId === item.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
              <dl className="feedback-inbox__answers">
                <div>
                  <dt>Route</dt>
                  <dd>{item.openedFrom}</dd>
                </div>
                {item.usage ? (
                  <>
                    <div>
                      <dt>Completed practice</dt>
                      <dd>{item.usage.completedPractice ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt>Completed round</dt>
                      <dd>{item.usage.completedRound ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt>Saved rounds</dt>
                      <dd>{item.usage.roundCount}</dd>
                    </div>
                    <div>
                      <dt>Saved practices</dt>
                      <dd>{item.usage.practiceCount}</dd>
                    </div>
                    <div>
                      <dt>Voice used</dt>
                      <dd>{item.usage.voiceUsed ? 'Yes' : 'No'}</dd>
                    </div>
                  </>
                ) : null}
                {item.answers.profileAccuracy && (
                  <div>
                    <dt>Feel right?</dt>
                    <dd>{profileAccuracyLabel(item.answers.profileAccuracy)}</dd>
                  </div>
                )}
                {item.answers.wouldChangePractice && (
                  <div>
                    <dt>Change practice?</dt>
                    <dd>{practiceChangeLabel(item.answers.wouldChangePractice)}</dd>
                  </div>
                )}
                {typeof item.answers.overallScore === 'number' && (
                  <div>
                    <dt>Score</dt>
                    <dd>{item.answers.overallScore}</dd>
                  </div>
                )}
                {item.answers.strongest && (
                  <div>
                    <dt>Strongest</dt>
                    <dd>{item.answers.strongest}</dd>
                  </div>
                )}
                {item.answers.opportunity && (
                  <div>
                    <dt>Opportunity</dt>
                    <dd>{item.answers.opportunity}</dd>
                  </div>
                )}
                {item.answers.golferType && (
                  <div>
                    <dt>Golfer</dt>
                    <dd>{item.answers.golferType}</dd>
                  </div>
                )}
                {item.answers.planUsefulness && (
                  <div>
                    <dt>Helped decide</dt>
                    <dd>{usefulnessLabel(item.answers.planUsefulness)}</dd>
                  </div>
                )}
                {item.answers.recommend && (
                  <div>
                    <dt>Recommend</dt>
                    <dd>{item.answers.recommend}</dd>
                  </div>
                )}
                {item.answers.useAgain && (
                  <div>
                    <dt>Use again</dt>
                    <dd>{useAgainLabel(item.answers.useAgain)}</dd>
                  </div>
                )}
                {item.answers.remindedOfForgotten && (
                  <div>
                    <dt>Reminded you</dt>
                    <dd>{remindedLabel(item.answers.remindedOfForgotten)}</dd>
                  </div>
                )}
                {item.answers.mostUseful && (
                  <div>
                    <dt>Most useful</dt>
                    <dd>{mostUsefulLabel(item.answers.mostUseful)}</dd>
                  </div>
                )}
                {item.answers.mostWork && (
                  <div>
                    <dt>Most work</dt>
                    <dd>{mostWorkLabel(item.answers.mostWork)}</dd>
                  </div>
                )}
                {item.answers.frustration && (
                  <div>
                    <dt>Frustration</dt>
                    <dd>{item.answers.frustration}</dd>
                  </div>
                )}
                {item.answers.struggles && item.answers.struggles.length > 0 && (
                  <div>
                    <dt>Struggles</dt>
                    <dd>{item.answers.struggles.join(', ')}</dd>
                  </div>
                )}
                {item.answers.improvementIdea && (
                  <div>
                    <dt>Wish it did differently</dt>
                    <dd>{item.answers.improvementIdea}</dd>
                  </div>
                )}
                {item.answers.oneChange && (
                  <div>
                    <dt>Change one thing</dt>
                    <dd>{item.answers.oneChange}</dd>
                  </div>
                )}
              </dl>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
