import { Button } from './ui/Button'

interface CoachBriefProps {
  focusLine: string
  estimatedTime: string
  swingThought: string
  encouragement: string
  onStart: () => void
  onBack: () => void
  backLabel: string
}

export function CoachBrief({
  focusLine,
  estimatedTime,
  swingThought,
  encouragement,
  onStart,
  onBack,
  backLabel,
}: CoachBriefProps) {
  return (
    <section className="coach-brief animate-in">
      <button type="button" className="back-link" onClick={onBack}>
        ← {backLabel}
      </button>

      <p className="coach-brief__kicker">Your coach</p>
      <h1 className="coach-brief__title">Let&apos;s work on this</h1>

      <div className="coach-brief__block">
        <p className="coach-brief__label">Today&apos;s Focus</p>
        <p className="coach-brief__focus">{focusLine}</p>
      </div>

      <div className="coach-brief__block coach-brief__block--quiet">
        <p className="coach-brief__label">Estimated Time</p>
        <p className="coach-brief__time">{estimatedTime}</p>
      </div>

      <aside className="swing-thought" aria-label="Today's swing thought">
        <p className="swing-thought__label">Today&apos;s Swing Thought</p>
        <p className="swing-thought__cue">{swingThought}</p>
      </aside>

      <p className="coach-brief__encourage">{encouragement}</p>

      <div className="ready-cta">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={onStart}
        >
          Start Practice
        </Button>
      </div>
    </section>
  )
}
