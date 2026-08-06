import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { DrillCard } from '../components/DrillCard'
import { FlowProgress } from '../components/FlowProgress'
import { FollowUp } from '../components/FollowUp'
import {
  PracticeChecklist,
  PracticeComplete,
} from '../components/PracticeChecklist'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  buildChecklist,
  buildPracticeOrder,
  buildPrescription,
  getDrillById,
  getDrillsForSymptoms,
} from '../data/drills'
import { isSymptomId } from '../data/symptoms'
import { getSession, updateSession } from '../lib/storage'
import type { Drill, Session, SymptomId } from '../types'

type Phase = 'plan' | 'practice' | 'done' | 'followup'

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

  const [checked, setChecked] = useState<Record<string, boolean>>(
    () => session?.checklist ?? {},
  )

  useEffect(() => {
    const next = sessionId ? getSession(sessionId) : undefined
    setSession(next)
    setChecked(next?.checklist ?? {})
    setPhase(next?.practiceDone ? 'done' : 'plan')
  }, [sessionId])

  const symptomIds = session?.symptomIds ?? symptomParamIds
  const recommended = session
    ? drillsForSession(session)
    : getDrillsForSymptoms(symptomIds)
  const prescription = buildPrescription(symptomIds, recommended)
  const practiceOrder = useMemo(
    () => buildPracticeOrder(recommended),
    [recommended],
  )
  const checklist = useMemo(() => buildChecklist(recommended), [recommended])
  const followUpDone = session?.result !== null && session?.result !== undefined

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
    <section className="page results animate-in">
      <BackLink to={session ? '/sessions' : '/check-in'}>
        {session ? 'Sessions' : 'Check in'}
      </BackLink>

      <FlowProgress step={2} />

      <Card className="summary-card" tone="default">
        <p className="summary-card__kicker">Today’s Practice</p>
        <dl className="summary-card__meta">
          <div>
            <dt>Estimated time</dt>
            <dd>{prescription.estimatedTime}</dd>
          </div>
          <div>
            <dt>Today’s goal</dt>
            <dd>{prescription.goal}</dd>
          </div>
          <div>
            <dt>Primary focus</dt>
            <dd>{prescription.primaryFocus}</dd>
          </div>
        </dl>
      </Card>

      <aside className="confidence-banner" aria-label="Recommendation note">
        <ShieldCheck size={20} strokeWidth={2} aria-hidden="true" />
        <div>
          <p className="confidence-banner__title">Recommended Practice Plan</p>
          <p className="confidence-banner__text">
            Based on the symptoms you selected and established golf instruction.
          </p>
        </div>
      </aside>

      <Card className="practice-order" padding="lg">
        <h2 className="practice-order__title">Practice Order</h2>
        <ol className="practice-order__list">
          {practiceOrder.map((step) => (
            <li key={`${step.number}-${step.title}`}>
              <span className="practice-order__num">{step.number}</span>
              <span>
                <span className="practice-order__step-title">{step.title}</span>
                <span className="practice-order__step-detail muted">
                  {step.detail}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="todays-plan">
        <h2 className="todays-plan__title">Your drills</h2>
        <p className="todays-plan__count muted">
          Read each card once. Then tap Ready to Practice.
        </p>

        <div className="drill-list">
          {recommended.map((drill, index) => (
            <DrillCard key={drill.id} drill={drill} index={index + 1} />
          ))}
        </div>
      </div>

      <aside className="swing-thought" aria-label="Today's swing thought">
        <p className="swing-thought__label">Today’s Swing Thought</p>
        <p className="swing-thought__cue">{prescription.remember}</p>
      </aside>

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
          Opens a simple checklist for the range.
        </p>
      </div>
    </section>
  )
}
