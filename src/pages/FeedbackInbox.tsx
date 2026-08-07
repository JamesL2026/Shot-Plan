import { useState, type FormEvent } from 'react'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { fetchFeedbackInbox } from '../lib/feedback'
import type { FeedbackSubmission } from '../types/feedback'

const SECRET_KEY = 'shotplan:feedback-admin-secret'

export function FeedbackInbox() {
  const [secret, setSecret] = useState(
    () => sessionStorage.getItem(SECRET_KEY) ?? '',
  )
  const [items, setItems] = useState<FeedbackSubmission[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(
    () => Boolean(sessionStorage.getItem(SECRET_KEY)),
  )

  async function load(nextSecret: string) {
    setLoading(true)
    setError(null)
    try {
      const submissions = await fetchFeedbackInbox(nextSecret)
      sessionStorage.setItem(SECRET_KEY, nextSecret)
      setItems(submissions)
      setUnlocked(true)
    } catch (err) {
      setUnlocked(false)
      setItems([])
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

  return (
    <section className="page feedback-inbox animate-in">
      <BackLink to="/">Home</BackLink>

      <div className="page-intro">
        <p className="page-intro__kicker">Owner only</p>
        <h1>Feedback inbox</h1>
        <p className="muted">
          Submissions from Help Improve across the live site. Not linked from the
          public home screen.
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
          {items.map((item) => (
            <Card key={item.id} padding="lg" className="feedback-inbox__card">
              <p className="feedback-inbox__meta">
                {new Date(item.createdAt).toLocaleString()} · from{' '}
                {item.openedFrom}
              </p>
              <dl className="feedback-inbox__answers">
                {item.answers.golferType && (
                  <div>
                    <dt>Golfer</dt>
                    <dd>{item.answers.golferType}</dd>
                  </div>
                )}
                {item.answers.planUsefulness && (
                  <div>
                    <dt>Plan usefulness</dt>
                    <dd>{item.answers.planUsefulness} / 5</dd>
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
                    <dd>{item.answers.useAgain}</dd>
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
                    <dt>Idea</dt>
                    <dd>{item.answers.improvementIdea}</dd>
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
