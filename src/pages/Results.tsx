import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DrillCard } from '../components/DrillCard'
import { FlowProgress } from '../components/FlowProgress'
import { FollowUp } from '../components/FollowUp'
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
      <section className="page results">
        <Link to="/check-in" className="back-link">
          ← Check in
        </Link>
        <h1>Today’s Practice</h1>
        <p className="muted">No symptoms selected yet.</p>
        <Link to="/check-in" className="btn btn--primary btn--block">
          Start check in
        </Link>
      </section>
    )
  }

  if (sessionId && !session) {
    return (
      <section className="page results">
        <Link to="/" className="back-link">
          ← Home
        </Link>
        <h1>Session not found</h1>
        <p className="muted">That practice plan is no longer saved on this device.</p>
        <Link to="/check-in" className="btn btn--primary btn--block">
          Start a new check in
        </Link>
      </section>
    )
  }

  return (
    <section className="page results">
      <Link to={session ? '/sessions' : '/check-in'} className="back-link">
        {session ? '← Sessions' : '← Check in'}
      </Link>

      <FlowProgress step={followUpDone ? 3 : 2} />

      <header className="prescription-header">
        <p className="prescription-kicker">Practice prescription</p>
        <h1>Today’s Practice</h1>
      </header>

      <dl className="prescription-meta">
        <div>
          <dt>Goal</dt>
          <dd>{prescription.goal}</dd>
        </div>
        <div>
          <dt>Estimated time</dt>
          <dd>{prescription.estimatedTime}</dd>
        </div>
      </dl>

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

      <aside className="remember-card" aria-label="One thing to remember">
        <p className="remember-card__label">One Thing to Remember</p>
        <p className="remember-card__thought">{prescription.remember}</p>
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
