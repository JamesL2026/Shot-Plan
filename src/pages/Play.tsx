import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MomentChooser } from '../components/play/MomentChooser'
import { MomentList } from '../components/play/MomentList'
import { RoundMemory } from '../components/play/RoundMemory'
import { Button } from '../components/ui/Button'
import { helpToCourse, helpToTransfer } from '../data/moments'
import { newId, nowIso, storage } from '../lib/memoryStorage'
import { workingAdjustments } from '../lib/patterns'
import { trackEvent } from '../lib/track'
import { emptyDebriefFields, type DebriefFields } from '../types/debrief'
import type {
  ExperimentHelp,
  Focus,
  FocusArea,
  Moment,
  Round,
} from '../types/memory'

type Phase = 'idle' | 'live' | 'memory'

function emptyRound(holesPlayed: 9 | 18): Round {
  return {
    id: newId(),
    createdAt: nowIso(),
    completedAt: null,
    status: 'in-progress',
    moments: [],
    holesPlayed,
  }
}

function activateFocus(area: FocusArea, title: string, reason?: string) {
  const existing = storage.getFocuses().find((item) => item.area === area)
  if (existing) {
    storage.saveFocus({
      ...existing,
      title,
      status: 'active',
      reason: reason ?? existing.reason ?? 'Just pay attention to it today.',
    })
    trackEvent('focus_carried_forward')
    return
  }
  storage.saveFocus({
    id: newId(),
    title,
    area,
    createdAt: nowIso(),
    status: 'active',
    reason: reason ?? 'Just pay attention to it today.',
  })
  trackEvent('focus_created')
}

export function PlayPage() {
  const navigate = useNavigate()
  const [round, setRound] = useState<Round | null>(() => storage.getRoundDraft())
  const [phase, setPhase] = useState<Phase>(() => {
    const draft = storage.getRoundDraft()
    if (!draft) return 'idle'
    return draft.wrapUp ? 'memory' : 'live'
  })
  const [chooser, setChooser] = useState(false)
  const [focus, setFocus] = useState<Focus | undefined>(() =>
    storage.getActiveFocus(),
  )
  const [helped, setHelped] = useState<ExperimentHelp | undefined>()
  const [fields, setFields] = useState<DebriefFields>(() => ({
    ...emptyDebriefFields(),
    remember: storage.getRoundDraft()?.remember ?? '',
  }))
  const [transcript, setTranscript] = useState(
    () => storage.getRoundDraft()?.transcript ?? '',
  )

  function persist(next: Round) {
    storage.saveRound(next)
    setRound(next)
  }

  function startRound(holesPlayed: 9 | 18) {
    const next = emptyRound(holesPlayed)
    persist(next)
    setHelped(undefined)
    setFields(emptyDebriefFields())
    setTranscript('')
    setFocus(storage.getActiveFocus())
    setPhase('live')
    trackEvent('round_started')
    if (storage.getActiveFocus()) trackEvent('focus_reviewed')
  }

  function addMoment(
    input: Omit<Moment, 'id' | 'roundId' | 'timestamp' | 'createdAt'>,
  ) {
    if (!round) return
    const moment: Moment = {
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
    setChooser(false)
    trackEvent('moment_logged')
  }

  function endRound() {
    if (!round) return
    persist({ ...round, wrapUp: true })
    setPhase('memory')
    trackEvent('debrief_started')
  }

  function selectMoment(id: string, area: FocusArea, title: string) {
    if (!round) return
    persist({
      ...round,
      watchNextArea: area,
      watchNextTitle: title,
      watchNextMomentId: id,
    })
    activateFocus(area, title)
    setFocus(storage.getActiveFocus())
  }

  function skipWatch() {
    if (!round) return
    persist({
      ...round,
      watchNextArea: undefined,
      watchNextTitle: undefined,
      watchNextMomentId: undefined,
    })
    const active = storage.getActiveFocus()
    if (active) {
      storage.saveFocus({ ...active, status: 'completed' })
      setFocus(undefined)
    }
  }

  function removeMoment(id: string) {
    if (!round) return
    const moments = round.moments.filter((item) => item.id !== id)
    persist({
      ...round,
      moments,
      ...(round.watchNextMomentId === id
        ? {
            watchNextMomentId: undefined,
            watchNextArea: undefined,
            watchNextTitle: undefined,
          }
        : {}),
    })
  }

  function saveRound() {
    if (!round) return
    const remember = fields.remember.trim() || round.remember
    const tried = fields.tried.trim()
    const completed: Round = {
      ...round,
      remember: remember || undefined,
      transcript: transcript.trim() || undefined,
      focusHelped: helped,
      status: 'completed',
      completedAt: nowIso(),
    }
    storage.saveRound(completed)
    const active = storage.getActiveFocus()
    const talkWorked = Boolean(fields.worked.trim()) && !fields.didNotWork.trim()
    const talkMissed = Boolean(fields.didNotWork.trim()) && !fields.worked.trim()
    const courseResult =
      helpToCourse(helped) ??
      (talkWorked ? 'worked' : talkMissed ? 'showed-up' : undefined)
    const transferFeel = helpToTransfer(helped)
    if (active && courseResult) {
      storage.saveCourseObservation({
        id: newId(),
        roundId: completed.id,
        focusId: active.id,
        result: courseResult,
        createdAt: nowIso(),
        ...(transferFeel ? { transferFeel } : {}),
      })
      if (courseResult === 'worked' && storage.markAdjustmentWorked(active.id)) {
        trackEvent('adjustment_marked_worked')
      }
      trackEvent('course_observation_logged')
    }
    if (active && remember) {
      storage.saveFocus({ ...active, reason: remember })
    }
    if (active && tried) {
      storage.saveAdjustment({
        id: newId(),
        focusId: active.id,
        createdAt: nowIso(),
        whatITried: tried,
        source: 'round',
        ...(talkWorked || helped === 'yes' || helped === 'somewhat'
          ? { workedAt: nowIso() }
          : {}),
      })
      trackEvent('adjustment_created')
    }
    trackEvent('round_completed')
    trackEvent('round_debrief_saved')
    trackEvent('debrief_saved')
    setRound(null)
    storage.clearRoundDraft()
    setPhase('idle')
    navigate('/progress')
  }

  if (phase === 'memory' && round) {
    return (
      <section className="page rr-page">
        <RoundMemory
          round={round}
          activeFocus={focus}
          selectedMomentId={round.watchNextMomentId}
          helped={helped}
          fields={fields}
          transcript={transcript}
          onSelectMoment={selectMoment}
          onRemove={removeMoment}
          onHelped={setHelped}
          onFields={(next) => {
            setFields(next)
            persist({
              ...round,
              remember: next.remember.trim() || undefined,
              transcript: transcript.trim() || undefined,
            })
          }}
          onTranscript={(value) => {
            setTranscript(value)
            persist({ ...round, transcript: value.trim() || undefined })
          }}
          onStoodOut={(value) => persist({ ...round, stoodOut: value })}
          onSkipWatch={skipWatch}
          onDone={saveRound}
        />
      </section>
    )
  }

  if (phase === 'live' && round) {
    return (
      <section className="page rr-page sp-play">
        <p className="rr-kicker">
          {round.holesPlayed === 9 ? '9 holes' : round.holesPlayed === 18 ? '18 holes' : 'Play'}
        </p>
        <h1>Remember what mattered</h1>
        <p className="muted">
          {round.holesPlayed === 9
            ? '9 holes. Can what you practiced survive a real round?'
            : 'Tap when something stands out. You do not log every shot.'}
        </p>
        <p className="sp-play__count">
          {round.moments.length === 0
            ? 'Zero moments is fine'
            : `${round.moments.length} saved`}
        </p>
        <MomentList moments={round.moments} onRemove={removeMoment} />

        {focus ? (
          <div className="sp-watch">
            <p className="sp-watch__label">Watching today</p>
            <p className="sp-watch__title">{focus.title}</p>
            <p className="muted">Notice it. Do not track every time. Phone away.</p>
          </div>
        ) : null}

        <button
          type="button"
          className="sp-moment-btn"
          onClick={() => setChooser(true)}
        >
          + Moment
        </button>

        <Button variant="secondary" block onClick={endRound}>
          End round
        </Button>

        <MomentChooser
          open={chooser}
          maxHole={round.holesPlayed ?? 18}
          lastHole={[...round.moments].reverse().find((item) => item.holeNumber)?.holeNumber}
          onClose={() => setChooser(false)}
          onSave={addMoment}
        />
      </section>
    )
  }

  const carryTried = focus
    ? workingAdjustments(storage.getAdjustments(focus.id))[0]?.whatITried ||
      storage.getPracticeSessions(focus.id)[0]?.whatWasTried
    : undefined

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Play</p>
      <h1>Don't track every shot</h1>
      <p className="muted">
        One or two moments is plenty. Zero is valid. Talk after the round.
      </p>

      {focus ? (
        <div className="sp-watch">
          <p className="sp-watch__label">Carry forward</p>
          <p className="sp-watch__title">{focus.title}</p>
          {carryTried ? <p>Testing: {carryTried}</p> : null}
          <p className="muted">See whether it holds up on the course.</p>
          <p className="muted">
            9 holes is a first-class transfer test. 18 holes is a longer one. Do
            not fix it mid round.
          </p>
        </div>
      ) : (
        <p className="rr-lead">
          When something matters, tap once. Then put the phone away.
        </p>
      )}

      <div className="rr-actions">
        {storage.getRoundDraft() ? (
          <Button
            variant="primary"
            block
            className="ready-cta__btn"
            onClick={() => setPhase('live')}
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
            <p className="muted">Transfer test. Can the practice hold up?</p>
            <Button variant="secondary" block onClick={() => startRound(18)}>
              18 holes
            </Button>
            <p className="muted">Longer transfer test.</p>
          </>
        )}
      </div>
    </section>
  )
}
