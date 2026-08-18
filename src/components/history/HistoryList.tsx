import type { HistoryEvent } from '../../lib/history'

interface HistoryListProps {
  events: HistoryEvent[]
}

export function HistoryList({ events }: HistoryListProps) {
  if (events.length === 0) return null

  return (
    <div className="sp-history">
      <p className="rr-kicker">History</p>
      <ul className="sp-history__list">
        {events.slice(0, 12).map((event) => (
          <li key={event.id} className="sp-history__item">
            <p className="sp-history__title">{event.title}</p>
            {event.detail ? <p className="muted">{event.detail}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
