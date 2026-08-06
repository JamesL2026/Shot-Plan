import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DrillCard } from '../components/DrillCard'
import { FollowUp } from '../components/FollowUp'
import {
  buildPlanSummary,
  getDrillById,
  getDrillsForSymptoms,
} from '../data/drills'
import { formatSymptomList, isSymptomId } from '../data/symptoms'
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
  const workingOn = formatSymptomList(symptomIds)
  const summary = buildPlanSummary(symptomIds)

  if (symptomIds.length === 0) {
    return (
      <section className="page results">
        <Link to="/check-in" className="back-link">
          ← Check in
        </Link>
        <h1>Your practice plan</h1>
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

      <div className="page-intro">
        <h1>Your practice plan</h1>
        <p className="working-on">Working on: {workingOn}</p>
      </div>

      <aside className="plan-summary" aria-label="Session summary">
        <p>{summary}</p>
        <p className="plan-summary__count">
          {recommended.length} drill{recommended.length === 1 ? '' : 's'} for this
          session
        </p>
      </aside>

      <div className="drill-list">
        {recommended.map((drill) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>

      {session && (
        <FollowUp
          key={session.id}
          session={session}
          onUpdate={setSession}
        />
      )}
    </section>
  )
}
