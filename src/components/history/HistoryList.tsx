import { groupHistory, type HistoryEvent } from '../../lib/history'

interface HistoryListProps {
  events: HistoryEvent[]
  onDelete?: (event: HistoryEvent) => void
}

function EventRows({
  events,
  category,
  onDelete,
}: {
  events: HistoryEvent[]
  category: string
  onDelete?: (event: HistoryEvent) => void
}) {
  return (
    <ul className="sp-history__list">
      {events.map((event) => (
        <li key={event.id} className="sp-history__item">
          <div className="sp-history__row">
            <div>
              <p className="sp-history__date">{event.dateLabel}</p>
              {event.title !== category ? (
                <p className="sp-history__title">{event.title}</p>
              ) : null}
              {event.detail ? <p className="muted">{event.detail}</p> : null}
            </div>
            {event.canDelete && onDelete ? (
              <button
                type="button"
                className="sp-recent-delete"
                onClick={() => onDelete(event)}
              >
                Delete
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function HistoryList({ events, onDelete }: HistoryListProps) {
  if (events.length === 0) return null
  const groups = groupHistory(events)
  const grouped = groups.length > 1 || events.length > 1

  return (
    <div className="sp-history">
      {groups.map((group) =>
        grouped ? (
          <details key={group.category} className="sp-history__group" open>
            <summary className="sp-history__summary">
              {group.category}
              <span className="muted"> {group.events.length}</span>
            </summary>
            <EventRows
              events={group.events}
              category={group.category}
              onDelete={onDelete}
            />
          </details>
        ) : (
          <EventRows
            key={group.category}
            events={group.events}
            category={group.category}
            onDelete={onDelete}
          />
        ),
      )}
    </div>
  )
}
