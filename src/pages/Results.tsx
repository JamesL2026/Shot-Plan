import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { DrillCard } from '../components/DrillCard'
import { FlowProgress } from '../components/FlowProgress'
import { FollowUp } from '../components/FollowUp'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  buildPrescription,
  getDrillById,
  getDrillsForSymptoms,
} from '../data/drills'
import { isSymptomId } from '../data/symptoms'
import { getSession } from '../lib/storage'
import type { Drill, Session, SymptomId } from '../types'

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
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const symptomParamIds = parseSymptomIds(searchParams.get('symptoms'))

  const [session, setSession] = useState<Session | undefined>(() =>
    sessionId ? getSession(sessionId) : undefined,
  )

  useEffect(() => {
    setSession(sessionId ? getSession(sessionId) : undefined)
  }, [sessionId])

  const symptomIds = session?.symptomIds ?? symptomParamIds
  const recommended = session
    ? drillsForSession(session)
    : getDrillsForSymptoms(symptomIds)
  const prescription = buildPrescription(symptomIds, recommended)
  const followUpDone = session?.result !== null && session?.result !== undefined

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

  return (
    <section className="page results animate-in">
      <BackLink to={session ? '/sessions' : '/check-in'}>
        {session ? 'Sessions' : 'Check in'}
      </BackLink>

      <FlowProgress step={followUpDone ? 3 : 2} />

      <Card className="summary-card" tone="default">
        <p className="summary-card__kicker">Today’s Practice</p>
        <dl className="summary-card__meta">
          <div>
            <dt>Goal</dt>
            <dd>{prescription.goal}</dd>
          </div>
          <div>
            <dt>Estimated time</dt>
            <dd>{prescription.estimatedTime}</dd>
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

      <div className="todays-plan">
        <h2 className="todays-plan__title">Today’s Plan</h2>
        <p className="todays-plan__count muted">
          {recommended.length} drill{recommended.length === 1 ? '' : 's'} · quality over
          quantity
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

      {session && (
        <div className="follow-up-wrap">
          {!followUpDone && <FlowProgress step={3} />}
          <FollowUp
            key={session.id}
            session={session}
            onUpdate={setSession}
          />
        </div>
      )}
    </section>
  )
}
