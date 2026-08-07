import { useState } from 'react'
import { Check } from 'lucide-react'
import type { ChecklistItem } from '../data/drills'
import type { PlanUsefulness } from '../types/feedback'
import { useFeedback } from './FeedbackContext'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface PracticeChecklistProps {
  items: ChecklistItem[]
  checked: Record<string, boolean>
  onToggle: (id: string) => void
  onFinish: () => void
  onBack: () => void
  swingThought: string
  onOpenDrill?: (drillId: string) => void
}

export function PracticeChecklist({
  items,
  checked,
  onToggle,
  onFinish,
  onBack,
  swingThought,
  onOpenDrill,
}: PracticeChecklistProps) {
  return (
    <section className="practice-mode animate-in">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to plan
      </button>

      <header className="page-intro">
        <h1>Today’s Practice</h1>
        <p className="muted">Check drills off as you go. Finish whenever you’re ready.</p>
      </header>

      <aside className="swing-thought swing-thought--compact" aria-label="Swing thought">
        <p className="swing-thought__label">Swing thought</p>
        <p className="swing-thought__cue">{swingThought}</p>
      </aside>

      <ul className="checklist">
        {items.map((item) => {
          const isOn = Boolean(checked[item.id])
          const drillId = item.id.startsWith('drill-')
            ? item.id.slice('drill-'.length)
            : null

          return (
            <li key={item.id} className="checklist__row">
              <button
                type="button"
                className={isOn ? 'checklist-item checklist-item--done' : 'checklist-item'}
                onClick={() => onToggle(item.id)}
                aria-pressed={isOn}
              >
                <span
                  className={
                    isOn
                      ? 'checklist-item__box checklist-item__box--on'
                      : 'checklist-item__box'
                  }
                  aria-hidden="true"
                >
                  {isOn && <Check size={16} strokeWidth={2.75} />}
                </span>
                <span className="checklist-item__label">{item.label}</span>
              </button>
              {drillId && onOpenDrill && (
                <button
                  type="button"
                  className="checklist-item__setup"
                  onClick={() => onOpenDrill(drillId)}
                >
                  View setup
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <Button variant="primary" block onClick={onFinish}>
        Finish practice
      </Button>
    </section>
  )
}

interface PracticeCompleteProps {
  onHome: () => void
  onFollowUp?: () => void
  showFollowUp: boolean
  challengeCount?: number
  accomplishment?: string
}

type SessionPulse = 'helpful' | 'okay' | 'needs-improvement'

const pulseToUsefulness: Record<SessionPulse, PlanUsefulness> = {
  helpful: 4,
  okay: 3,
  'needs-improvement': 2,
}

export function PracticeComplete({
  onHome,
  onFollowUp,
  showFollowUp,
  challengeCount = 0,
  accomplishment,
}: PracticeCompleteProps) {
  const { openFeedback } = useFeedback()
  const [pulse, setPulse] = useState<SessionPulse | null>(null)

  function handlePulse(value: SessionPulse) {
    setPulse(value)
    try {
      const key = 'shotplan:session-pulse'
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
      <Card className="practice-complete" padding="lg">
        <p className="practice-complete__title">Nice work.</p>
        <p className="practice-complete__text">
          You completed today&apos;s practice.
        </p>
        {challengeCount > 0 && (
          <p className="practice-complete__highlight">
            You completed {challengeCount} coaching challenge
            {challengeCount === 1 ? '' : 's'}.
          </p>
        )}
        {accomplishment && (
          <p className="muted practice-complete__sub">{accomplishment}</p>
        )}
        <p className="muted practice-complete__sub">
          See you after your next round.
        </p>
        <div className="practice-complete__actions">
          {showFollowUp && onFollowUp && (
            <Button variant="primary" block onClick={onFollowUp}>
              Quick follow-up
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
        <p className="session-pulse__title">How did today&apos;s practice feel?</p>
        {pulse ? (
          <p className="session-pulse__thanks muted">
            Thanks. That helps us keep improving.
          </p>
        ) : (
          <div className="session-pulse__row" role="group" aria-label="Quick rating">
            <button
              type="button"
              className="session-pulse__btn"
              onClick={() => handlePulse('helpful')}
            >
              <span aria-hidden="true">👍</span>
              Helpful
            </button>
            <button
              type="button"
              className="session-pulse__btn"
              onClick={() => handlePulse('okay')}
            >
              <span aria-hidden="true">😐</span>
              It was okay
            </button>
            <button
              type="button"
              className="session-pulse__btn"
              onClick={() => handlePulse('needs-improvement')}
            >
              <span aria-hidden="true">👎</span>
              Needs improvement
            </button>
          </div>
        )}
        <button
          type="button"
          className="session-pulse__link"
          onClick={() =>
            openFeedback({
              seed: pulse
                ? { planUsefulness: pulseToUsefulness[pulse] }
                : undefined,
            })
          }
        >
          Help Improve ShotPlan →
        </button>
      </Card>
    </div>
  )
}
