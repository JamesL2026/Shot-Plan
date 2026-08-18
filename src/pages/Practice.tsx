import { useMemo, useRef, useState } from 'react'
import { HistoryList } from '../components/history/HistoryList'
import { VoiceNoteButton } from '../components/capture/VoiceNoteButton'
import { ExperimentInput } from '../components/practice/ExperimentInput'
import { HowToStart, type StartPath } from '../components/practice/HowToStart'
import { PracticeDebrief } from '../components/practice/PracticeDebrief'
import { PreviousHelpful } from '../components/practice/PreviousHelpful'
import { Button } from '../components/ui/Button'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import {
  DEFAULT_ATTEMPTS,
  FOCUS_AREAS,
  TEST_FOR_AREA,
  attemptOptions,
  areaLabel,
  practiceResultLine,
  successForArea,
} from '../data/moments'
import {
  PRACTICE_STARTS,
  compareCopy,
  comparePractice,
  groupHelpful,
  sessionHeadline,
  splitExperiments,
  transferPrompt,
} from '../data/practiceStarts'
import { buildHistory, type HistoryEvent } from '../lib/history'
import { newId, nowIso, storage } from '../lib/memoryStorage'
import {
  buildInsight,
  hasPlanEvidence,
  suggestedFocus,
} from '../lib/patterns'
import { trackEvent } from '../lib/track'
import { getVideoUrl, saveVideoBlob } from '../lib/videoStore'
import { emptyDebriefFields, type DebriefFields } from '../types/debrief'
import type {
  ExperimentHelp,
  Focus,
  FocusArea,
  PracticeAttempt,
  PracticeSession,
  PracticeTestType,
} from '../types/memory'

type Phase =
  | 'pick'
  | 'custom'
  | 'path'
  | 'experiment'
  | 'previous'
  | 'shots'
  | 'after-baseline'
  | 'after-test'
  | 'debrief'
  | 'result'
type ShotStage = 'baseline' | 'test' | 'transfer'

export function PracticePage() {
  const recordRef = useRef<HTMLInputElement>(null)
  const libraryRef = useRef<HTMLInputElement>(null)
  const finishingRef = useRef(false)
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<HistoryEvent | null>(null)
  const [focus, setFocus] = useState<Focus | undefined>()
  const [phase, setPhase] = useState<Phase>('pick')
  const [shotStage, setShotStage] = useState<ShotStage>('baseline')
  const [baseline, setBaseline] = useState<string[]>([])
  const [testShots, setTestShots] = useState<string[]>([])
  const [transferShots, setTransferShots] = useState<string[]>([])
  const [experiment, setExperiment] = useState('')
  const [keptParts, setKeptParts] = useState<string[]>([])
  const [customLearn, setCustomLearn] = useState('')
  const [ideaMode, setIdeaMode] = useState(false)
  const [ideaPick, setIdeaPick] = useState('')
  const [saved, setSaved] = useState<PracticeSession | null>(null)
  const [fields, setFields] = useState<DebriefFields>(emptyDebriefFields())
  const [transcript, setTranscript] = useState('')
  const [felt, setFelt] = useState('')
  const [helped, setHelped] = useState<ExperimentHelp | undefined>()
  const [club, setClub] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)

  const testType: PracticeTestType = focus
    ? TEST_FOR_AREA[focus.area]
    : 'contact'
  const options = focus ? attemptOptions(focus.area) : attemptOptions('iron-contact')
  const success = focus ? successForArea(focus.area) : 'Clean'
  const start = focus ? PRACTICE_STARTS[focus.area] : PRACTICE_STARTS['iron-contact']
  const previous = useMemo(() => {
    if (!focus) return undefined
    return storage.getPracticeSessions(focus.id)[0]
  }, [focus])
  const compare = comparePractice(baseline, testShots, success)
  const transferCompare = comparePractice(testShots, transferShots, success)
  const compared = compare ? compareCopy(compare) : null
  const headline = sessionHeadline({
    test: compare,
    transfer: transferShots.length > 0 ? transferCompare : null,
  })
  const afterTest = transferPrompt(compare)
  const helpfulBefore = focus
    ? groupHelpful(storage.getAdjustments(focus.id)).some((item) => item.helpful > 0)
    : false

  const currentShots =
    shotStage === 'baseline'
      ? baseline
      : shotStage === 'test'
        ? testShots
        : transferShots

  function resetSession(next: Focus) {
    setFocus(next)
    setBaseline([])
    setTestShots([])
    setTransferShots([])
    setShotStage('baseline')
    setSaved(null)
    setTranscript('')
    setFelt('')
    setHelped(undefined)
    setClub('')
    setVideoUrl(null)
    setExperiment('')
    setKeptParts([])
    setIdeaMode(false)
    setIdeaPick('')
    setCustomLearn(next.area === 'custom' ? next.title : '')
    finishingRef.current = false
    setFields(emptyDebriefFields())
  }

  function chooseArea(area: FocusArea, fromPlan?: boolean) {
    const existing = storage.getFocuses().find((item) => item.area === area)
    const next: Focus = existing
      ? { ...existing, title: existing.title || area, status: 'active' }
      : {
          id: newId(),
          title: areaLabel(area),
          area,
          createdAt: nowIso(),
          status: 'active',
        }
    storage.saveFocus(next)
    resetSession(next)
    setPhase(area === 'custom' ? 'custom' : 'path')
    trackEvent(existing ? 'focus_carried_forward' : 'focus_created')
    trackEvent('practice_started')
    if (fromPlan) trackEvent('plan_followed')
  }

  function countLine(shots: string[]) {
    return practiceResultLine(
      shots.filter((item) => item === success).length,
      shots.length,
      success,
    )
  }

  function setTried(value: string) {
    setExperiment(value)
    setFields((current) => ({ ...current, tried: value }))
  }

  function beginBaseline() {
    setShotStage('baseline')
    setPhase('shots')
    trackEvent('baseline_started')
  }

  function beginTest() {
    setTestShots([])
    setTransferShots([])
    setShotStage('test')
    setPhase('shots')
  }

  function choosePath(path: StartPath) {
    if (path === 'basic') beginBaseline()
    if (path === 'mine') setPhase('experiment')
    if (path === 'previous') setPhase('previous')
  }

  function confirmExperiment() {
    const tried = experiment.trim()
    if (!tried) return
    setTried(tried)
    setIdeaMode(false)
    trackEvent('experiment_started')
    if (baseline.length > 0) {
      beginTest()
      return
    }
    beginBaseline()
  }

  function finishTest() {
    if (!focus || finishingRef.current) return
    const used =
      transferShots.length > 0
        ? transferShots
        : testShots.length > 0
          ? testShots
          : baseline
    if (used.length === 0) return
    finishingRef.current = true
    const tried = (fields.tried.trim() || experiment.trim()) || undefined
    const baselineLine =
      baseline.length > 0 ? countLine(baseline) : undefined
    const testLine = testShots.length > 0 ? countLine(testShots) : undefined
    const transferLine =
      transferShots.length > 0 ? countLine(transferShots) : undefined
    const successCount = used.filter((item) => item === success).length
    const session: PracticeSession = {
      id: newId(),
      focusId: focus.id,
      date: nowIso(),
      club: club.trim() || undefined,
      testType,
      successCriteria: `${success} out of ${used.length}`,
      result: testLine || baselineLine || countLine(used),
      successCount,
      attemptCount: used.length,
      previousResult: previous?.result,
      feltDifferent: felt || undefined,
      notes:
        fields.remember.trim() ||
        fields.worked.trim() ||
        fields.didNotWork.trim() ||
        undefined,
      watchNext: fields.workingOn.trim() || undefined,
      transcript: transcript.trim() || undefined,
      whatWasTried: tried,
      baselineResult: baselineLine,
      baselineSuccessCount: baseline.filter((item) => item === success).length,
      baselineAttemptCount: baseline.length || undefined,
      testResult: testLine,
      transferResult: transferLine,
      experimentHelped: helped,
    }
    const rows: PracticeAttempt[] = [
      ...baseline.map((result, index) => ({
        id: newId(),
        practiceSessionId: session.id,
        sequence: index + 1,
        result,
        note: 'baseline',
      })),
      ...testShots.map((result, index) => ({
        id: newId(),
        practiceSessionId: session.id,
        sequence: baseline.length + index + 1,
        result,
        note: 'test',
      })),
      ...transferShots.map((result, index) => ({
        id: newId(),
        practiceSessionId: session.id,
        sequence: baseline.length + testShots.length + index + 1,
        result,
        note: 'transfer',
      })),
    ]
    storage.savePracticeSession(session)
    storage.saveAttempts(rows)
    if (fields.workingOn.trim() || fields.remember.trim() || tried) {
      storage.saveFocus({
        ...focus,
        reason: fields.workingOn.trim() || tried || fields.remember.trim(),
      })
    }
    if (tried) {
      storage.saveAdjustment({
        id: newId(),
        focusId: focus.id,
        createdAt: nowIso(),
        whatITried: tried,
        source: 'practice',
        ...(helped === 'yes' || helped === 'somewhat'
          ? { workedAt: nowIso() }
          : {}),
      })
      trackEvent('adjustment_created')
      if (helped === 'yes' || helped === 'somewhat') {
        trackEvent('adjustment_marked_worked')
      }
    }
    setSaved(session)
    setPhase('result')
    trackEvent('practice_completed')
    trackEvent('debrief_saved')
  }

  function goDebrief() {
    trackEvent('debrief_started')
    setPhase('debrief')
  }

  function tapResult(result: string) {
    const cap = DEFAULT_ATTEMPTS
    if (shotStage === 'baseline' && baseline.length < cap) {
      const next = [...baseline, result]
      setBaseline(next)
      if (next.length >= cap) {
        trackEvent('baseline_completed')
        setPhase('after-baseline')
      }
      return
    }
    if (shotStage === 'test' && testShots.length < cap) {
      const next = [...testShots, result]
      setTestShots(next)
      if (next.length >= cap) setPhase('after-test')
      return
    }
    if (shotStage === 'transfer' && transferShots.length < cap) {
      const next = [...transferShots, result]
      setTransferShots(next)
      if (next.length >= cap) goDebrief()
    }
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
    const rounds = storage.getRounds()
    const sessions = storage.getPracticeSessions()
    const focuses = storage.getFocuses()
    const insights = focuses.map((item) =>
      buildInsight(
        item,
        rounds,
        storage.getPracticeSessions(item.id),
        storage.getCourseObservations(item.id),
      ),
    )
    const suggested = hasPlanEvidence(sessions, rounds)
      ? suggestedFocus(focuses, insights, sessions[0])
      : undefined

    return (
      <section className="page rr-page">
        <p className="rr-kicker">Practice</p>
        <h1>Choose what to practice</h1>
        <p className="muted">
          You do not need a swing fix first. Pick one thing. Then choose how to
          start.
        </p>
        {suggested ? (
          <p className="muted">
            Today's plan is {suggested.title}. Pick it, or choose something else.
          </p>
        ) : null}
        <div className="rr-cats rr-cats--stack">
          {FOCUS_AREAS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                suggested?.area === item.value ? 'rr-cat rr-cat--on' : 'rr-cat'
              }
              onClick={() => {
                if (suggested && item.value !== suggested.area) {
                  trackEvent('plan_overridden')
                }
                chooseArea(item.value, suggested?.area === item.value)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        {sessions.length > 0 ? (
          <>
            <p className="rr-kicker">Recent practice</p>
            <p className="muted">
              Dates on each session. Grouped by focus when there is more than one.
            </p>
            <HistoryList
              events={buildHistory(
                [],
                sessions,
                [],
                (id) => focuses.find((row) => row.id === id)?.title ?? 'Focus',
              )}
              onDelete={setPending}
            />
          </>
        ) : null}
        {pending ? (
          <ConfirmSheet
            title="Delete this practice?"
            body="This practice session will be removed from this phone. This cannot be undone."
            confirmLabel="Delete practice"
            onConfirm={() => {
              storage.deletePracticeSession(pending.sourceId)
              setPending(null)
              setTick((value) => value + 1)
            }}
            onCancel={() => setPending(null)}
          />
        ) : null}
      </section>
    )
  }

  if (phase === 'custom' && focus) {
    return (
      <section className="page rr-page">
        <p className="rr-kicker">Other</p>
        <h1>What are you trying to learn?</h1>
        <p className="muted">
          No predefined mechanic. Name it in your words. ShotPlan will not invent
          an instruction.
        </p>
        <textarea
          id="custom-learn"
          className="rr-note"
          value={customLearn}
          onChange={(event) => setCustomLearn(event.target.value)}
          placeholder="What you want to observe"
        />
        <VoiceNoteButton
          value={customLearn}
          onChange={setCustomLearn}
          label="Talk to ShotPlan"
        />
        <div className="rr-actions">
          <Button
            variant="primary"
            block
            className="ready-cta__btn"
            disabled={!customLearn.trim()}
            onClick={() => {
              const next = {
                ...focus,
                title: customLearn.trim(),
                reason: customLearn.trim(),
              }
              storage.saveFocus(next)
              setFocus(next)
              setPhase('path')
            }}
          >
            Continue
          </Button>
          <button type="button" className="rr-text-link" onClick={() => setPhase('pick')}>
            Work on something else
          </button>
        </div>
      </section>
    )
  }

  if (phase === 'path' && focus) {
    return (
      <HowToStart
        title={focus.title}
        hasHistory={helpfulBefore}
        onChoose={choosePath}
        onBack={() => setPhase('pick')}
      />
    )
  }

  if (phase === 'experiment' && focus) {
    return (
      <ExperimentInput
        title={focus.title}
        prompt="What do you want to test?"
        value={experiment}
        parts={keptParts}
        onChange={(value) => {
          setKeptParts([])
          setTried(value)
        }}
        onKeepAll={() => {
          setKeptParts(splitExperiments(experiment))
          confirmExperiment()
        }}
        onChooseOne={(value) => {
          setKeptParts([])
          setTried(value)
          setIdeaMode(false)
          trackEvent('experiment_started')
          if (baseline.length > 0) beginTest()
          else beginBaseline()
        }}
        onContinue={confirmExperiment}
        onBack={() => setPhase(baseline.length > 0 ? 'after-baseline' : 'path')}
      />
    )
  }

  if (phase === 'previous' && focus) {
    return (
      <PreviousHelpful
        title={focus.title}
        adjustments={storage.getAdjustments(focus.id)}
        onPick={(value) => {
          setTried(value)
          setIdeaMode(false)
          trackEvent('experiment_started')
          if (baseline.length > 0) beginTest()
          else beginBaseline()
        }}
        onBack={() => setPhase(baseline.length > 0 ? 'after-baseline' : 'path')}
      />
    )
  }

  if (phase === 'after-baseline' && focus) {
    if (experiment.trim()) {
      return (
        <section className="page rr-page">
          <p className="rr-kicker">{focus.title}</p>
          <h1>Baseline saved</h1>
          <p>Baseline: {countLine(baseline)}</p>
          <p className="sp-subhead">Now test: {experiment.trim()}</p>
          <div className="rr-actions">
            <Button variant="primary" block className="ready-cta__btn" onClick={beginTest}>
              Test the experiment
            </Button>
          </div>
        </section>
      )
    }
    return (
      <section className="page rr-page">
        <p className="rr-kicker">{focus.title}</p>
        <h1>What next?</h1>
        <p>Baseline: {countLine(baseline)}</p>
        <div className="sp-start">
          <button
            type="button"
            className="sp-start__btn"
            onClick={() => {
              setPhase('experiment')
            }}
          >
            <span className="sp-start__title">I have something to try</span>
            <span className="sp-start__desc">
              Test a feel, tip, drill, or change you already know.
            </span>
          </button>
          <button
            type="button"
            className="sp-start__btn"
            disabled={!helpfulBefore}
            onClick={() => {
              if (!helpfulBefore) return
              setPhase('previous')
            }}
          >
            <span className="sp-start__title">Use something that worked before</span>
            <span className="sp-start__desc">
              {helpfulBefore
                ? 'Retest something from your ShotPlan history.'
                : 'Nothing saved here yet.'}
            </span>
          </button>
          <button
            type="button"
            className="sp-start__btn"
            onClick={() => {
              setIdeaMode(true)
              setIdeaPick('')
              setShotStage('test')
              setPhase('shots')
            }}
          >
            <span className="sp-start__title">Give me a basic practice idea</span>
            <span className="sp-start__desc">
              Try one simple way to practice this skill.
            </span>
          </button>
          <button type="button" className="sp-start__btn" onClick={goDebrief}>
            <span className="sp-start__title">Finish for now</span>
            <span className="sp-start__desc">
              Save the baseline and come back later.
            </span>
          </button>
        </div>
      </section>
    )
  }

  if (phase === 'after-test' && focus) {
    const transferBtn = (
      <Button
        variant={afterTest.primary === 'transfer' ? 'primary' : 'secondary'}
        block
        className={afterTest.primary === 'transfer' ? 'ready-cta__btn' : undefined}
        onClick={() => {
          setShotStage('transfer')
          setPhase('shots')
        }}
      >
        Transfer test
      </Button>
    )
    const finishBtn = (
      <Button
        variant={afterTest.primary === 'finish' ? 'primary' : 'secondary'}
        block
        className={afterTest.primary === 'finish' ? 'ready-cta__btn' : undefined}
        onClick={goDebrief}
      >
        Finish session
      </Button>
    )
    return (
      <section className="page rr-page">
        <p className="rr-kicker">{focus.title}</p>
        <h1>{afterTest.title}</h1>
        {experiment.trim() ? <p>Your experiment: {experiment.trim()}</p> : null}
        {baseline.length > 0 ? (
          <p className="muted">Baseline {countLine(baseline)}</p>
        ) : null}
        <p>Test result: {countLine(testShots)}</p>
        {compared ? (
          <>
            <p className="sp-subhead">{compared.title}</p>
            <p className="muted">{compared.body}</p>
          </>
        ) : null}
        {ideaMode && (compare === 'same' || compare === 'worse') ? (
          <p className="muted">
            Save what happened. If you have a feel, lesson, or adjustment you
            trust, you can test it next.
          </p>
        ) : (
          <p className="muted">{afterTest.body}</p>
        )}
        <div className="rr-actions">
          {ideaMode && (compare === 'same' || compare === 'worse') ? (
            <>
              {finishBtn}
              <Button
                variant="secondary"
                block
                onClick={() => {
                  setPhase('experiment')
                }}
              >
                I have something to try
              </Button>
            </>
          ) : afterTest.primary === 'finish' ? (
            <>
              {finishBtn}
              {transferBtn}
            </>
          ) : (
            <>
              {transferBtn}
              {finishBtn}
            </>
          )}
        </div>
      </section>
    )
  }

  if (phase === 'debrief' && focus) {
    return (
      <PracticeDebrief
        focusTitle={focus.title}
        experiment={
          ideaMode ? undefined : experiment.trim() || fields.tried.trim() || undefined
        }
        baselineLine={baseline.length ? countLine(baseline) : undefined}
        testLine={testShots.length ? countLine(testShots) : undefined}
        transferLine={transferShots.length ? countLine(transferShots) : undefined}
        headline={headline}
        ideaTitle={
          ideaMode
            ? [start.ideaTitle, ideaPick].filter(Boolean).join(' · ')
            : undefined
        }
        fields={fields}
        transcript={transcript}
        club={club}
        experimentHelped={helped}
        onFields={setFields}
        onTranscript={setTranscript}
        onClub={setClub}
        onHelped={setHelped}
        onSave={finishTest}
      />
    )
  }

  if (phase === 'result' && saved) {
    return (
      <section className="page rr-page">
        <p className="rr-kicker">{focus?.title}</p>
        <h1>Saved</h1>
        {saved.whatWasTried ? (
          <p>What you tried: {saved.whatWasTried}</p>
        ) : null}
        {saved.baselineResult ? (
          <p className="muted">Baseline {saved.baselineResult}</p>
        ) : null}
        {saved.testResult ? <p>Test {saved.testResult}</p> : null}
        {saved.transferResult ? (
          <p className="muted">Transfer {saved.transferResult}</p>
        ) : null}
        {compared ? (
          <>
            <p className="sp-subhead">{headline}</p>
            <p className="muted">{compared.body}</p>
          </>
        ) : saved.experimentHelped ? (
          <p className="muted">
            Observed result saved separately from how it felt.
          </p>
        ) : (
          <p className="muted">Saved. Not enough to call it a lasting change.</p>
        )}
        {saved.notes ? <p>{saved.notes}</p> : null}

        <div className="sp-swing">
          <p className="rr-prompt rr-prompt--quiet">Swing clip (optional)</p>
          <p className="muted">
            Visual memory on this phone. ShotPlan does not analyze your swing.
          </p>
          <input
            ref={recordRef}
            type="file"
            accept="video/*"
            capture="environment"
            className="sp-file"
            onChange={(event) => {
              void onVideo(event.target.files?.[0])
              event.target.value = ''
            }}
          />
          <input
            ref={libraryRef}
            type="file"
            accept="video/*"
            className="sp-file"
            onChange={(event) => {
              void onVideo(event.target.files?.[0])
              event.target.value = ''
            }}
          />
          <Button
            variant="secondary"
            block
            onClick={() => recordRef.current?.click()}
          >
            {videoUrl ? 'Replace with video' : 'Take video'}
          </Button>
          <Button
            variant="secondary"
            block
            onClick={() => libraryRef.current?.click()}
          >
            {videoUrl ? 'Replace from library' : 'Photo library'}
          </Button>
          {videoError ? <p className="muted">{videoError}</p> : null}
          {videoUrl ? (
            <video className="sp-video" src={videoUrl} controls playsInline />
          ) : null}
        </div>

        <div className="rr-actions">
          <Button variant="primary" block to="/play">
            Play 9 or 18 holes
          </Button>
          <Button
            variant="secondary"
            block
            onClick={() => {
              if (focus) resetSession(focus)
              setPhase('path')
              trackEvent('practice_started')
            }}
          >
            Practice again
          </Button>
        </div>
      </section>
    )
  }

  const stageCopy =
    shotStage === 'baseline'
      ? experiment.trim()
        ? {
            kicker: 'Start with a baseline',
            title: experiment.trim(),
            hint: 'Hit 5 normal shots first so you have something to compare against.',
            chose: true,
          }
        : {
            kicker: 'Start with a baseline',
            title: start.baseline,
            hint: start.support,
            chose: false,
          }
      : shotStage === 'test' && ideaMode
        ? {
            kicker: 'Basic practice idea',
            title: start.ideaTitle,
            hint: start.ideaCopy,
            chose: false,
          }
        : shotStage === 'test'
          ? {
              kicker: 'Test the experiment',
              title: experiment.trim()
                ? `Now test: ${experiment.trim()}`
                : start.optionalTest,
              hint: 'Test one thing. The goal is to learn whether it helps, not to prove it.',
              chose: false,
            }
          : {
              kicker: afterTest.title,
              title:
                'Use changing targets, your normal pre-shot routine, and less conscious mechanical thought.',
              hint: `${DEFAULT_ATTEMPTS} shots. Additional evidence, not scientific proof.`,
              chose: false,
            }

  const showIdeaPicks =
    Boolean(start.ideaPicks?.length) &&
    ideaMode &&
    (shotStage === 'test' || shotStage === 'transfer')

  return (
    <section className="page rr-page">
      <p className="rr-kicker">{focus?.title}</p>
      <h1>{stageCopy.kicker}</h1>
      {stageCopy.chose ? (
        <div className="sp-hold">
          <p className="rr-kicker">You chose</p>
          <p className="sp-subhead">{stageCopy.title}</p>
          <p className="sp-hold__warn">Don't use it yet.</p>
          <p>{stageCopy.hint}</p>
        </div>
      ) : (
        <>
          <p className="sp-subhead">{stageCopy.title}</p>
          <p className="muted">{stageCopy.hint}</p>
        </>
      )}
      {shotStage === 'baseline' && !experiment.trim() ? (
        <p className="muted">{start.explanation}</p>
      ) : null}
      {experiment.trim() && shotStage !== 'baseline' ? (
        <p>Your experiment: {experiment.trim()}</p>
      ) : null}
      {showIdeaPicks ? (
        <div className="sp-plan-block">
          {start.ideaPickHint ? (
            <p className="muted">{start.ideaPickHint}</p>
          ) : null}
          <div className="rr-cats">
            {start.ideaPicks?.map((pick) => (
              <button
                key={pick}
                type="button"
                className={ideaPick === pick ? 'rr-cat rr-cat--on' : 'rr-cat'}
                onClick={() => setIdeaPick(pick)}
              >
                {pick}
              </button>
            ))}
          </div>
          {ideaPick ? <p>Using: {ideaPick}</p> : null}
        </div>
      ) : null}
      {baseline.length > 0 ? (
        <p className="muted">Baseline {countLine(baseline)}</p>
      ) : null}
      {testShots.length > 0 && shotStage === 'transfer' ? (
        <p className="muted">Test {countLine(testShots)}</p>
      ) : null}
      <p className="sp-play__count">
        {currentShots.filter((item) => item === success).length} /{' '}
        {currentShots.length} {success.toLowerCase()}
      </p>
      <div
        className={
          options.length === 3 ? 'rr-cats rr-cats--three' : 'rr-cats rr-cats--stack'
        }
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="rr-cat"
            disabled={currentShots.length >= DEFAULT_ATTEMPTS}
            onClick={() => tapResult(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {currentShots.length > 0 ? (
        <p className="muted">{currentShots.join(' · ')}</p>
      ) : null}

      <div className="rr-actions">
        {currentShots.length > 0 ? (
          <Button
            variant="primary"
            block
            className="ready-cta__btn"
            onClick={() => {
              if (shotStage === 'baseline') {
                setPhase('after-baseline')
                return
              }
              if (shotStage === 'test') {
                setPhase('after-test')
                return
              }
              goDebrief()
            }}
          >
            {shotStage === 'baseline'
              ? 'Save baseline'
              : shotStage === 'test'
                ? 'Save test'
                : 'Debrief'}
          </Button>
        ) : null}
        {shotStage === 'transfer' ? (
          <button type="button" className="rr-text-link" onClick={goDebrief}>
            Finish session
          </button>
        ) : null}
        <button
          type="button"
          className="rr-text-link"
          onClick={() => setPhase('path')}
        >
          Work on something else
        </button>
      </div>
    </section>
  )
}
