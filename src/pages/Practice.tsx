import { useMemo, useRef, useState } from 'react'
import { TalkToShotPlan } from '../components/TalkToShotPlan'
import { Button } from '../components/ui/Button'
import {
  focusOptions,
  focusTitle,
  formatPracticeScore,
  successLabelByKind,
  testKindByArea,
  testOptionsByKind,
} from '../data/memory'
import { momentMatchesArea } from '../lib/memoryInsights'
import { memoryStore, newId, nowIso } from '../lib/memoryStorage'
import { emptyTalkFields } from '../lib/talkParse'
import { track } from '../lib/track'
import { loadSwingUrl, saveSwing } from '../lib/videoStore'
import type { Focus, FocusArea, PracticeResult, TalkFields } from '../types/memory'

const SHOT_COUNT = 5

function Debrief({
  focusTitle: title,
  fields,
  transcript,
  club,
  feltDifferent,
  onFields,
  onTranscript,
  onClub,
  onFelt,
  onSave,
}: {
  focusTitle: string
  fields: TalkFields
  transcript: string
  club: string
  feltDifferent: PracticeResult | ''
  onFields: (value: TalkFields) => void
  onTranscript: (value: string) => void
  onClub: (value: string) => void
  onFelt: (value: PracticeResult) => void
  onSave: () => void
}) {
  const [typed, setTyped] = useState(false)

  return (
    <section className="page rr-page">
      <p className="rr-kicker">{title}</p>
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
        onClick={() => setTyped((open) => !open)}
      >
        {typed ? 'Hide typed fields' : 'Type instead'}
      </button>
      {typed ? (
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
              className={
                feltDifferent === 'yes' ? 'rr-cat rr-cat--on' : 'rr-cat'
              }
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

export function PracticePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const savedRef = useRef(false)
  const [focus, setFocus] = useState(() => memoryStore.getActiveFocus())
  const [step, setStep] = useState<'pick' | 'test' | 'debrief' | 'result'>(
    () => (memoryStore.getActiveFocus() ? 'test' : 'pick'),
  )
  const [results, setResults] = useState<string[]>([])
  const [saved, setSaved] = useState<ReturnType<
    typeof memoryStore.getPracticeSessions
  >[number] | null>(null)
  const [fields, setFields] = useState<TalkFields>(emptyTalkFields)
  const [transcript, setTranscript] = useState('')
  const [felt, setFelt] = useState<PracticeResult | ''>('')
  const [club, setClub] = useState('')
  const [clipUrl, setClipUrl] = useState<string | null>(null)
  const [clipError, setClipError] = useState<string | null>(null)

  const testKind = focus ? testKindByArea[focus.area] : 'contact'
  const options = testOptionsByKind[testKind]
  const successLabel = successLabelByKind[testKind]

  const previous = useMemo(() => {
    if (!focus) return undefined
    return memoryStore.getPracticeSessions(focus.id)[0]
  }, [focus])

  const lastRoundCount = useMemo(() => {
    if (!focus) return 0
    const round = memoryStore.getRounds()[0]
    return round
      ? round.moments.filter((moment) => momentMatchesArea(moment, focus.area))
          .length
      : 0
  }, [focus])

  function startFocus(area: FocusArea) {
    const existing = memoryStore.getFocuses().find((item) => item.area === area)
    const next: Focus = existing
      ? { ...existing, title: focusTitle(area), status: 'active' }
      : {
          id: newId(),
          title: focusTitle(area),
          area,
          createdAt: nowIso(),
          status: 'active',
          reason: 'Just pay attention to it today.',
        }
    memoryStore.saveFocus(next)
    setFocus(next)
    setResults([])
    setSaved(null)
    setFields(emptyTalkFields())
    setTranscript('')
    setFelt('')
    setClub('')
    setClipUrl(null)
    savedRef.current = false
    setStep('test')
    track(existing ? 'focus_carried_forward' : 'focus_created')
    track('practice_started')
  }

  function savePractice(attempts: string[]) {
    if (!focus || attempts.length === 0 || savedRef.current) return
    savedRef.current = true
    const successCount = attempts.filter((item) => item === successLabel).length
    const session = {
      id: newId(),
      focusId: focus.id,
      date: nowIso(),
      club: club.trim() || undefined,
      testType: testKind,
      successCriteria: `${successLabel} out of ${attempts.length}`,
      result: formatPracticeScore(successCount, attempts.length, successLabel),
      successCount,
      attemptCount: attempts.length,
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
    } as const
    const rows = attempts.map((result, index) => ({
      id: newId(),
      practiceSessionId: session.id,
      sequence: index + 1,
      result,
    }))
    memoryStore.savePracticeSession(session)
    memoryStore.saveAttempts(rows)
    if (fields.remember.trim() || fields.workingOn.trim()) {
      const reason = fields.workingOn.trim() || fields.remember.trim()
      memoryStore.saveFocus({ ...focus, reason })
      setFocus({ ...focus, reason })
    }
    if (fields.tried.trim()) {
      memoryStore.saveAdjustment({
        id: newId(),
        focusId: focus.id,
        createdAt: nowIso(),
        whatITried: fields.tried.trim(),
        source: 'practice',
      })
    }
    if (fields.tried.trim() && fields.worked.trim() && !fields.didNotWork.trim()) {
      memoryStore.markAdjustmentWorked(focus.id)
      track('adjustment_marked_worked')
    }
    setSaved(session)
    setStep('result')
    track('practice_completed')
    track('debrief_saved')
  }

  function logShot(result: string) {
    if (results.length >= SHOT_COUNT) return
    setResults([...results, result])
  }

  async function saveClip(file?: File) {
    if (!file || !saved || !focus) return
    setClipError(null)
    try {
      const id = newId()
      await saveSwing(id, file)
      const url = await loadSwingUrl(id)
      memoryStore.saveSwingCheckpoint({
        id,
        practiceSessionId: saved.id,
        club: club.trim() || undefined,
        focus: focus.title,
        localReference: id,
        note: fields.remember.trim() || undefined,
        createdAt: nowIso(),
      })
      setClipUrl(url)
      track('swing_checkpoint_saved')
    } catch {
      setClipError('Could not save the clip on this phone. Try again.')
    }
  }

  if (step === 'pick') {
    return (
      <section className="page rr-page">
        <p className="rr-kicker">Practice</p>
        <h1>Start a focus</h1>
        <p className="muted">
          Pick one thing. You’ll hit {SHOT_COUNT} shots and tap how they went.
          You decide what success means.
        </p>
        <div className="rr-cats rr-cats--stack">
          {focusOptions.map((option) => (
            <button
              type="button"
              className="rr-cat"
              key={option.value}
              onClick={() => startFocus(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (step === 'debrief' && focus) {
    return (
      <Debrief
        focusTitle={focus.title}
        fields={fields}
        transcript={transcript}
        club={club}
        feltDifferent={felt}
        onFields={setFields}
        onTranscript={setTranscript}
        onClub={setClub}
        onFelt={setFelt}
        onSave={() => savePractice(results)}
      />
    )
  }

  if (step === 'result' && saved) {
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
                memoryStore.savePracticeSession(next)
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
            onChange={(event) => void saveClip(event.target.files?.[0])}
          />
          <Button
            variant="secondary"
            block
            onClick={() => fileRef.current?.click()}
          >
            {clipUrl ? 'Replace clip' : 'Record or upload swing'}
          </Button>
          {clipError ? <p className="muted">{clipError}</p> : null}
          {clipUrl ? (
            <video className="sp-video" src={clipUrl} controls playsInline />
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
              setResults([])
              setSaved(null)
              setClipUrl(null)
              setFields(emptyTalkFields())
              setTranscript('')
              setFelt('')
              savedRef.current = false
              setStep('test')
              track('practice_started')
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
        {results.filter((item) => item === successLabel).length} /{' '}
        {results.length} {successLabel.toLowerCase()}
      </p>
      <p className="muted">
        {SHOT_COUNT} shots. Hit one, then tap. You decide what counts.
      </p>
      <div
        className={
          options.length === 3 ? 'rr-cats rr-cats--three' : 'rr-cats'
        }
      >
        {options.map((option) => (
          <button
            type="button"
            className="rr-cat"
            key={option}
            disabled={results.length >= SHOT_COUNT}
            onClick={() => logShot(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {results.length > 0 ? (
        <p className="muted">{results.join(' · ')}</p>
      ) : null}
      <div className="rr-actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          disabled={results.length === 0}
          onClick={() => setStep('debrief')}
        >
          Debrief
        </Button>
        <button
          type="button"
          className="rr-text-link"
          onClick={() => setStep('pick')}
        >
          Work on something else
        </button>
      </div>
    </section>
  )
}
