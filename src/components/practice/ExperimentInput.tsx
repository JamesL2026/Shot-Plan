import { VoiceNoteButton } from '../capture/VoiceNoteButton'
import { Button } from '../ui/Button'
import { splitExperiments } from '../../data/practiceStarts'

export function ExperimentInput({
  title,
  prompt,
  value,
  parts,
  onChange,
  onKeepAll,
  onChooseOne,
  onContinue,
  onBack,
}: {
  title: string
  prompt: string
  value: string
  parts: string[]
  onChange: (value: string) => void
  onKeepAll: () => void
  onChooseOne: (value: string) => void
  onContinue: () => void
  onBack: () => void
}) {
  const split = splitExperiments(value)
  const showSplit = split.length >= 2 && parts.length === 0

  return (
    <section className="page rr-page">
      <p className="rr-kicker">{title}</p>
      <h1>{prompt}</h1>
      <p className="muted">
        Use something from a lesson, a tip you trust, or a feel you've noticed
        before. ShotPlan will help you see whether it actually helps.
      </p>
      <label className="rr-note-label" htmlFor="experiment-input">
        What you're trying
      </label>
      <textarea
        id="experiment-input"
        className="rr-note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ball slightly back"
      />
      <VoiceNoteButton
        value={value}
        onChange={onChange}
        label="Talk to ShotPlan"
      />

      {showSplit ? (
        <div className="sp-plan-block">
          <p className="sp-subhead">That's a few things at once.</p>
          <p className="muted">
            One thing at a time can make it easier to learn what actually helped.
          </p>
          <div className="rr-cats rr-cats--stack">
            {split.map((item) => (
              <button
                key={item}
                type="button"
                className="rr-cat"
                onClick={() => onChooseOne(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <Button variant="secondary" block onClick={onKeepAll}>
            Keep them together
          </Button>
        </div>
      ) : null}

      <div className="rr-actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          disabled={!value.trim()}
          onClick={onContinue}
        >
          Use this
        </Button>
        <button type="button" className="rr-text-link" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  )
}
