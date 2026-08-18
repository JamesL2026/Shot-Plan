import { useState } from 'react'
import { TalkToShotPlan } from '../capture/TalkToShotPlan'
import { Button } from '../ui/Button'
import { HelpButtons } from '../ui/HelpButtons'
import type { DebriefFields } from '../../types/debrief'
import type { ExperimentHelp } from '../../types/memory'

const EXPERIMENT_FEEL: { value: ExperimentHelp; label: string }[] = [
  { value: 'yes', label: 'Helped' },
  { value: 'somewhat', label: 'Maybe helped' },
  { value: 'no', label: "Didn't help" },
  { value: 'not-sure', label: 'Not sure' },
]

const SESSION_FEEL: { value: ExperimentHelp; label: string }[] = [
  { value: 'yes', label: 'Useful' },
  { value: 'somewhat', label: 'Somewhat useful' },
  { value: 'no', label: 'Not useful' },
  { value: 'not-sure', label: 'Not sure' },
]

interface PracticeDebriefProps {
  focusTitle: string
  experiment?: string
  baselineLine?: string
  testLine?: string
  transferLine?: string
  headline: string
  ideaTitle?: string
  fields: DebriefFields
  transcript: string
  club: string
  experimentHelped?: ExperimentHelp
  onFields: (value: DebriefFields) => void
  onTranscript: (value: string) => void
  onClub: (value: string) => void
  onHelped: (value: ExperimentHelp) => void
  onSave: () => void
}

export function PracticeDebrief({
  focusTitle,
  experiment,
  baselineLine,
  testLine,
  transferLine,
  headline,
  ideaTitle,
  fields,
  transcript,
  club,
  experimentHelped,
  onFields,
  onTranscript,
  onClub,
  onHelped,
  onSave,
}: PracticeDebriefProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showNote, setShowNote] = useState(Boolean(fields.remember.trim()))

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Practice</p>
      <h1>Session complete</h1>
      <p>Focus: {focusTitle}</p>
      {experiment ? <p>You tested: {experiment}</p> : null}
      {ideaTitle && !experiment ? <p>Basic practice idea: {ideaTitle}</p> : null}
      {baselineLine ? <p>Baseline: {baselineLine}</p> : null}
      {testLine ? <p>Test: {testLine}</p> : null}
      {transferLine ? <p>Transfer: {transferLine}</p> : null}
      <p className="sp-subhead">{headline}</p>

      <h2 className="sp-subhead">What did you learn?</h2>
      <p className="muted">Anything worth remembering for next time?</p>
      <TalkToShotPlan
        transcript={transcript}
        fields={fields}
        onTranscript={onTranscript}
        onFields={onFields}
        hideFields
      />
      {showNote ? (
        <>
          <label className="rr-note-label" htmlFor="practice-note">
            Type a note
          </label>
          <textarea
            id="practice-note"
            className="rr-note"
            value={fields.remember}
            onChange={(event) =>
              onFields({ ...fields, remember: event.target.value })
            }
            placeholder="Optional"
          />
        </>
      ) : (
        <Button variant="secondary" block onClick={() => setShowNote(true)}>
          Type a note
        </Button>
      )}

      <HelpButtons
        prompt="How did it feel?"
        value={experimentHelped}
        onChange={onHelped}
        options={experiment ? EXPERIMENT_FEEL : SESSION_FEEL}
      />

      <div className="rr-actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={onSave}
        >
          Save practice
        </Button>
      </div>

      {showDetails ? (
        <div className="sp-talk-prompts">
          <p className="rr-kicker">Edit details</p>
          <p>Focus: {focusTitle}</p>
          <label className="rr-note-label" htmlFor="practice-tried">
            What you tried
          </label>
          <textarea
            id="practice-tried"
            className="rr-note"
            value={fields.tried}
            onChange={(event) =>
              onFields({ ...fields, tried: event.target.value })
            }
          />
          <label className="rr-note-label" htmlFor="practice-worked">
            Reported result
          </label>
          <input
            id="practice-worked"
            className="sp-input"
            value={fields.worked}
            onChange={(event) =>
              onFields({ ...fields, worked: event.target.value })
            }
          />
          <label className="rr-note-label" htmlFor="practice-not">
            What did not work
          </label>
          <input
            id="practice-not"
            className="sp-input"
            value={fields.didNotWork}
            onChange={(event) =>
              onFields({ ...fields, didNotWork: event.target.value })
            }
          />
          <label className="rr-note-label" htmlFor="practice-watch">
            Watch next
          </label>
          <input
            id="practice-watch"
            className="sp-input"
            value={fields.workingOn}
            onChange={(event) =>
              onFields({ ...fields, workingOn: event.target.value })
            }
          />
          <label className="rr-note-label" htmlFor="practice-club">
            Club
          </label>
          <input
            id="practice-club"
            className="sp-input"
            value={club}
            onChange={(event) => onClub(event.target.value)}
            placeholder="Optional"
          />
        </div>
      ) : null}

      <button
        type="button"
        className="rr-text-link"
        onClick={() => setShowDetails((value) => !value)}
      >
        {showDetails ? 'Hide details' : 'Edit details'}
      </button>
    </section>
  )
}
