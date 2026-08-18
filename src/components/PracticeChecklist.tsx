import { useState } from 'react'
import type { PlanUsefulness } from '../types/feedback'
import { useFeedback } from './FeedbackContext'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

type ContactFeel = 'much-better' | 'slightly-better' | 'no-change' | 'worse'

interface PracticeCompleteProps {
  onHome: () => void
  onFollowUp?: () => void
  showFollowUp: boolean
  challengeCount?: number
  drillsFinished?: number
  drillsTotal?: number
  todayGoal?: string
  swingThought?: string
  biggestWin?: string
}

const contactChoices: { value: ContactFeel; label: string }[] = [
  { value: 'much-better', label: 'Much Better' },
  { value: 'slightly-better', label: 'Slightly Better' },
  { value: 'no-change', label: 'No Change' },
  { value: 'worse', label: 'Worse' },
]

export function PracticeComplete({
  onHome,
  onFollowUp,
  showFollowUp,
  challengeCount = 0,
  drillsFinished,
  drillsTotal,
  todayGoal,
  swingThought,
  biggestWin,
}: PracticeCompleteProps) {
  const { openFeedback } = useFeedback()
  const [contactFeel, setContactFeel] = useState<ContactFeel | null>(null)
  const finished = drillsFinished ?? challengeCount
  const total = drillsTotal ?? challengeCount

  function handleContact(value: ContactFeel) {
    setContactFeel(value)
    try {
      const key = 'shotplan:contact-feel'
      const prev = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown
      const list = Array.isArray(prev) ? prev : []
      list.unshift({ at: new Date().toISOString(), value })
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)))
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="practice-complete-stack animate-in">
      <Card className="round-ready" padding="lg">
        <p className="round-ready__kicker">Round Ready</p>
        <h2 className="round-ready__title">Coach&apos;s Wrap Up</h2>

        <dl className="round-ready__meta">
          <div>
            <dt>Today&apos;s Focus</dt>
            <dd>{todayGoal ?? 'Your practice focus'}</dd>
          </div>
          <div>
            <dt>Challenges Completed</dt>
            <dd>
              {finished} of {total || finished || 0}
            </dd>
          </div>
          {biggestWin && (
            <div>
              <dt>Today&apos;s Biggest Win</dt>
              <dd>{biggestWin}</dd>
            </div>
          )}
        </dl>

        {swingThought && (
          <aside className="round-ready__thought" aria-label="Swing thought">
            <p className="round-ready__thought-label">Today&apos;s Swing Thought</p>
            <p className="round-ready__thought-cue">{swingThought}</p>
          </aside>
        )}

        <div className="round-ready__reflect">
          <p className="round-ready__reflect-title">Reflection</p>
          <p className="muted round-ready__reflect-q">
            How did today&apos;s contact feel?
          </p>
          <div className="round-ready__choices" role="group" aria-label="Contact feel">
            {contactChoices.map((choice) => {
              const selected = contactFeel === choice.value
              return (
                <button
                  key={choice.value}
                  type="button"
                  className={
                    selected
                      ? 'round-ready__choice round-ready__choice--selected'
                      : 'round-ready__choice'
                  }
                  aria-pressed={selected}
                  onClick={() => handleContact(choice.value)}
                >
                  {choice.label}
                </button>
              )
            })}
          </div>
        </div>

        <p className="round-ready__close">
          Take this feeling into your next round.
        </p>
        <p className="muted round-ready__sub">
          Don&apos;t think about mechanics on the course.
        </p>
        <p className="muted round-ready__sub">Trust what you built today.</p>
        <p className="muted round-ready__sub">See you after your next round.</p>

        <div className="practice-complete__actions">
          {showFollowUp && onFollowUp && (
            <Button variant="primary" block onClick={onFollowUp}>
              Quick follow up
            </Button>
          )}
          <Button
            variant={showFollowUp ? 'secondary' : 'primary'}
            block
            onClick={onHome}
          >
            Return Home
          </Button>
        </div>
      </Card>

      <Card className="session-pulse" padding="lg">
        <p className="session-pulse__title">Help Improve</p>
        <p className="session-pulse__body muted">
          Two quick questions. More is optional.
        </p>
        <button
          type="button"
          className="session-pulse__link"
          onClick={() =>
            openFeedback({
              seed:
                contactFeel === 'much-better'
                  ? { planUsefulness: 5 as PlanUsefulness }
                  : contactFeel === 'slightly-better' ||
                      contactFeel === 'no-change'
                    ? { planUsefulness: 3 as PlanUsefulness }
                    : contactFeel === 'worse'
                      ? { planUsefulness: 1 as PlanUsefulness }
                      : undefined,
            })
          }
        >
          Tap here
        </button>
      </Card>
    </div>
  )
}
