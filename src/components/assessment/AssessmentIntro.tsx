import { Button } from '../ui/Button'

interface AssessmentIntroProps {
  latestScore?: number
  onStart: () => void
  onViewLatest?: () => void
}

const STEPS = [
  {
    title: 'Five short tests',
    body: 'Driver, iron, wedge, lag putts, then short putts. Three shots each.',
  },
  {
    title: 'Hit first. Log after.',
    body: 'Pocket your phone, hit the 3 shots, then tap how they went.',
  },
  {
    title: 'See what to practice',
    body: "You'll get a snapshot of what's strong today and what needs work. Not a handicap.",
  },
]

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
      <p className="assess-lead">
        A 15 shot snapshot at the range. Your phone is just the scorekeeper.
      </p>

      <ol className="assess-howto">
        {STEPS.map((step, index) => (
          <li key={step.title} className="assess-howto__item">
            <span className="assess-howto__num" aria-hidden="true">
              {index + 1}
            </span>
            <span>
              <span className="assess-howto__title">{step.title}</span>
              <span className="assess-howto__body muted">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="muted assess-hint">
        Bring a driver, a mid iron, a wedge, and a putter. About 10 minutes.
      </p>

      {hasBaseline ? (
        <p className="assess-latest">
          Latest: <strong>{latestScore}</strong>
        </p>
      ) : null}
      <div className="assess-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onStart}>
          {hasBaseline ? 'Retake' : "I'm at the range. Start"}
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
