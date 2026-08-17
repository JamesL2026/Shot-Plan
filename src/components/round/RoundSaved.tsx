import { Button } from '../ui/Button'

interface RoundSavedProps {
  onHistory: () => void
  onHome: () => void
}

export function RoundSaved({ onHistory, onHome }: RoundSavedProps) {
  return (
    <section className="rr-saved animate-in">
      <p className="rr-kicker">Round saved</p>
      <h1>Come back after your next round to see what keeps showing up.</h1>
      <p className="muted rr-hint">No drill plan. Just the review.</p>
      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onHistory}>
          Round History
        </Button>
        <Button variant="secondary" block onClick={onHome}>
          Home
        </Button>
      </div>
    </section>
  )
}
