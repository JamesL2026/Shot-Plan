import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { TalkToShotPlan } from '../components/TalkToShotPlan'
import { Button } from '../components/ui/Button'
import {
  focusTitle,
  momentSubcategories,
  momentTypeLabel,
  momentTypes,
  stoodOutOptions,
  transferFeelOptions,
} from '../data/memory'
import {
  roundNotices,
  suggestedFocusFromMoment,
} from '../lib/memoryInsights'
import { memoryStore, newId, nowIso } from '../lib/memoryStorage'
import {
  micErrorMessage,
  speechRecognitionAvailable,
  startVoiceCapture,
  type VoiceSession,
} from '../lib/speech'
import { emptyTalkFields } from '../lib/talkParse'
import { track } from '../lib/track'
import type {
  FocusArea,
  MomentSubcategory,
  MomentType,
  ObservationResult,
  RoundMoment,
  SavedRound,
  StoodOut,
  TalkFields,
  TransferFeel,
} from '../types/memory'

const HOLES = Array.from({ length: 18 }, (_, index) => index + 1)

const TYPE_PROMPTS: Record<MomentType, string> = {
  shot: 'What kind of miss?',
  decision: 'What was the decision?',
  mental: 'What happened in your head?',
  good: 'What was good?',
}

function SpeakNote({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')
  const sessionRef = useRef<VoiceSession | null>(null)
  const baseRef = useRef(value)
  const voiceReady = speechRecognitionAvailable()

  useEffect(
    () => () => {
      sessionRef.current?.stop()
    },
    [],
  )

  if (!voiceReady) {
    return (
      <p className="muted rr-hint">
        Type it. Voice works in Chrome or Safari on this phone.
      </p>
    )
  }

  async function toggle() {
    if (listening) {
      sessionRef.current?.stop()
      sessionRef.current = null
      setListening(false)
      return
    }
    setError('')
    baseRef.current = value.trim()
    setListening(true)
    try {
      sessionRef.current = await startVoiceCapture({
        onError: (message) => {
          setError(message)
          sessionRef.current?.stop()
          sessionRef.current = null
          setListening(false)
        },
        onResult: (text, isFinal) => {
          const base = baseRef.current
          const next = base ? `${base} ${text}` : text
          onChange(next)
          if (isFinal) baseRef.current = next
        },
      })
    } catch (err) {
      setListening(false)
      setError(micErrorMessage(err))
    }
  }

  return (
    <>
      <button
        type="button"
        className={listening ? 'sp-voice sp-voice--on' : 'sp-voice'}
        onClick={() => void toggle()}
        aria-pressed={listening}
      >
        {listening ? 'Stop' : 'Speak'}
      </button>
      {error ? <p className="sp-talk__error">{error}</p> : null}
    </>
  )
}

function MomentSheet({
  open,
  maxHole = 18,
  lastHole,
  onClose,
  onSave,
}: {
  open: boolean
  maxHole?: number
  lastHole?: number
  onClose: () => void
  onSave: (input: {
    type: MomentType
    subcategory: MomentSubcategory
    note?: string
    holeNumber?: number
  }) => void
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [kind, setKind] = useState<MomentType | null>(null)
  const [hole, setHole] = useState<number | undefined>(lastHole)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!open) return
    setKind(null)
    setHole(lastHole && lastHole <= maxHole ? lastHole : undefined)
    setNoteOpen(false)
    setNote('')
    panelRef.current?.focus()
  }, [open, lastHole, maxHole])

  if (!open) return null

  function save(type: MomentType, subcategory: MomentSubcategory) {
    const trimmed = note.trim()
    onSave({
      type,
      subcategory,
      ...(trimmed ? { note: trimmed } : {}),
      ...(hole ? { holeNumber: hole } : {}),
    })
  }

  return (
    <div className="feedback-overlay" role="presentation">
      <button
        type="button"
        className="feedback-overlay__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="feedback-sheet feedback-sheet--compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="feedback-sheet__chrome">
          <button
            type="button"
            className="feedback-sheet__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.25} />
          </button>
        </div>
        <div className="feedback-sheet__body">
          <h2 id={titleId}>{kind ? TYPE_PROMPTS[kind] : 'What stood out?'}</h2>
          <p className="muted">
            Only this moment. You do not log every shot.
          </p>
          <p className="rr-note-label" id="hole-label">
            Hole (optional)
          </p>
          <div className="sp-holes" role="group" aria-labelledby="hole-label">
            {HOLES.filter((value) => value <= maxHole).map((value) => (
              <button
                type="button"
                className={hole === value ? 'sp-hole sp-hole--on' : 'sp-hole'}
                key={value}
                onClick={() =>
                  setHole((current) => (current === value ? undefined : value))
                }
              >
                {value}
              </button>
            ))}
          </div>
          {kind ? (
            <>
              <div className="rr-cats">
                {momentSubcategories[kind].map((option) => (
                  <button
                    type="button"
                    className="rr-cat"
                    key={option.value}
                    onClick={() => save(kind, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rr-text-link"
                onClick={() => setNoteOpen((open) => !open)}
              >
                {noteOpen ? 'Hide note' : 'Add note'}
              </button>
              {noteOpen ? (
                <>
                  <div className="sp-note-row">
                    <label className="rr-note-label" htmlFor="moment-note">
                      Note
                    </label>
                    <SpeakNote value={note} onChange={setNote} />
                  </div>
                  <textarea
                    id="moment-note"
                    className="rr-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Optional. One line."
                  />
                </>
              ) : null}
              <button
                type="button"
                className="rr-text-link"
                onClick={() => setKind(null)}
              >
                Back
              </button>
            </>
          ) : (
            <div className="rr-cats rr-cats--stack">
              {momentTypes.map((option) => (
                <button
                  type="button"
                  className="sp-type"
                  key={option.value}
                  onClick={() => setKind(option.value)}
                >
                  <span className="sp-type__label">{option.label}</span>
                  <span className="sp-type__hint">{option.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function momentTitle(moment: RoundMoment) {
  const label = `${momentSubcategories[moment.type].find((option) => option.value === moment.subcategory)?.label ?? moment.subcategory}`
  return moment.holeNumber ? `Hole ${moment.holeNumber} · ${label}` : label
}

function MemoryList({
  moments,
  selectedId,
  selectable = false,
  onSelect,
  onRemove,
}: {
  moments: RoundMoment[]
  selectedId?: string
  selectable?: boolean
  onSelect?: (moment: RoundMoment) => void
  onRemove?: (id: string) => void
}) {
  if (moments.length === 0) return null
  return (
    <ul className="sp-memory-list">
      {moments.map((moment) => {
        const selected = selectedId === moment.id
        const title = momentTitle(moment)
        return (
          <li key={moment.id}>
            <div
              className={
                selected
                  ? 'sp-memory-item sp-memory-item--on'
                  : 'sp-memory-item'
              }
            >
              {selectable && onSelect ? (
                <button
                  type="button"
                  className="sp-memory-item__main"
                  onClick={() => onSelect(moment)}
                >
                  <span className="sp-memory-item__title">{title}</span>
                  <span className="sp-memory-item__kind">
                    {selected
                      ? 'Watch this next round'
                      : `${momentTypeLabel(moment.type)} · tap to carry forward`}
                  </span>
                </button>
              ) : (
                <div className="sp-memory-item__main">
                  <span className="sp-memory-item__title">{title}</span>
                  <span className="sp-memory-item__kind">
                    {momentTypeLabel(moment.type)}
                  </span>
                </div>
              )}
              {onRemove ? (
                <button
                  type="button"
                  className="sp-memory-item__remove"
                  aria-label={`Remove ${title}`}
                  onClick={() => onRemove(moment.id)}
                >
                  <X size={18} strokeWidth={2.25} />
                </button>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function RoundMemory({
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
}: {
  round: SavedRound
  activeFocus?: ReturnType<typeof memoryStore.getActiveFocus>
  selectedMomentId?: string
  transfer?: TransferFeel
  fields: TalkFields
  transcript: string
  onSelectMoment: (id: string, area: FocusArea, title: string) => void
  onRemove: (id: string) => void
  onTransfer: (value: TransferFeel) => void
  onFields: (value: TalkFields) => void
  onTranscript: (value: string) => void
  onStoodOut: (value: StoodOut) => void
  onSkipWatch: () => void
  onDone: () => void
}) {
  const [typed, setTyped] = useState(false)
  const selected = round.moments.find((moment) => moment.id === selectedMomentId)
  const watch = selected ? suggestedFocusFromMoment(selected) : null

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
        <MemoryList
          moments={round.moments}
          selectable
          selectedId={selectedMomentId}
          onSelect={(moment) => {
            const next = suggestedFocusFromMoment(moment)
            onSelectMoment(moment.id, next.area, next.title)
          }}
          onRemove={onRemove}
        />
      ) : (
        <p className="muted">That’s okay. You can still save the round.</p>
      )}
      {watch ? (
        <div className="sp-watch">
          <p className="sp-watch__label">Next round</p>
          <p className="sp-watch__title">{watch.title}</p>
          <p className="muted">
            Just pay attention to it. No need to fix it mid round.
          </p>
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
        onFields={onFields}
      />
      <button
        type="button"
        className="rr-text-link"
        onClick={() => setTyped((open) => !open)}
      >
        {typed ? 'Hide typed fields' : 'Type instead'}
      </button>
      {typed ? (
        <>
          <p className="rr-prompt">What stood out?</p>
          <div className="rr-cats rr-cats--stack">
            {stoodOutOptions.map((option) => (
              <button
                type="button"
                className={
                  round.stoodOut === option.value
                    ? 'rr-cat rr-cat--on'
                    : 'rr-cat'
                }
                key={option.value}
                onClick={() => onStoodOut(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {activeFocus ? (
            <>
              <p className="rr-prompt">
                How did {focusTitle(activeFocus.area)} feel?
              </p>
              <div className="rr-cats rr-cats--stack">
                {transferFeelOptions.map((option) => (
                  <button
                    type="button"
                    className={
                      transfer === option.value ? 'rr-cat rr-cat--on' : 'rr-cat'
                    }
                    key={option.value}
                    onClick={() => onTransfer(option.value)}
                  >
                    {option.label}
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
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={onDone}
        >
          Save round
        </Button>
      </div>
    </section>
  )
}

function newRound(holes: 9 | 18): SavedRound {
  return {
    id: newId(),
    createdAt: nowIso(),
    completedAt: null,
    status: 'in-progress',
    moments: [],
    holesPlayed: holes,
  }
}

function carryFocus(area: FocusArea, title: string, reason?: string) {
  const existing = memoryStore.getFocuses().find((item) => item.area === area)
  if (existing) {
    memoryStore.saveFocus({
      ...existing,
      title,
      status: 'active',
      reason: reason ?? existing.reason ?? 'Just pay attention to it today.',
    })
    track('focus_carried_forward')
    return
  }
  memoryStore.saveFocus({
    id: newId(),
    title,
    area,
    createdAt: nowIso(),
    status: 'active',
    reason: reason ?? 'Just pay attention to it today.',
  })
  track('focus_created')
}

export function PlayPage() {
  const navigate = useNavigate()
  const [round, setRound] = useState(() => memoryStore.getRoundDraft())
  const [step, setStep] = useState<'idle' | 'live' | 'memory'>(() => {
    const draft = memoryStore.getRoundDraft()
    if (!draft) return 'idle'
    return draft.wrapUp ? 'memory' : 'live'
  })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [focus, setFocus] = useState(() => memoryStore.getActiveFocus())
  const [observation, setObservation] = useState<ObservationResult | null>(null)
  const [transfer, setTransfer] = useState<TransferFeel>()
  const [fields, setFields] = useState<TalkFields>(() => ({
    ...emptyTalkFields(),
    remember: memoryStore.getRoundDraft()?.remember ?? '',
  }))
  const [transcript, setTranscript] = useState(
    () => memoryStore.getRoundDraft()?.transcript ?? '',
  )
  const lastRound = memoryStore.getRounds()[0]
  const notices = lastRound ? roundNotices(lastRound) : []

  function persist(next: SavedRound) {
    memoryStore.saveRound(next)
    setRound(next)
  }

  function startRound(holes: 9 | 18) {
    persist(newRound(holes))
    setObservation(null)
    setTransfer(undefined)
    setFields(emptyTalkFields())
    setTranscript('')
    setFocus(memoryStore.getActiveFocus())
    setStep('live')
    track('round_started')
    if (memoryStore.getActiveFocus()) track('focus_reviewed')
  }

  function saveMoment(input: {
    type: MomentType
    subcategory: MomentSubcategory
    note?: string
    holeNumber?: number
  }) {
    if (!round) return
    const moment: RoundMoment = {
      id: newId(),
      roundId: round.id,
      timestamp: nowIso(),
      createdAt: nowIso(),
      type: input.type,
      subcategory: input.subcategory,
      ...(input.note ? { note: input.note } : {}),
      ...(input.holeNumber ? { holeNumber: input.holeNumber } : {}),
    }
    persist({ ...round, moments: [...round.moments, moment] })
    setSheetOpen(false)
    track('moment_logged')
  }

  function endRound() {
    if (!round) return
    persist({ ...round, wrapUp: true })
    setStep('memory')
  }

  function selectMoment(id: string, area: FocusArea, title: string) {
    if (!round) return
    persist({
      ...round,
      watchNextArea: area,
      watchNextTitle: title,
      watchNextMomentId: id,
    })
    carryFocus(area, title)
    setFocus(memoryStore.getActiveFocus())
  }

  function skipWatch() {
    if (!round) return
    persist({
      ...round,
      watchNextArea: undefined,
      watchNextTitle: undefined,
      watchNextMomentId: undefined,
    })
    const active = memoryStore.getActiveFocus()
    if (active) {
      memoryStore.saveFocus({ ...active, status: 'completed' })
      setFocus(undefined)
    }
  }

  function removeMoment(id: string) {
    if (!round) return
    persist({
      ...round,
      moments: round.moments.filter((moment) => moment.id !== id),
      ...(round.watchNextMomentId === id
        ? {
            watchNextMomentId: undefined,
            watchNextArea: undefined,
            watchNextTitle: undefined,
          }
        : {}),
    })
  }

  function completeRound() {
    if (!round) return
    const remember = fields.remember.trim() || round.remember
    const tried = fields.tried.trim()
    const worked = Boolean(fields.worked.trim()) && !fields.didNotWork.trim()
    const didNotWork =
      Boolean(fields.didNotWork.trim()) && !fields.worked.trim()
    const completed: SavedRound = {
      ...round,
      remember: remember || undefined,
      transcript: transcript.trim() || undefined,
      status: 'completed',
      completedAt: nowIso(),
    }
    memoryStore.saveRound(completed)
    const active = memoryStore.getActiveFocus()
    if (active && (observation || transfer || worked || didNotWork)) {
      const result: ObservationResult =
        observation ??
        (transfer === 'clearly-better' || transfer === 'somewhat-better'
          ? 'worked'
          : transfer
            ? 'showed-up'
            : worked
              ? 'worked'
              : 'showed-up')
      memoryStore.saveCourseObservation({
        id: newId(),
        roundId: completed.id,
        focusId: active.id,
        result,
        createdAt: nowIso(),
        ...(transfer ? { transferFeel: transfer } : {}),
      })
      if (result === 'worked' && memoryStore.markAdjustmentWorked(active.id)) {
        track('adjustment_marked_worked')
      }
      track('course_observation_logged')
    }
    if (active && remember) {
      memoryStore.saveFocus({ ...active, reason: remember })
    }
    if (active && tried) {
      memoryStore.saveAdjustment({
        id: newId(),
        focusId: active.id,
        createdAt: nowIso(),
        whatITried: tried,
        source: 'round',
        ...(worked ? { workedAt: nowIso() } : {}),
      })
    }
    track('round_completed')
    track('debrief_saved')
    setRound(null)
    memoryStore.clearRoundDraft()
    setStep('idle')
    navigate('/progress')
  }

  if (step === 'memory' && round) {
    return (
      <section className="page rr-page">
        <RoundMemory
          round={round}
          activeFocus={focus}
          selectedMomentId={round.watchNextMomentId}
          transfer={transfer}
          fields={fields}
          transcript={transcript}
          onSelectMoment={selectMoment}
          onRemove={removeMoment}
          onTransfer={setTransfer}
          onFields={(next) => {
            setFields(next)
            persist({
              ...round,
              remember: next.remember.trim() || undefined,
              transcript: transcript.trim() || undefined,
            })
          }}
          onTranscript={(next) => {
            setTranscript(next)
            persist({
              ...round,
              transcript: next.trim() || undefined,
            })
          }}
          onStoodOut={(value) => persist({ ...round, stoodOut: value })}
          onSkipWatch={skipWatch}
          onDone={completeRound}
        />
      </section>
    )
  }

  if (step === 'live' && round) {
    return (
      <section className="page rr-page sp-play">
        <p className="rr-kicker">
          {round.holesPlayed === 9
            ? '9 holes'
            : round.holesPlayed === 18
              ? '18 holes'
              : 'Play'}
        </p>
        <h1>Remember what mattered</h1>
        <p className="muted">
          Tap when something stands out. Hole is optional. You do not log every
          shot.
        </p>
        <p className="sp-play__count">
          {round.moments.length === 0
            ? 'Nothing saved yet'
            : `${round.moments.length} saved`}
        </p>
        <MemoryList moments={round.moments} onRemove={removeMoment} />
        {focus ? (
          <div className="sp-watch">
            <p className="sp-watch__label">Watching today</p>
            <p className="sp-watch__title">{focus.title}</p>
            <p className="muted">
              Just notice it. No need to track every time.
            </p>
            <div className="rr-cats">
              <button
                type="button"
                className={
                  observation === 'showed-up' ? 'rr-cat rr-cat--on' : 'rr-cat'
                }
                onClick={() => setObservation('showed-up')}
              >
                Showed up
              </button>
              <button
                type="button"
                className={
                  observation === 'worked' ? 'rr-cat rr-cat--on' : 'rr-cat'
                }
                onClick={() => setObservation('worked')}
              >
                Seemed better
              </button>
            </div>
            <p className="muted rr-hint">Optional. Skip it.</p>
          </div>
        ) : null}
        <button
          type="button"
          className="sp-moment-btn"
          onClick={() => setSheetOpen(true)}
        >
          + Moment
        </button>
        <Button variant="secondary" block onClick={endRound}>
          End round
        </Button>
        <MomentSheet
          open={sheetOpen}
          maxHole={round.holesPlayed ?? 18}
          lastHole={[...round.moments]
            .reverse()
            .find((moment) => moment.holeNumber)?.holeNumber}
          onClose={() => setSheetOpen(false)}
          onSave={saveMoment}
        />
      </section>
    )
  }

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Play</p>
      {lastRound && notices.length > 0 ? (
        <>
          <h1>Last time you played</h1>
          <ul className="rr-counts">
            {notices.map((notice) => (
              <li className="rr-count" key={notice}>
                {notice}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h1>Don’t track every shot</h1>
      )}
      {focus ? (
        <div className="sp-watch">
          <p className="sp-watch__label">Carry forward</p>
          <p className="sp-watch__title">{focus.title}</p>
          <p className="muted">
            {focus.reason ?? 'Just pay attention to it today.'}
          </p>
          <p className="muted">
            No need to change the swing. No need to fix it mid round.
          </p>
        </div>
      ) : lastRound ? (
        <p className="muted">
          After this round you can choose one thing to carry forward.
        </p>
      ) : (
        <p className="rr-lead">
          When something matters, tap once. Then put the phone away.
        </p>
      )}
      {focus ? (
        <p className="muted">Watching: {focusTitle(focus.area)}</p>
      ) : null}
      <div className="rr-actions">
        {memoryStore.getRoundDraft() ? (
          <Button
            variant="primary"
            block
            className="ready-cta__btn"
            onClick={() => setStep('live')}
          >
            Continue round
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              block
              className="ready-cta__btn"
              onClick={() => startRound(9)}
            >
              9 holes
            </Button>
            <Button variant="secondary" block onClick={() => startRound(18)}>
              18 holes
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
