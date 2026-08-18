import { useState } from 'react'
import { TalkToShotPlan } from '../capture/TalkToShotPlan'
import { Button } from '../ui/Button'
import type { DebriefFields } from '../../types/debrief'

interface PracticeDebriefProps {
  focusTitle: string
  fields: DebriefFields
  transcript: string
  club: string
  feltDifferent: string
  onFields: (value: DebriefFields) => void
  onTranscript: (value: string) => void
  onClub: (value: string) => void
  onFelt: (value: string) => void
  onSave: () => void
}

export function PracticeDebrief({
  focusTitle,
  fields,
  transcript,
  club,
  feltDifferent,
  onFields,
  onTranscript,
  onClub,
  onFelt,
  onSave,
}: PracticeDebriefProps) {
  const [typeOpen, setTypeOpen] = useState(false)

  return (
    <section className="page rr-page">
      <p className="rr-kicker">{focusTitle}</p>
      <h1>Talk through it</h1>
      <p className="muted">
        One take. Then check the card. Type if you would rather.
      </p>

      <TalkToShotPlan
        transcript={transcript}
        fields={fields}
        onTranscript={onTranscript}
        onFields={onFields}
      />

      <button
        type="button"
        className="rr-text-link"
        onClick={() => setTypeOpen((value) => !value)}
      >
        {typeOpen ? 'Hide typed fields' : 'Type instead'}
      </button>

      {typeOpen ? (
        <>
          <label className="rr-note-label" htmlFor="practice-notice">
            What did you notice?
          </label>
          <textarea
            id="practice-notice"
            className="rr-note"
            value={fields.remember}
            onChange={(event) =>
              onFields({ ...fields, remember: event.target.value })
            }
            placeholder="What changed. What to watch next."
          />

          <label className="rr-note-label" htmlFor="practice-tried">
            What did you try?
          </label>
          <textarea
            id="practice-tried"
            className="rr-note"
            value={fields.tried}
            onChange={(event) =>
              onFields({ ...fields, tried: event.target.value })
            }
            placeholder="Ball back. Softer takeaway. Whatever you changed."
          />

          <label className="rr-note-label" htmlFor="practice-club">
            Club
          </label>
          <input
            id="practice-club"
            className="sp-input"
            value={club}
            onChange={(event) => onClub(event.target.value)}
            placeholder="7 iron"
          />

          <label className="rr-note-label" htmlFor="practice-watch">
            Watch next round
          </label>
          <input
            id="practice-watch"
            className="sp-input"
            value={fields.workingOn}
            onChange={(event) =>
              onFields({ ...fields, workingOn: event.target.value })
            }
            placeholder="Optional"
          />

          <p className="rr-prompt">Did it feel different?</p>
          <div className="rr-cats">
            <button
              type="button"
              className={feltDifferent === 'yes' ? 'rr-cat rr-cat--on' : 'rr-cat'}
              onClick={() => onFelt('yes')}
            >
              Felt different
            </button>
            <button
              type="button"
              className={feltDifferent === 'no' ? 'rr-cat rr-cat--on' : 'rr-cat'}
              onClick={() => onFelt('no')}
            >
              About the same
            </button>
          </div>
        </>
      ) : null}

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
    </section>
  )
}
