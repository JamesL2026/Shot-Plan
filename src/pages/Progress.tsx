import { useEffect, useState } from 'react'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { Button } from '../components/ui/Button'
import { formatShortDate } from '../data/memory'
import {
  buildFocusInsight,
  patternLabel,
  workedAdjustments,
} from '../lib/memoryInsights'
import { memoryStore } from '../lib/memoryStorage'
import { loadSwingUrl } from '../lib/videoStore'
import type { FocusInsight } from '../types/memory'

interface HistoryEvent {
  id: string
  at: string
  title: string
  detail: string
}

function HistoryList({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) return null
  return (
    <div className="sp-history">
      <p className="rr-kicker">History</p>
      <ul className="sp-history__list">
        {events.slice(0, 12).map((event) => (
          <li className="sp-history__item" key={event.id}>
            <p className="sp-history__title">{event.title}</p>
            {event.detail ? <p className="muted">{event.detail}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

function buildHistory(
  rounds: ReturnType<typeof memoryStore.getRounds>,
  sessions: ReturnType<typeof memoryStore.getPracticeSessions>,
  adjustments: ReturnType<typeof memoryStore.getAdjustments>,
  titleFor: (focusId: string) => string,
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
        formatShortDate(round.completedAt ?? round.createdAt),
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
      title: `Practice · ${titleFor(session.focusId)}`,
      detail: [
        formatShortDate(session.date),
        session.result,
        session.club,
        session.notes,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }
  for (const adjustment of adjustments) {
    events.push({
      id: `adj-${adjustment.id}`,
      at: adjustment.workedAt ?? adjustment.createdAt,
      title: adjustment.workedAt ? 'What worked' : 'What I tried',
      detail: [
        formatShortDate(adjustment.workedAt ?? adjustment.createdAt),
        titleFor(adjustment.focusId),
        adjustment.whatITried,
      ]
        .filter(Boolean)
        .join(' · '),
    })
  }
  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )
}

export function ProgressPage() {
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<FocusInsight | null>(null)
  const focuses = memoryStore.getFocuses()
  const rounds = memoryStore.getRounds()
  const latestSwing = memoryStore.latestSwing()
  const events = buildHistory(
    rounds,
    memoryStore.getPracticeSessions(),
    memoryStore.getAdjustments(),
    (focusId) => focuses.find((focus) => focus.id === focusId)?.title ?? 'Focus',
  )
  const localRef = latestSwing?.localReference
  const [clipUrl, setClipUrl] = useState<string | null>(null)
  const insights = focuses.map((focus) =>
    buildFocusInsight(
      focus,
      rounds,
      memoryStore.getPracticeSessions(focus.id),
      memoryStore.getCourseObservations(focus.id),
    ),
  )

  useEffect(() => {
    if (!localRef) return
    let cancelled = false
    void loadSwingUrl(localRef).then((url) => {
      if (!cancelled) setClipUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [localRef])

  function confirmDelete() {
    if (!pending) return
    memoryStore.deleteFocus(pending.focusId)
    setPending(null)
    setTick((value) => value + 1)
  }

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Progress</p>
      <h1>What keeps showing up?</h1>
      <p className="muted">
        From what you noticed. Not a handicap, not strokes gained.
      </p>
      <HistoryList events={events} />
      {insights.length === 0 && events.length === 0 ? (
        <div className="sp-focus-card">
          <p className="sp-focus-card__title">Nothing saved yet</p>
          <p className="muted">
            Play a round or start a focus. This page will show whether the same
            thing keeps happening.
          </p>
          <div className="sp-focus-card__actions">
            <Button variant="primary" block to="/play">
              Remember a round
            </Button>
            <Button variant="secondary" block to="/practice">
              Start a focus
            </Button>
          </div>
        </div>
      ) : insights.length > 0 ? (
        <ul className="sp-insight-list">
          {insights.map((insight) => {
            const focus = focuses.find((item) => item.id === insight.focusId)
            const lastWorked = workedAdjustments(
              memoryStore.getAdjustments(insight.focusId),
            )[0]
            return (
              <li className="sp-insight" key={insight.focusId}>
                <div className="sp-insight__head">
                  <p className="sp-insight__title">{insight.title}</p>
                  <button
                    type="button"
                    className="sp-recent-delete"
                    onClick={() => setPending(insight)}
                  >
                    Delete
                  </button>
                </div>
                <p className="muted">
                  {insight.roundsSeen} of last {insight.roundsWindow || 5}{' '}
                  rounds
                  {focus ? ` · ${formatShortDate(focus.createdAt)}` : ''}
                </p>
                <p className="sp-insight__status">
                  {patternLabel(insight.pattern)}
                </p>
                <p>{insight.statusLine}</p>
                <p>{insight.practiceLine}</p>
                {insight.courseLine ? (
                  <p className="muted">{insight.courseLine}</p>
                ) : null}
                {lastWorked ? (
                  <p className="muted">
                    Last time this worked: {lastWorked.whatITried}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : null}

      {latestSwing ? (
        <div className="sp-swing">
          <p className="rr-prompt rr-prompt--quiet">Last swing clip</p>
          <p className="muted">
            {latestSwing.focus}
            {latestSwing.club ? ` · ${latestSwing.club}` : ''} ·{' '}
            {formatShortDate(latestSwing.createdAt)}. On this phone only. Not a
            swing analysis.
          </p>
          {clipUrl ? (
            <video
              className="sp-video"
              src={clipUrl}
              controls
              playsInline
            />
          ) : (
            <p className="muted">The clip isn’t on this phone anymore.</p>
          )}
        </div>
      ) : null}

      {insights.length > 0 || events.length > 0 ? (
        <div className="rr-actions">
          <Button variant="primary" block to="/">
            Next Shot Plan
          </Button>
          {insights.length > 0 ? (
            <Button variant="secondary" block to="/practice">
              Practice
            </Button>
          ) : null}
        </div>
      ) : null}

      {pending ? (
        <ConfirmSheet
          title={`Delete ${pending.title}?`}
          body="This comes off Progress. Rounds you already saved stay."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </section>
  )
}
