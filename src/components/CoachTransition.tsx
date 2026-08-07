import { Button } from './ui/Button'

interface CoachTransitionProps {
  headline: string
  body: string
  cta: string
  onContinue: () => void
}

export function CoachTransition({
  headline,
  body,
  cta,
  onContinue,
}: CoachTransitionProps) {
  return (
    <section className="coach-transition animate-in" aria-live="polite">
      <p className="coach-transition__kicker">Your coach</p>
      <h1 className="coach-transition__headline">{headline}</h1>
      <p className="coach-transition__body">{body}</p>
      <Button variant="primary" block className="ready-cta__btn" onClick={onContinue}>
        {cta}
      </Button>
    </section>
  )
}
