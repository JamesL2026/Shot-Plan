import { Button } from '../ui/Button'

interface RoundStartProps {
  hasDraft: boolean
  hasHistory: boolean
  onStart: () => void
  onContinue: () => void
  onHistory: () => void
}

export function RoundStart({
  hasDraft,
  hasHistory,
  onStart,
  onContinue,
  onHistory,
}: RoundStartProps) {
  return (
    <section className="rr-start animate-in">
      <p className="rr-kicker">ShotPlan</p>
      <h1>Round Review</h1>
      <p className="rr-lead">
        Track the mistakes that mattered, without tracking every shot.
      </p>
      <p className="muted rr-hint">No GPS. No course setup. Phone stays in your pocket.</p>

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onStart}>
          Start 18 Holes
        </Button>
        {hasDraft ? (
          <Button variant="secondary" block onClick={onContinue}>
            Continue Round
          </Button>
        ) : null}
        {hasHistory ? (
          <button type="button" className="rr-text-link" onClick={onHistory}>
            Round History
          </button>
        ) : null}
      </div>
    </section>
  )
}
