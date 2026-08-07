import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CoachBrief } from '../components/CoachBrief'
import { CoachTransition } from '../components/CoachTransition'
import { FollowUp } from '../components/FollowUp'
import { GuidedChallenge } from '../components/GuidedChallenge'
import { PracticeComplete } from '../components/PracticeChecklist'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { formatClubFocusLabel } from '../data/clubFocus'
import {
  coachBiggestWin,
  coachEncouragement,
  coachFocusLine,
  coachPrePracticeLines,
  coachPriority,
  coachTransition,
} from '../data/coachVoice'
import {
  buildPrescription,
  getDrillById,
  getDrillsForSymptoms,
} from '../data/drills'
import { getPrePracticeChecks } from '../data/prePractice'
import { isSymptomId } from '../data/symptoms'
import { adaptDrills } from '../lib/adaptDrill'
import { applySessionChallenges } from '../lib/sessionPractice'
import { getSession, updateSession } from '../lib/storage'
import type { Drill, Session, SymptomId } from '../types'

type Phase = 'brief' | 'pre' | 'challenge' | 'transition' | 'done' | 'followup'

function parseSymptomIds(raw: string | null): SymptomId[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(isSymptomId)
    .slice(0, 2)
}

function drillsForSession(session: Session): Drill[] {
  const fromIds = session.drillIds
    .map((id) => getDrillById(id))
    .filter((drill): drill is Drill => drill !== undefined)

  if (fromIds.length > 0) return fromIds
  return getDrillsForSymptoms(session.symptomIds)
}

function clubFocusSummary(session: Session | undefined): string | null {
  if (!session?.clubFocus) return null
  const parts = session.symptomIds
    .map((id) => formatClubFocusLabel(session.clubFocus?.[id]))
    .filter((label): label is string => Boolean(label))
  if (parts.length === 0) return null
  return [...new Set(parts)].join(' · ')
}

export function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const symptomParamIds = parseSymptomIds(searchParams.get('symptoms'))

  const [session, setSession] = useState<Session | undefined>(() =>
    sessionId ? getSession(sessionId) : undefined,
  )

  const [phase, setPhase] = useState<Phase>(() =>
    session?.practiceDone ? 'done' : 'brief',
  )
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const next = sessionId ? getSession(sessionId) : undefined
    setSession(next)
    setPhase(next?.practiceDone ? 'done' : 'brief')
    setChallengeIndex(0)
    setCompletedCount(0)
  }, [sessionId])

  const symptomIds = session?.symptomIds ?? symptomParamIds
  const sessionSeed = session?.id ?? (symptomIds.join('-') || 'shotplan')
  const recommended = useMemo(() => {
    const base = session
      ? drillsForSession(session)
      : getDrillsForSymptoms(symptomIds)
    const adapted = adaptDrills(base, session?.clubFocus)
    return applySessionChallenges(adapted, sessionSeed)
  }, [session, symptomIds, sessionSeed])
  const prescription = buildPrescription(symptomIds, recommended)
  const followUpDone = session?.result !== null && session?.result !== undefined
  const clubSummary = clubFocusSummary(session)
  const prePractice = useMemo(
    () => getPrePracticeChecks(symptomIds),
    [symptomIds],
  )
  const focusLine = coachFocusLine(prescription.primaryFocus, clubSummary)
  const encouragement = coachEncouragement(symptomIds, sessionSeed)
  const priority = coachPriority(symptomIds)
  const biggestWin = coachBiggestWin(recommended, prescription.remember)
  const currentDrill = recommended[challengeIndex]
  const nextDrill = recommended[challengeIndex + 1]
  const transitionCopy = currentDrill
    ? coachTransition(currentDrill, nextDrill, sessionSeed, challengeIndex)
    : null

  function markChallengeDone(drillId: string) {
    if (!session) return
    const checklist = {
      ...(session.checklist ?? {}),
      [`drill-${drillId}`]: true,
    }
    const updated = updateSession(session.id, { checklist })
    if (updated) setSession(updated)
  }

  function finishPractice() {
    if (session) {
      const updated = updateSession(session.id, {
        practiceDone: true,
        checklist: session.checklist,
      })
      if (updated) setSession(updated)
    }
    setPhase('done')
  }

  function handleStartPractice() {
    if (prePractice.length > 0) {
      setPhase('pre')
      return
    }
    setChallengeIndex(0)
    setPhase('challenge')
  }

  function handleChallengeComplete() {
    if (!currentDrill) return
    markChallengeDone(currentDrill.id)
    setCompletedCount((n) => Math.max(n, challengeIndex + 1))
    setPhase('transition')
  }

  function handleTransitionContinue() {
    if (challengeIndex >= recommended.length - 1) {
      finishPractice()
      return
    }
    setChallengeIndex((i) => i + 1)
    setPhase('challenge')
  }

  if (symptomIds.length === 0) {
    return (
      <section className="page results animate-in">
        <BackLink to="/check-in">Check in</BackLink>
        <h1>Today&apos;s Practice</h1>
        <p className="muted">No symptoms selected yet.</p>
        <Button to="/check-in" variant="primary" block>
          Start check in
        </Button>
      </section>
    )
  }

  if (sessionId && !session) {
    return (
      <section className="page results animate-in">
        <BackLink to="/">Home</BackLink>
        <h1>Session not found</h1>
        <p className="muted">That practice plan is no longer saved on this device.</p>
        <Button to="/check-in" variant="primary" block>
          Start a new check in
        </Button>
      </section>
    )
  }

  if (phase === 'brief') {
    return (
      <section className="page results results--brief">
        <CoachBrief
          focusLine={focusLine}
          estimatedTime={prescription.estimatedTime}
          swingThought={prescription.remember}
          encouragement={encouragement}
          priorityLines={priority?.lines}
          onStart={handleStartPractice}
          onBack={() => navigate(session ? '/sessions' : '/check-in')}
          backLabel={session ? 'Practice Journal' : 'Check in'}
        />
      </section>
    )
  }

  if (phase === 'pre' && prePractice[0]) {
    const check = prePractice[0]
    const copy = coachPrePracticeLines(check.title, check.body)
    return (
      <section className="page results">
        <CoachTransition
          headline={copy.headline}
          body={`${copy.body} ${check.timeNote}`}
          cta={copy.cta}
          onContinue={() => {
            setChallengeIndex(0)
            setPhase('challenge')
          }}
        />
      </section>
    )
  }

  if (phase === 'challenge' && currentDrill) {
    return (
      <section className="page results">
        <GuidedChallenge
          drill={currentDrill}
          challengeNumber={challengeIndex + 1}
          onComplete={handleChallengeComplete}
        />
      </section>
    )
  }

  if (phase === 'transition' && transitionCopy) {
    return (
      <section className="page results">
        <CoachTransition
          headline={transitionCopy.headline}
          body={transitionCopy.body}
          cta={transitionCopy.cta}
          onContinue={handleTransitionContinue}
        />
      </section>
    )
  }

  if (phase === 'done') {
    const finished = Math.max(
      completedCount,
      recommended.filter((d) => session?.checklist?.[`drill-${d.id}`]).length,
      session?.practiceDone ? recommended.length : 0,
    )
    return (
      <section className="page results animate-in">
        <BackLink to="/">Home</BackLink>
        <PracticeComplete
          showFollowUp={Boolean(session) && !followUpDone}
          onHome={() => navigate('/')}
          onFollowUp={() => setPhase('followup')}
          challengeCount={recommended.length}
          drillsFinished={finished}
          drillsTotal={recommended.length}
          todayGoal={prescription.primaryFocus}
          swingThought={prescription.remember}
          biggestWin={biggestWin}
        />
      </section>
    )
  }

  if (phase === 'followup' && session) {
    return (
      <section className="page results animate-in">
        <BackLink to="/sessions">Practice Journal</BackLink>
        <FollowUp
          key={session.id}
          session={session}
          onUpdate={setSession}
        />
      </section>
    )
  }

  return (
    <section className="page results animate-in">
      <BackLink to="/">Home</BackLink>
      <p className="muted">Loading your session…</p>
    </section>
  )
}
