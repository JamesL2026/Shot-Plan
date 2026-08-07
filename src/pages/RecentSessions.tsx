import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { formatSymptomList } from '../data/symptoms'
import { getSessions } from '../lib/storage'
import type { Session, SessionResult } from '../types'

function formatSessionDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function resultLabel(result: SessionResult): string {
  switch (result) {
    case 'helped':
      return 'Helped'
    case 'did-not-help':
      return 'Didn’t help'
    case 'not-tried':
      return 'Not tried yet'
    default:
      return 'Plan ready'
  }
}

function resultClass(result: SessionResult): string {
  switch (result) {
    case 'helped':
      return 'session-card__badge session-card__badge--helped'
    case 'did-not-help':
      return 'session-card__badge session-card__badge--miss'
    case 'not-tried':
      return 'session-card__badge session-card__badge--pending'
    default:
      return 'session-card__badge'
  }
}

export function RecentSessions() {
  const sessions = getSessions()

  return (
    <section className="page sessions animate-in">
      <BackLink to="/">Home</BackLink>

      <div className="page-intro">
        <h1>Practice Journal</h1>
        <p className="muted">Your past coaching sessions on this device.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={28} strokeWidth={1.75} aria-hidden="true" />
          <p className="empty-state__title">No sessions yet.</p>
          <p className="muted">
            Check in once and your coach will start building your journal.
          </p>
          <Button to="/check-in" variant="primary" block>
            Check In
          </Button>
        </div>
      ) : (
        <ul className="session-list">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
      )}
    </section>
  )
}

function SessionRow({ session }: { session: Session }) {
  const title = formatSymptomList(session.symptomIds)
  const drillCount = session.drillIds.length

  return (
    <li>
      <Link to={`/results?session=${session.id}`} className="session-card">
        <div className="session-card__top">
          <time dateTime={session.createdAt} className="session-card__date">
            {formatSessionDate(session.createdAt)}
          </time>
          <span className={resultClass(session.result)}>
            {resultLabel(session.result)}
          </span>
        </div>
        <p className="session-card__title">{title}</p>
        <p className="session-card__meta muted">
          {drillCount} drill{drillCount === 1 ? '' : 's'} prescribed
        </p>
      </Link>
    </li>
  )
}
