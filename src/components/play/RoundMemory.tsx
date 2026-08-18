import { useState } from 'react'
import { TalkToShotPlan } from '../capture/TalkToShotPlan'
import { Button } from '../ui/Button'
import { HelpButtons } from '../ui/HelpButtons'
import { STOOD_OUT } from '../../data/moments'
import { focusFromMoment } from '../../lib/patterns'
import type { DebriefFields } from '../../types/debrief'
import type {
  ExperimentHelp,
  Focus,
  FocusArea,
  Round,
  StoodOut,
} from '../../types/memory'
import { MomentList } from './MomentList'

interface RoundMemoryProps {
  round: Round
  activeFocus?: Focus
  selectedMomentId?: string
  helped?: ExperimentHelp
  fields: DebriefFields
  transcript: string
  onSelectMoment: (id: string, area: FocusArea, title: string) => void
  onRemove: (id: string) => void
  onHelped: (value: ExperimentHelp) => void
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
  helped,
  fields,
  transcript,
  onSelectMoment,
  onRemove,
  onHelped,
  onFields,
  onTranscript,
  onStoodOut,
  onSkipWatch,
  onDone,
}: RoundMemoryProps) {
  const [showDetails, setShowDetails] = useState(false)
  const selected = round.moments.find((item) => item.id === selectedMomentId)
  const carry = selected ? focusFromMoment(selected) : null
  const holes = round.holesPlayed === 9 ? '9 holes' : round.holesPlayed === 18 ? '18 holes' : 'Round'

  return (
    <section className="rr-replay animate-in">
      <p className="rr-kicker">Your round memory</p>
      <h1>
        {round.moments.length === 0
          ? 'Zero moments. That is fine.'
          : round.moments.length === 1
            ? '1 thing you saved'
            : `${round.moments.length} things you saved`}
      </h1>
      <p className="muted">
        {holes}. A round is a transfer test, not a scorecard. You do not need to
        log shots.
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
        <p className="muted">Save the round anyway. Talk if you want.</p>
      )}

      {activeFocus ? (
        <div className="sp-watch">
          <p className="sp-watch__label">Today's focus</p>
          <p className="sp-watch__title">{activeFocus.title}</p>
          {activeFocus.reason ? (
            <p className="muted">{activeFocus.reason}</p>
          ) : null}
        </div>
      ) : carry ? (
        <div className="sp-watch">
          <p className="sp-watch__label">Carry forward</p>
          <p className="sp-watch__title">{carry.title}</p>
        </div>
      ) : null}

      <h2 className="sp-subhead">Talk to ShotPlan</h2>
      <TalkToShotPlan
        transcript={transcript}
        fields={fields}
        onTranscript={onTranscript}
        onFields={onFields}
      />

      {activeFocus ? (
        <HelpButtons
          prompt="Did today's focus hold up?"
          value={helped}
          onChange={onHelped}
        />
      ) : null}

      <label className="rr-note-label" htmlFor="round-remember">
        What should we remember? (optional)
      </label>
      <textarea
        id="round-remember"
        className="rr-note"
        value={fields.remember}
        onChange={(event) =>
          onFields({ ...fields, remember: event.target.value })
        }
        placeholder="Optional"
      />

      {showDetails ? (
        <div className="sp-talk-prompts">
          <p className="rr-kicker">Add details</p>
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
          <button type="button" className="rr-text-link" onClick={onSkipWatch}>
            Don't carry a new focus
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className="rr-text-link"
        onClick={() => setShowDetails((value) => !value)}
      >
        {showDetails ? 'Hide details' : 'Add details'}
      </button>

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onDone}>
          Save round
        </Button>
      </div>
    </section>
  )
}
