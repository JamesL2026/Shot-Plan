import type { AdaptedDrill, Drill } from '../types'
import { DrillCard } from './DrillCard'
import { Button } from './ui/Button'

interface GuidedChallengeProps {
  drill: Drill | AdaptedDrill
  challengeNumber: number
  onComplete: () => void
}

/** One challenge only. No peeking ahead. */
export function GuidedChallenge({
  drill,
  challengeNumber,
  onComplete,
}: GuidedChallengeProps) {
  return (
    <section className="guided-challenge animate-in">
      <p className="guided-challenge__count">Challenge {challengeNumber}</p>
      <p className="guided-challenge__coach">
        Match the diagram setup, then follow the numbered challenge steps.
      </p>
      <aside className="guided-challenge__cue" aria-label="Remember">
        <p className="guided-challenge__cue-label">Remember this</p>
        <p className="guided-challenge__cue-text">{drill.cue}</p>
      </aside>
      <DrillCard drill={drill} index={challengeNumber} mode="guided" />
      <div className="drill-focus__actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={onComplete}
        >
          Challenge Complete
        </Button>
      </div>
    </section>
  )
}
