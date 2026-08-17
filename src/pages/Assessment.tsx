import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AssessmentBrief } from '../components/assessment/AssessmentBrief'
import { AssessmentIntro } from '../components/assessment/AssessmentIntro'
import { AssessmentLogSet } from '../components/assessment/AssessmentLogSet'
import type { LogEntry } from '../components/assessment/AssessmentLogSet'
import { AssessmentResults } from '../components/assessment/AssessmentResults'
import { BackLink } from '../components/ui/BackLink'
import {
  ASSESSMENT_TESTS,
  completeAssessment,
  createEmptyAssessment,
  QUICK_BASELINE_SHOTS_PER_TEST,
  showsOptionalMiss,
  withRecordedShot,
} from '../data/assessment'
import type { ResultOption } from '../data/assessment'
import { submitFeedback } from '../lib/feedback'
import {
  clearAssessmentDraft,
  getAssessmentDraft,
  getLatestAssessment,
  saveAssessmentDraft,
  saveCompletedAssessment,
  updateAssessment,
} from '../lib/assessmentStorage'
import type {
  Assessment,
  AssessmentDraft,
  AssessmentFeedback,
  AssessmentShot,
  MissType,
} from '../types/assessment'

type Phase = 'intro' | 'hit' | 'log' | 'results'

function emptyLog(): Array<LogEntry | null> {
  return Array.from({ length: QUICK_BASELINE_SHOTS_PER_TEST }, () => null)
}

function resumePhase(draft: AssessmentDraft): Phase {
  if (draft.pendingLog?.some((entry) => entry !== null)) return 'log'
  return 'hit'
}

export function AssessmentPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [latest, setLatest] = useState(() => getLatestAssessment())
  const [draft, setDraft] = useState<AssessmentDraft | null>(() => {
    const existing = getAssessmentDraft()
    if (existing) return existing
    if (new URLSearchParams(window.location.search).get('start') === '1') {
      const next: AssessmentDraft = {
        assessment: createEmptyAssessment(),
        testIndex: 0,
      }
      saveAssessmentDraft(next)
      return next
    }
    return null
  })
  const [phase, setPhase] = useState<Phase>(() => {
    const existing = getAssessmentDraft()
    if (existing) return resumePhase(existing)
    if (searchParams.get('start') === '1') return 'hit'
    if (getLatestAssessment()?.result) return 'results'
    return 'intro'
  })

  const testIndex = draft?.testIndex ?? 0
  const def = ASSESSMENT_TESTS[testIndex]
  const displayedResult = latest?.result ?? null
  const logEntries = draft?.pendingLog ?? emptyLog()
  const nextTest = ASSESSMENT_TESTS[testIndex + 1]
  const continueLabel = nextTest
    ? `Continue to ${nextTest.title}`
    : 'See my profile'

  function persist(next: AssessmentDraft) {
    saveAssessmentDraft(next)
    setDraft(next)
  }

  function startNew() {
    const next: AssessmentDraft = {
      assessment: createEmptyAssessment(),
      testIndex: 0,
    }
    persist(next)
    setPhase('hit')
  }

  function handleHitAll() {
    if (!draft) return
    persist({ ...draft, pendingLog: emptyLog() })
    setPhase('log')
  }

  function handleSelectResult(shotIndex: number, option: ResultOption) {
    if (!draft) return
    const nextLog = [...(draft.pendingLog ?? emptyLog())]
    const previous = nextLog[shotIndex]
    const keepMiss =
      previous?.missType && showsOptionalMiss(option.result)
        ? previous.missType
        : undefined
    nextLog[shotIndex] = {
      result: option.result,
      score: option.score,
      ...(keepMiss ? { missType: keepMiss } : {}),
    }
    persist({ ...draft, pendingLog: nextLog })
  }

  function handleSelectMiss(shotIndex: number, miss: MissType) {
    if (!draft) return
    const nextLog = [...(draft.pendingLog ?? emptyLog())]
    const current = nextLog[shotIndex]
    if (!current) return
    nextLog[shotIndex] = {
      ...current,
      missType: current.missType === miss ? undefined : miss,
    }
    persist({ ...draft, pendingLog: nextLog })
  }

  function handleContinue() {
    if (!draft || !def) return
    const entries = draft.pendingLog ?? []
    if (entries.some((entry) => entry === null || entry === undefined)) return

    const timestamp = new Date().toISOString()
    let tests = draft.assessment.tests
    entries.forEach((entry, index) => {
      if (!entry) return
      const shot: AssessmentShot = {
        id: crypto.randomUUID(),
        testId: def.id,
        shotNumber: index + 1,
        club: def.club,
        result: entry.result,
        score: entry.score,
        timestamp,
        ...(entry.missType ? { missType: entry.missType } : {}),
        ...(def.suggestedDistanceYards
          ? { distanceYards: def.suggestedDistanceYards }
          : {}),
      }
      tests = tests.map((test, testIdx) =>
        testIdx === testIndex ? withRecordedShot(test, shot) : test,
      )
    })

    const assessment: Assessment = { ...draft.assessment, tests }
    const nextIndex = testIndex + 1
    if (nextIndex < ASSESSMENT_TESTS.length) {
      persist({
        assessment,
        testIndex: nextIndex,
        pendingLog: undefined,
      })
      setPhase('hit')
      return
    }

    const completed = completeAssessment(assessment)
    saveCompletedAssessment(completed)
    clearAssessmentDraft()
    setDraft(null)
    setLatest(completed)
    setPhase('results')
  }

  const backLabel =
    phase === 'intro' || phase === 'results' ? 'Home' : 'Save & leave'

  return (
    <section className="page assess-page">
      <BackLink to="/">{backLabel}</BackLink>

      {phase === 'intro' ? (
        <AssessmentIntro
          latestScore={latest?.result?.overallScore}
          onStart={startNew}
          onViewLatest={
            latest?.result
              ? () => {
                  setPhase('results')
                }
              : undefined
          }
        />
      ) : null}

      {phase === 'hit' && def ? (
        <AssessmentBrief
          testNumber={testIndex + 1}
          totalTests={ASSESSMENT_TESTS.length}
          def={def}
          onHitAll={handleHitAll}
        />
      ) : null}

      {phase === 'log' && def ? (
        <AssessmentLogSet
          testNumber={testIndex + 1}
          totalTests={ASSESSMENT_TESTS.length}
          def={def}
          entries={logEntries}
          continueLabel={continueLabel}
          onSelectResult={handleSelectResult}
          onSelectMiss={handleSelectMiss}
          onContinue={handleContinue}
        />
      ) : null}

      {phase === 'results' && displayedResult && latest ? (
        <AssessmentResults
          result={displayedResult}
          feedback={latest.feedback}
          onFeedback={(patch) => {
            const next: AssessmentFeedback = {
              assessmentId: latest.id,
              timestamp: latest.feedback?.timestamp ?? new Date().toISOString(),
              profileAccuracy:
                patch.profileAccuracy ?? latest.feedback?.profileAccuracy,
              wouldChangePractice:
                patch.wouldChangePractice ?? latest.feedback?.wouldChangePractice,
            }
            const updated = updateAssessment(latest.id, { feedback: next })
            if (updated) setLatest(updated)
            void submitFeedback({
              id: `baseline-${latest.id}`,
              createdAt: next.timestamp,
              openedFrom: '/assessment',
              answers: {
                kind: 'quick-baseline',
                assessmentId: latest.id,
                profileAccuracy: next.profileAccuracy,
                wouldChangePractice: next.wouldChangePractice,
                overallScore: displayedResult.overallScore,
                strongest: displayedResult.strongest.label,
                opportunity: displayedResult.biggestOpportunity.label,
              },
            })
          }}
          onSave={() => navigate('/')}
          onRetake={startNew}
        />
      ) : null}

      {phase === 'results' && !displayedResult ? (
        <AssessmentIntro onStart={startNew} />
      ) : null}
    </section>
  )
}
