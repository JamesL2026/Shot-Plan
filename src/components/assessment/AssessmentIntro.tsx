import { Button } from '../ui/Button'

interface AssessmentIntroProps {
  latestScore?: number
  onStart: () => void
  onViewLatest?: () => void
}

export function AssessmentIntro({
  latestScore,
  onStart,
  onViewLatest,
}: AssessmentIntroProps) {
  const hasBaseline = typeof latestScore === 'number'

  return (
    <section className="assess-intro animate-in">
      <p className="assess-kicker">Quick Baseline</p>
      <h1>Test Your Game</h1>
      <p className="assess-lead">15 shots. Find what to practice.</p>
      {hasBaseline ? (
        <p className="assess-latest">
          Latest: <strong>{latestScore}</strong>
        </p>
      ) : null}
      <div className="assess-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onStart}>
          {hasBaseline ? 'Retake' : 'Start'}
        </Button>
        {hasBaseline && onViewLatest ? (
          <Button variant="secondary" block onClick={onViewLatest}>
            View profile
          </Button>
        ) : null}
      </div>
    </section>
  )
}
