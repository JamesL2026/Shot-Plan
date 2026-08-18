import { useMemo, useRef, useState } from 'react'
import { PracticeDebrief } from '../components/practice/PracticeDebrief'
import { Button } from '../components/ui/Button'
import {
  ATTEMPT_OPTIONS,
  DEFAULT_ATTEMPTS,
  FOCUS_AREAS,
  SUCCESS_FOR_TEST,
  TEST_FOR_AREA,
  areaLabel,
  practiceResultLine,
} from '../data/moments'
import { newId, nowIso, storage } from '../lib/memoryStorage'
import { momentMatchesArea } from '../lib/patterns'
import { trackEvent } from '../lib/track'
import { getVideoUrl, saveVideoBlob } from '../lib/videoStore'
import { emptyDebriefFields, type DebriefFields } from '../types/debrief'
import type {
  Focus,
  FocusArea,
  PracticeAttempt,
  PracticeSession,
  PracticeTestType,
} from '../types/memory'

type Phase = 'pick' | 'test' | 'debrief' | 'result'

export function PracticePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const finishingRef = useRef(false)
  const [focus, setFocus] = useState<Focus | undefined>(() =>
    storage.getActiveFocus(),
  )
  const [phase, setPhase] = useState<Phase>(() =>
    storage.getActiveFocus() ? 'test' : 'pick',
  )
  const [attempts, setAttempts] = useState<string[]>([])
  const [saved, setSaved] = useState<PracticeSession | null>(null)
  const [fields, setFields] = useState<DebriefFields>(emptyDebriefFields)
  const [transcript, setTranscript] = useState('')
  const [felt, setFelt] = useState('')
  const [club, setClub] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)

  const testType: PracticeTestType = focus
    ? TEST_FOR_AREA[focus.area]
    : 'contact'
  const options = ATTEMPT_OPTIONS[testType]
  const success = SUCCESS_FOR_TEST[testType]
  const previous = useMemo(() => {
    if (!focus) return undefined
    return storage.getPracticeSessions(focus.id)[0]
  }, [focus])
  const lastRoundCount = useMemo(() => {
    if (!focus) return 0
    const last = storage.getRounds()[0]
    if (!last) return 0
    return last.moments.filter((moment) =>
      momentMatchesArea(moment, focus.area),
    ).length
  }, [focus])

  function chooseArea(area: FocusArea) {
    const existing = storage.getFocuses().find((item) => item.area === area)
    const next: Focus = existing
      ? { ...existing, title: areaLabel(area), status: 'active' }
      : {
          id: newId(),
          title: areaLabel(area),
          area,
          createdAt: nowIso(),
          status: 'active',
          reason: 'Just pay attention to it today.',
        }
    storage.saveFocus(next)
    setFocus(next)
    setAttempts([])
    setSaved(null)
    setFields(emptyDebriefFields())
    setTranscript('')
    setFelt('')
    setClub('')
    setVideoUrl(null)
    finishingRef.current = false
    setPhase('test')
    trackEvent(existing ? 'focus_carried_forward' : 'focus_created')
    trackEvent('practice_started')
  }

  function finishTest(nextAttempts: string[]) {
    if (!focus || nextAttempts.length === 0 || finishingRef.current) return
    finishingRef.current = true
    const successCount = nextAttempts.filter((item) => item === success).length
    const session: PracticeSession = {
      id: newId(),
      focusId: focus.id,
      date: nowIso(),
      club: club.trim() || undefined,
      testType,
      successCriteria: `${success} out of ${nextAttempts.length}`,
      result: practiceResultLine(successCount, nextAttempts.length, success),
      successCount,
      attemptCount: nextAttempts.length,
      previousResult: previous?.result,
      feltDifferent:
        felt ||
        (fields.worked && !fields.didNotWork
          ? 'yes'
          : fields.didNotWork && !fields.worked
            ? 'no'
            : undefined),
      notes:
        fields.remember.trim() ||
        fields.worked.trim() ||
        fields.didNotWork.trim() ||
        undefined,
      watchNext: fields.workingOn.trim() || undefined,
      transcript: transcript.trim() || undefined,
    }
    const rows: PracticeAttempt[] = nextAttempts.map((result, index) => ({
      id: newId(),
      practiceSessionId: session.id,
      sequence: index + 1,
      result,
    }))
    storage.savePracticeSession(session)
    storage.saveAttempts(rows)
    if (fields.remember.trim() || fields.workingOn.trim()) {
      const reason = fields.workingOn.trim() || fields.remember.trim()
      storage.saveFocus({
        ...focus,
        reason,
      })
      setFocus({ ...focus, reason })
    }
    if (fields.tried.trim()) {
      storage.saveAdjustment({
        id: newId(),
        focusId: focus.id,
        createdAt: nowIso(),
        whatITried: fields.tried.trim(),
        source: 'practice',
      })
    }
    if (fields.tried.trim() && fields.worked.trim() && !fields.didNotWork.trim()) {
      storage.markAdjustmentWorked(focus.id)
      trackEvent('adjustment_marked_worked')
    }
    setSaved(session)
    setPhase('result')
    trackEvent('practice_completed')
    trackEvent('debrief_saved')
  }

  function tapResult(result: string) {
    if (attempts.length >= DEFAULT_ATTEMPTS) return
    const next = [...attempts, result]
    setAttempts(next)
  }

  async function onVideo(file: File | undefined) {
    if (!file || !saved || !focus) return
    setVideoError(null)
    try {
      const id = newId()
      await saveVideoBlob(id, file)
      const url = await getVideoUrl(id)
      storage.saveSwingCheckpoint({
        id,
        practiceSessionId: saved.id,
        club: club.trim() || undefined,
        focus: focus.title,
        localReference: id,
        note: fields.remember.trim() || undefined,
        createdAt: nowIso(),
      })
      setVideoUrl(url)
      trackEvent('swing_checkpoint_saved')
    } catch {
      setVideoError('Could not save the clip on this phone. Try again.')
    }
  }

  if (phase === 'pick') {
    return (
      <section className="page rr-page">
        <p className="rr-kicker">Practice</p>
        <h1>Start a focus</h1>
        <p className="muted">
          Pick one thing. You’ll hit {DEFAULT_ATTEMPTS} shots and tap how they
          went. You decide what success means.
        </p>
        <div className="rr-cats rr-cats--stack">
          {FOCUS_AREAS.map((item) => (
            <button
              key={item.value}
              type="button"
              className="rr-cat"
              onClick={() => chooseArea(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (phase === 'debrief' && focus) {
    return (
      <PracticeDebrief
        focusTitle={focus.title}
        fields={fields}
        transcript={transcript}
        club={club}
        feltDifferent={felt}
        onFields={setFields}
        onTranscript={setTranscript}
        onClub={setClub}
        onFelt={setFelt}
        onSave={() => finishTest(attempts)}
      />
    )
  }

  if (phase === 'result' && saved) {
    const improved =
      previous &&
      typeof previous.successCount === 'number' &&
      typeof previous.attemptCount === 'number' &&
      typeof saved.successCount === 'number' &&
      typeof saved.attemptCount === 'number' &&
      saved.successCount / saved.attemptCount >
        previous.successCount / previous.attemptCount

    return (
      <section className="page rr-page">
        <p className="rr-kicker">{focus?.title}</p>
        <p className="rr-overall">{saved.result}</p>
        {previous?.result ? (
          <p className="muted">Previous: {previous.result}</p>
        ) : (
          <p className="muted">First baseline saved.</p>
        )}
        {improved ? (
          <p className="rr-lead">Your practice result improved.</p>
        ) : previous ? (
          <p className="muted">Saved. Not a diagnosis, just the count.</p>
        ) : null}
        {saved.notes ? <p>{saved.notes}</p> : null}

        <div className="sp-swing">
          <p className="rr-prompt rr-prompt--quiet">Swing clip (optional)</p>
          <p className="muted">
            Visual memory on this phone. ShotPlan does not analyze your swing.
          </p>
          <label className="rr-note-label" htmlFor="practice-club">
            Club (optional)
          </label>
          <input
            id="practice-club"
            className="sp-input"
            value={club}
            onChange={(event) => {
              const value = event.target.value
              setClub(value)
              if (saved) {
                const next = { ...saved, club: value.trim() || undefined }
                storage.savePracticeSession(next)
                setSaved(next)
              }
            }}
            placeholder="7 iron"
          />
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            capture="environment"
            className="sp-file"
            onChange={(event) => void onVideo(event.target.files?.[0])}
          />
          <Button
            variant="secondary"
            block
            onClick={() => fileRef.current?.click()}
          >
            {videoUrl ? 'Replace clip' : 'Record or upload swing'}
          </Button>
          {videoError ? <p className="muted">{videoError}</p> : null}
          {videoUrl ? (
            <video className="sp-video" src={videoUrl} controls playsInline />
          ) : null}
        </div>

        <div className="rr-actions">
          <Button variant="primary" block to="/play">
            Play a round
          </Button>
          <Button
            variant="secondary"
            block
            onClick={() => {
              setAttempts([])
              setSaved(null)
              setVideoUrl(null)
              setFields(emptyDebriefFields())
              setTranscript('')
              setFelt('')
              finishingRef.current = false
              setPhase('test')
              trackEvent('practice_started')
            }}
          >
            Practice again
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Current focus</p>
      <h1>{focus?.title}</h1>
      {lastRoundCount > 0 ? (
        <p className="muted">
          Last round you noticed this {lastRoundCount} time
          {lastRoundCount === 1 ? '' : 's'}.
        </p>
      ) : (
        <p className="muted">How do you want to test it?</p>
      )}
      <p className="sp-play__count">
        {attempts.filter((item) => item === success).length} / {attempts.length}{' '}
        {success.toLowerCase()}
      </p>
      <p className="muted">
        {DEFAULT_ATTEMPTS} shots. Hit one, then tap. You decide what counts.
      </p>
      <div className={options.length === 3 ? 'rr-cats rr-cats--three' : 'rr-cats'}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="rr-cat"
            disabled={attempts.length >= DEFAULT_ATTEMPTS}
            onClick={() => tapResult(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {attempts.length > 0 ? (
        <p className="muted">{attempts.join(' · ')}</p>
      ) : null}

      <div className="rr-actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          disabled={attempts.length === 0}
          onClick={() => setPhase('debrief')}
        >
          Debrief
        </Button>
        <button
          type="button"
          className="rr-text-link"
          onClick={() => setPhase('pick')}
        >
          Work on something else
        </button>
      </div>
    </section>
  )
}
