import { formatDay } from '../data/moments'
import type { Adjustment, PracticeSession, Round } from '../types/memory'

export interface HistoryEvent {
  id: string
  at: string
  title: string
  detail?: string
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
          : 'Round'
    const saved = round.moments.length
    events.push({
      id: `round-${round.id}`,
      at: round.completedAt ?? round.createdAt,
      title: holes,
      detail: [
        formatDay(round.completedAt ?? round.createdAt),
        saved ? `${saved} saved` : null,
        round.remember,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }

  for (const session of sessions) {
    events.push({
      id: `practice-${session.id}`,
      at: session.date,
      title: `Practice · ${focusTitle(session.focusId)}`,
      detail: [
        formatDay(session.date),
        session.result,
        session.club,
        session.notes,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }

  for (const item of adjustments) {
    events.push({
      id: `adj-${item.id}`,
      at: item.workedAt ?? item.createdAt,
      title: item.workedAt ? 'What worked' : 'What I tried',
      detail: [
        formatDay(item.workedAt ?? item.createdAt),
        focusTitle(item.focusId),
        item.whatITried,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }

  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )
}
