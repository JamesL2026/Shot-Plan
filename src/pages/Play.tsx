import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MomentChooser } from '../components/play/MomentChooser'
import { MomentList } from '../components/play/MomentList'
import { RoundMemory } from '../components/play/RoundMemory'
import { Button } from '../components/ui/Button'
import { areaLabel } from '../data/moments'
import { newId, nowIso, storage } from '../lib/memoryStorage'
import { lastRoundNotices } from '../lib/patterns'
import { trackEvent } from '../lib/track'
import { emptyDebriefFields, type DebriefFields } from '../types/debrief'
import type {
  CourseObservationResult,
  Focus,
  FocusArea,
  Moment,
  Round,
  TransferFeel,
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
  const [courseTap, setCourseTap] = useState<CourseObservationResult | null>(null)
  const [transfer, setTransfer] = useState<TransferFeel | undefined>()
  const [fields, setFields] = useState<DebriefFields>(() => ({
    ...emptyDebriefFields(),
    remember: storage.getRoundDraft()?.remember ?? '',
  }))
  const [transcript, setTranscript] = useState(
    () => storage.getRoundDraft()?.transcript ?? '',
  )
  const lastRound = storage.getRounds()[0]
  const notices = lastRound ? lastRoundNotices(lastRound) : []

  function persist(next: Round) {
    storage.saveRound(next)
    setRound(next)
  }

  function startRound(holesPlayed: 9 | 18) {
    const next = emptyRound(holesPlayed)
    persist(next)
    setCourseTap(null)
    setTransfer(undefined)
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
      status: 'completed',
      completedAt: nowIso(),
    }
    storage.saveRound(completed)
    const active = storage.getActiveFocus()
    const talkWorked = Boolean(fields.worked.trim()) && !fields.didNotWork.trim()
    const talkMissed = Boolean(fields.didNotWork.trim()) && !fields.worked.trim()
    if (active && (courseTap || transfer || talkWorked || talkMissed)) {
      const result =
        courseTap ??
        (transfer === 'clearly-better' || transfer === 'somewhat-better'
          ? 'worked'
          : transfer
            ? 'showed-up'
            : talkWorked
              ? 'worked'
              : 'showed-up')
      storage.saveCourseObservation({
        id: newId(),
        roundId: completed.id,
        focusId: active.id,
        result,
        createdAt: nowIso(),
        ...(transfer ? { transferFeel: transfer } : {}),
      })
      if (result === 'worked' && storage.markAdjustmentWorked(active.id)) {
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
        ...(talkWorked ? { workedAt: nowIso() } : {}),
      })
    }
    trackEvent('round_completed')
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
          Tap when something stands out. Hole is optional. You do not log every
          shot.
        </p>
        <p className="sp-play__count">
          {round.moments.length === 0
            ? 'Nothing saved yet'
            : `${round.moments.length} saved`}
        </p>
        <MomentList moments={round.moments} onRemove={removeMoment} />

        {focus ? (
          <div className="sp-watch">
            <p className="sp-watch__label">Watching today</p>
            <p className="sp-watch__title">{focus.title}</p>
            <p className="muted">Just notice it. No need to track every time.</p>
            <div className="rr-cats">
              <button
                type="button"
                className={
                  courseTap === 'showed-up' ? 'rr-cat rr-cat--on' : 'rr-cat'
                }
                onClick={() => setCourseTap('showed-up')}
              >
                Showed up
              </button>
              <button
                type="button"
                className={courseTap === 'worked' ? 'rr-cat rr-cat--on' : 'rr-cat'}
                onClick={() => setCourseTap('worked')}
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

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Play</p>
      {lastRound && notices.length > 0 ? (
        <>
          <h1>Last time you played</h1>
          <ul className="rr-counts">
            {notices.map((line) => (
              <li key={line} className="rr-count">
                {line}
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
        <p className="muted">Watching: {areaLabel(focus.area)}</p>
      ) : null}

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
            <Button variant="secondary" block onClick={() => startRound(18)}>
              18 holes
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
