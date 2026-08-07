import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { DrillFocus } from '../components/DrillFocus'
import { FlowProgress } from '../components/FlowProgress'
import { FollowUp } from '../components/FollowUp'
import {
  PracticeChecklist,
  PracticeComplete,
} from '../components/PracticeChecklist'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatClubFocusLabel } from '../data/clubFocus'
import {
  buildChecklist,
  buildPracticeOrder,
  buildPrescription,
  getDrillById,
  getDrillsForSymptoms,
} from '../data/drills'
import { isSymptomId } from '../data/symptoms'
import { adaptDrills } from '../lib/adaptDrill'
import { applySessionChallenges } from '../lib/sessionPractice'
import { getSession, updateSession } from '../lib/storage'
import type { Drill, Session, SymptomId } from '../types'

type Phase = 'plan' | 'drill' | 'practice' | 'done' | 'followup'

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
    session?.practiceDone ? 'done' : 'plan',
  )
  const [drillIndex, setDrillIndex] = useState(0)
  const [drillReturnPhase, setDrillReturnPhase] = useState<'plan' | 'practice'>(
    'plan',
  )

  const [checked, setChecked] = useState<Record<string, boolean>>(
    () => session?.checklist ?? {},
  )

  useEffect(() => {
    const next = sessionId ? getSession(sessionId) : undefined
    setSession(next)
    setChecked(next?.checklist ?? {})
    setPhase(next?.practiceDone ? 'done' : 'plan')
    setDrillIndex(0)
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
  const practiceOrder = useMemo(
    () => buildPracticeOrder(recommended),
    [recommended],
  )
  const checklist = useMemo(() => buildChecklist(recommended), [recommended])
  const followUpDone = session?.result !== null && session?.result !== undefined
  const clubSummary = clubFocusSummary(session)
  const challengeCount = recommended.length
  const accomplishment = recommended[0]?.templateLabel
    ? `You worked on ${recommended
        .map((d) => d.templateLabel)
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .slice(0, 2)
        .join(' and ')}.`
    : 'You finished your practice plan.'

  function persistChecklist(next: Record<string, boolean>) {
    setChecked(next)
    if (!session) return
    const updated = updateSession(session.id, { checklist: next })
    if (updated) setSession(updated)
  }

  function toggleCheck(id: string) {
    persistChecklist({ ...checked, [id]: !checked[id] })
  }

  function finishPractice() {
    if (session) {
      const updated = updateSession(session.id, {
        practiceDone: true,
        checklist: checked,
      })
      if (updated) setSession(updated)
    }
    setPhase('done')
  }

  function openDrill(index: number, returnTo: 'plan' | 'practice' = 'plan') {
    setDrillIndex(index)
    setDrillReturnPhase(returnTo)
    setPhase('drill')
  }

  if (symptomIds.length === 0) {
    return (
      <section className="page results animate-in">
        <BackLink to="/check-in">Check in</BackLink>
        <h1>Today’s Practice</h1>
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

  if (phase === 'drill') {
    return (
      <section className="page results">
        <DrillFocus
          drills={recommended}
          index={drillIndex}
          onIndexChange={setDrillIndex}
          onExit={() => setPhase(drillReturnPhase)}
          onFinishedAll={() => setPhase('practice')}
          exitLabel={
            drillReturnPhase === 'practice' ? 'Back to checklist' : 'Back to plan'
          }
        />
      </section>
    )
  }

  if (phase === 'practice') {
    return (
      <section className="page results">
        <PracticeChecklist
          items={checklist}
          checked={checked}
          onToggle={toggleCheck}
          onFinish={finishPractice}
          onBack={() => setPhase('plan')}
          swingThought={prescription.remember}
          onOpenDrill={(drillId) => {
            const index = recommended.findIndex((d) => d.id === drillId)
            if (index >= 0) openDrill(index, 'practice')
          }}
        />
      </section>
    )
  }

  if (phase === 'done') {
    return (
      <section className="page results animate-in">
        <BackLink to="/">Home</BackLink>
        <FlowProgress step={3} />
        <PracticeComplete
          showFollowUp={Boolean(session) && !followUpDone}
          onHome={() => navigate('/')}
          onFollowUp={() => setPhase('followup')}
          challengeCount={challengeCount}
          accomplishment={accomplishment}
        />
      </section>
    )
  }

  if (phase === 'followup' && session) {
    return (
      <section className="page results animate-in">
        <BackLink to="/sessions">Sessions</BackLink>
        <FlowProgress step={3} />
        <FollowUp
          key={session.id}
          session={session}
          onUpdate={setSession}
        />
      </section>
    )
  }

  return (
    <section className="page results results--plan animate-in">
      <BackLink to={session ? '/sessions' : '/check-in'}>
        {session ? 'Sessions' : 'Check in'}
      </BackLink>

      <FlowProgress step={2} />

      <Card className="summary-card" tone="default">
        <p className="summary-card__kicker">Today’s Practice</p>
        <dl className="summary-card__meta">
          <div>
            <dt>Estimated Time</dt>
            <dd>{prescription.estimatedTime}</dd>
          </div>
          <div>
            <dt>Today’s Goal</dt>
            <dd>{prescription.goal}</dd>
          </div>
          <div>
            <dt>Primary Focus</dt>
            <dd>
              {prescription.primaryFocus}
              {clubSummary ? ` · ${clubSummary}` : ''}
            </dd>
          </div>
        </dl>
      </Card>

      <aside className="confidence-banner" aria-label="Recommendation note">
        <ShieldCheck size={20} strokeWidth={2} aria-hidden="true" />
        <div>
          <p className="confidence-banner__title">Your coaching session is ready</p>
          <p className="confidence-banner__text">
            {clubSummary
              ? `Built for your ${clubSummary.toLowerCase()} focus. Complete each challenge, then move on.`
              : 'Complete each challenge. Clear goals beat endless reps.'}
          </p>
        </div>
      </aside>

      <div className="practice-order">
        <h2 className="practice-order__title">Practice Order</h2>
        <ol className="practice-order__list">
          {practiceOrder.map((step) => (
            <li key={`${step.number}-${step.title}`}>
              <span className="practice-order__num" aria-hidden="true">
                {step.number}
              </span>
              <span>
                <span className="practice-order__step-title">{step.title}</span>
                <span className="practice-order__step-detail muted">
                  {step.detail}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <aside className="swing-thought" aria-label="Today's swing thought">
        <p className="swing-thought__label">Today’s Swing Thought</p>
        <p className="swing-thought__cue">{prescription.remember}</p>
      </aside>

      <div className="drill-picker">
        <h2 className="drill-picker__title">Drill setups</h2>
        <p className="muted drill-picker__hint">
          Tap a challenge anytime to see the setup, objective, and success condition.
        </p>
        <ul className="drill-picker__list">
          {recommended.map((drill, index) => (
            <li key={drill.id}>
              <button
                type="button"
                className="drill-picker__item"
                onClick={() => openDrill(index)}
              >
                <span className="drill-picker__num">{index + 1}</span>
                <span className="drill-picker__copy">
                  <span className="drill-picker__name">{drill.name}</span>
                  <span className="drill-picker__cue muted">
                    {drill.successCondition ?? drill.cue}
                  </span>
                </span>
                <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ready-cta">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={() => setPhase('practice')}
        >
          Ready to Practice
        </Button>
        <p className="ready-cta__hint muted">
          Opens a simple checklist so you always know what’s next.
        </p>
      </div>
    </section>
  )
}
