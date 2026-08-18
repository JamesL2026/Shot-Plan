import { formatDay } from '../data/moments'
import type { Adjustment, PracticeSession, Round } from '../types/memory'

export type HistoryKind = 'round' | 'practice' | 'adjustment'

export interface HistoryEvent {
  id: string
  kind: HistoryKind
  sourceId: string
  category: string
  at: string
  dateLabel: string
  title: string
  detail?: string
  canDelete: boolean
}

export function buildHistory(
  rounds: Round[],
  sessions: PracticeSession[],
  adjustments: Adjustment[],
  focusTitle: (focusId: string) => string,
): HistoryEvent[] {
  const events: HistoryEvent[] = []

  for (const round of rounds) {
    const holes =
      round.holesPlayed === 9
        ? '9 holes'
        : round.holesPlayed === 18
          ? '18 holes'
          : 'Rounds'
    const at = round.completedAt ?? round.createdAt
    const saved = round.moments.length
    events.push({
      id: `round-${round.id}`,
      kind: 'round',
      sourceId: round.id,
      category: holes,
      at,
      dateLabel: formatDay(at),
      title: holes,
      detail: [
        saved ? `${saved} saved` : 'No moments',
        round.remember,
      ]
        .filter(Boolean)
        .join(' · '),
      canDelete: true,
    })
  }

  for (const session of sessions) {
    const focus = focusTitle(session.focusId)
    events.push({
      id: `practice-${session.id}`,
      kind: 'practice',
      sourceId: session.id,
      category: `Practice · ${focus}`,
      at: session.date,
      dateLabel: formatDay(session.date),
      title: focus,
      detail: [
        session.result,
        session.whatWasTried ? `tried ${session.whatWasTried}` : null,
        session.club,
        session.notes,
      ]
        .filter(Boolean)
        .join(' · '),
      canDelete: true,
    })
  }

  for (const item of adjustments) {
    events.push({
      id: `adj-${item.id}`,
      kind: 'adjustment',
      sourceId: item.id,
      category: 'What I tried',
      at: item.workedAt ?? item.createdAt,
      dateLabel: formatDay(item.workedAt ?? item.createdAt),
      title: item.workedAt ? 'Reported helpful' : 'Tried',
      detail: [focusTitle(item.focusId), item.whatITried]
        .filter(Boolean)
        .join(' · '),
      canDelete: false,
    })
  }

  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )
}

export function groupHistory(events: HistoryEvent[]): {
  category: string
  events: HistoryEvent[]
}[] {
  const order: string[] = []
  const map = new Map<string, HistoryEvent[]>()
  for (const event of events) {
    const list = map.get(event.category)
    if (list) {
      list.push(event)
    } else {
      order.push(event.category)
      map.set(event.category, [event])
    }
  }
  return order.map((category) => ({
    category,
    events: map.get(category) ?? [],
  }))
}
