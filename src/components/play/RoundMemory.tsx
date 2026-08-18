import { useState } from 'react'
import { TalkToShotPlan } from '../capture/TalkToShotPlan'
import { Button } from '../ui/Button'
import { STOOD_OUT, TRANSFER_FEEL, areaLabel } from '../../data/moments'
import { focusFromMoment } from '../../lib/patterns'
import type { DebriefFields } from '../../types/debrief'
import type {
  Focus,
  FocusArea,
  Round,
  StoodOut,
  TransferFeel,
} from '../../types/memory'
import { MomentList } from './MomentList'

interface RoundMemoryProps {
  round: Round
  activeFocus?: Focus
  selectedMomentId?: string
  transfer?: TransferFeel
  fields: DebriefFields
  transcript: string
  onSelectMoment: (id: string, area: FocusArea, title: string) => void
  onRemove: (id: string) => void
  onTransfer: (value: TransferFeel) => void
  onFields: (value: DebriefFields) => void
  onTranscript: (value: string) => void
  onStoodOut: (value: StoodOut) => void
  onSkipWatch: () => void
  onDone: () => void
}

export function RoundMemory({
  round,
  activeFocus,
  selectedMomentId,
  transfer,
  fields,
  transcript,
  onSelectMoment,
  onRemove,
  onTransfer,
  onFields,
  onTranscript,
  onStoodOut,
  onSkipWatch,
  onDone,
}: RoundMemoryProps) {
  const [typeOpen, setTypeOpen] = useState(false)
  const selected = round.moments.find((item) => item.id === selectedMomentId)
  const carry = selected ? focusFromMoment(selected) : null

  function applyTalk(next: DebriefFields) {
    onFields(next)
  }

  return (
    <section className="rr-replay animate-in">
      <p className="rr-kicker">Your round memory</p>
      <h1>
        {round.moments.length === 0
          ? 'Nothing saved'
          : round.moments.length === 1
            ? '1 thing you saved'
            : `${round.moments.length} things you saved`}
      </h1>
      <p className="muted">
        These are the moments. Tap one to watch next round. Remove a tap if it
        was a mistake.
      </p>

      {round.moments.length > 0 ? (
        <MomentList
          moments={round.moments}
          selectable
          selectedId={selectedMomentId}
          onSelect={(moment) => {
            const next = focusFromMoment(moment)
            onSelectMoment(moment.id, next.area, next.title)
          }}
          onRemove={onRemove}
        />
      ) : (
        <p className="muted">That’s okay. You can still save the round.</p>
      )}

      {carry ? (
        <div className="sp-watch">
          <p className="sp-watch__label">Next round</p>
          <p className="sp-watch__title">{carry.title}</p>
          <p className="muted">Just pay attention to it. No need to fix it mid round.</p>
        </div>
      ) : (
        <p className="muted">Nothing carried forward yet.</p>
      )}

      <button type="button" className="rr-text-link" onClick={onSkipWatch}>
        Don’t carry anything
      </button>

      <h2 className="sp-subhead">Talk through it</h2>
      <p className="muted">
        One take. Then check the card. Type if you would rather.
      </p>

      <TalkToShotPlan
        transcript={transcript}
        fields={fields}
        onTranscript={onTranscript}
        onFields={applyTalk}
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
          <p className="rr-prompt">What stood out?</p>
          <div className="rr-cats rr-cats--stack">
            {STOOD_OUT.map((item) => (
              <button
                key={item.value}
                type="button"
                className={
                  round.stoodOut === item.value ? 'rr-cat rr-cat--on' : 'rr-cat'
                }
                onClick={() => onStoodOut(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeFocus ? (
            <>
              <p className="rr-prompt">How did {areaLabel(activeFocus.area)} feel?</p>
              <div className="rr-cats rr-cats--stack">
                {TRANSFER_FEEL.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={
                      transfer === item.value ? 'rr-cat rr-cat--on' : 'rr-cat'
                    }
                    onClick={() => onTransfer(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <label className="rr-note-label" htmlFor="round-remember">
            What should you remember?
          </label>
          <textarea
            id="round-remember"
            className="rr-note"
            value={fields.remember}
            onChange={(event) =>
              onFields({ ...fields, remember: event.target.value })
            }
            placeholder="One thing to work on next."
          />
        </>
      ) : null}

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onDone}>
          Save round
        </Button>
      </div>
    </section>
  )
}
