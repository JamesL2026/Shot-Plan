import { Check } from 'lucide-react'
import type { ChecklistItem } from '../data/drills'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface PracticeChecklistProps {
  items: ChecklistItem[]
  checked: Record<string, boolean>
  onToggle: (id: string) => void
  onFinish: () => void
  onBack: () => void
  swingThought: string
}

export function PracticeChecklist({
  items,
  checked,
  onToggle,
  onFinish,
  onBack,
  swingThought,
}: PracticeChecklistProps) {
  const allDone = items.every((item) => checked[item.id])

  return (
    <section className="practice-mode animate-in">
      <button type="button" className="back-link" onClick={onBack}>
        ← Back to plan
      </button>

      <header className="page-intro">
        <h1>Today’s Practice</h1>
        <p className="muted">Check each box as you go. Keep it simple.</p>
      </header>

      <aside className="swing-thought swing-thought--compact" aria-label="Swing thought">
        <p className="swing-thought__label">Swing thought</p>
        <p className="swing-thought__cue">{swingThought}</p>
      </aside>

      <ul className="checklist">
        {items.map((item) => {
          const isOn = Boolean(checked[item.id])
          return (
            <li key={item.id}>
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
            </li>
          )
        })}
      </ul>

      <Button
        variant="primary"
        block
        disabled={!allDone}
        onClick={onFinish}
      >
        Finish practice
      </Button>
    </section>
  )
}

interface PracticeCompleteProps {
  onHome: () => void
  onFollowUp?: () => void
  showFollowUp: boolean
}

export function PracticeComplete({
  onHome,
  onFollowUp,
  showFollowUp,
}: PracticeCompleteProps) {
  return (
    <Card className="practice-complete animate-in" padding="lg">
      <p className="practice-complete__title">Nice work.</p>
      <p className="practice-complete__text">
        You completed today’s practice session.
      </p>
      <p className="muted practice-complete__sub">
        See you after your next round.
      </p>
      <div className="practice-complete__actions">
        {showFollowUp && onFollowUp && (
          <Button variant="primary" block onClick={onFollowUp}>
            Quick follow-up
          </Button>
        )}
        <Button variant={showFollowUp ? 'secondary' : 'primary'} block onClick={onHome}>
          Return Home
        </Button>
      </div>
    </Card>
  )
}
