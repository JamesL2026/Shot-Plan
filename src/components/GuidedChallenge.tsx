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
      <p className="guided-challenge__coach">{drill.coachIntro}</p>
      <aside className="guided-challenge__cue" aria-label="Coach says">
        <p className="guided-challenge__cue-label">Coach Says</p>
        <p className="guided-challenge__cue-text">{drill.coachSays}</p>
      </aside>
      <DrillCard drill={drill} index={challengeNumber} mode="guided" />
      <div className="drill-focus__actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={onComplete}
        >
          I&apos;m ready
        </Button>
      </div>
    </section>
  )
}
