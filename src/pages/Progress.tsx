import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import { HistoryList } from '../components/history/HistoryList'
import { formatDay } from '../data/moments'
import { buildHistory, type HistoryEvent } from '../lib/history'
import { storage } from '../lib/memoryStorage'
import { buildInsight, patternBadge, workingAdjustments } from '../lib/patterns'
import { trackEvent } from '../lib/track'
import { getVideoUrl } from '../lib/videoStore'
import type { ProgressInsight } from '../types/memory'

type Pending =
  | { kind: 'focus'; insight: ProgressInsight }
  | { kind: 'event'; event: HistoryEvent }

export function ProgressPage() {
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<Pending | null>(null)
  const focuses = storage.getFocuses()
  const rounds = storage.getRounds()
  const swing = storage.latestSwing()
  const sessions = storage.getPracticeSessions()
  const adjustments = storage.getAdjustments()
  const events = buildHistory(
    rounds,
    sessions,
    adjustments,
    (id) => focuses.find((row) => row.id === id)?.title ?? 'Focus',
  )
  const swingRef = swing?.localReference
  const [clipUrl, setClipUrl] = useState<string | null>(null)
  const insights = focuses.map((focus) =>
    buildInsight(
      focus,
      rounds,
      storage.getPracticeSessions(focus.id),
      storage.getCourseObservations(focus.id),
    ),
  )
  const helped = workingAdjustments(adjustments)
  const uniqueHelped = [
    ...new Map(
      helped.map((item) => [item.whatITried.trim().toLowerCase(), item]),
    ).values(),
  ]
  const notHeld = uniqueHelped.filter(
    (item) =>
      !storage
        .getCourseObservations(item.focusId)
        .some((row) => row.result === 'worked'),
  )

  useEffect(() => {
    trackEvent('history_viewed')
  }, [])

  useEffect(() => {
    if (!swingRef) return
    let cancelled = false
    void getVideoUrl(swingRef).then((url) => {
      if (!cancelled) setClipUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [swingRef])

  function confirmDelete() {
    if (!pending) return
    if (pending.kind === 'focus') {
      storage.deleteFocus(pending.insight.focusId)
    } else if (pending.event.kind === 'round') {
      storage.deleteRound(pending.event.sourceId)
    } else if (pending.event.kind === 'practice') {
      storage.deletePracticeSession(pending.event.sourceId)
    }
    setPending(null)
    setTick((value) => value + 1)
  }

  return (
    <section className="page rr-page">
      <p className="rr-kicker">Progress</p>
      <h1>What keeps showing up?</h1>
      <p className="muted">
        From what you noticed. Not a handicap, not strokes gained, not a diagnosis.
      </p>

      {insights.length === 0 && events.length === 0 ? (
        <div className="sp-focus-card">
          <p className="sp-focus-card__title">Nothing saved yet</p>
          <p className="muted">
            Play a round or choose a practice. This page will show whether the
            same thing keeps happening.
          </p>
          <div className="sp-focus-card__actions">
            <Button variant="primary" block to="/practice">
              Choose practice
            </Button>
            <Button variant="secondary" block to="/play">
              Play a round
            </Button>
          </div>
        </div>
      ) : null}

      {insights.length > 0 ? (
        <ul className="sp-insight-list">
          {insights.map((item) => {
            const focus = focuses.find((row) => row.id === item.focusId)
            const lastPractice = storage.getPracticeSessions(item.focusId)[0]
            const lastRound = rounds.find((round) =>
              round.watchNextArea === item.area,
            )
            const when =
              lastPractice?.date ??
              lastRound?.completedAt ??
              focus?.updatedAt ??
              focus?.createdAt
            return (
              <li key={item.focusId} className="sp-insight">
                <div className="sp-insight__head">
                  <p className="sp-insight__title">{item.title}</p>
                  <button
                    type="button"
                    className="sp-recent-delete"
                    onClick={() => setPending({ kind: 'focus', insight: item })}
                  >
                    Delete
                  </button>
                </div>
                {when ? (
                  <p className="sp-history__date">{formatDay(when)}</p>
                ) : null}
                <p className="sp-insight__status">{patternBadge(item.pattern)}</p>
                <p>{item.statusLine}</p>
                {item.roundsWindow > 1 ? (
                  <p className="muted">
                    Appeared in {item.roundsSeen} of last {item.roundsWindow} relevant
                    sessions
                  </p>
                ) : (
                  <p className="muted">Not enough evidence</p>
                )}
                <p className="muted">{item.practiceLine}</p>
                {item.courseLine ? <p className="muted">{item.courseLine}</p> : null}
              </li>
            )
          })}
        </ul>
      ) : null}

      {helped.length > 0 ? (
        <div className="sp-plan-block">
          <h2 className="sp-subhead">What has helped</h2>
          <ul className="rr-counts">
            {uniqueHelped.slice(0, 6).map((item) => {
              const focusTitle =
                focuses.find((row) => row.id === item.focusId)?.title ?? 'Focus'
              const times = helped.filter(
                (row) =>
                  row.whatITried.trim().toLowerCase() ===
                  item.whatITried.trim().toLowerCase(),
              ).length
              return (
                <li key={item.id} className="rr-count">
                  {item.whatITried}. {focusTitle}. {formatDay(item.workedAt ?? item.createdAt)}.
                  Reported helpful{times > 1 ? ` ${times} times` : times === 1 ? ' once' : ''}.
                  {storage
                    .getCourseObservations(item.focusId)
                    .some((row) => row.result === 'worked')
                    ? ''
                    : ' Course transfer not confirmed.'}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {notHeld.length > 0 ? (
        <div className="sp-plan-block">
          <h2 className="sp-subhead">What has not held up yet</h2>
          <ul className="rr-counts">
            {notHeld.slice(0, 6).map((item) => {
              const focusTitle =
                focuses.find((row) => row.id === item.focusId)?.title ?? 'Focus'
              return (
                <li key={`hold-${item.id}`} className="rr-count">
                  {item.whatITried}. {focusTitle}. Course transfer not confirmed.
                  Worth testing again.
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {events.length > 0 ? (
        <>
          <h2 className="sp-subhead">History</h2>
          <p className="muted">
            Dates on each item. Grouped by 9 holes, 18 holes, and practice when
            there is more than one. Groups start open. Collapse if you do not
            need them.
          </p>
          <HistoryList
            events={events}
            onDelete={(event) => setPending({ kind: 'event', event })}
          />
        </>
      ) : null}

      {swing ? (
        <div className="sp-swing">
          <p className="rr-prompt rr-prompt--quiet">Last swing clip</p>
          <p className="muted">
            {swing.focus}
            {swing.club ? ` · ${swing.club}` : ''} · {formatDay(swing.createdAt)}.
            On this phone only. Not a swing analysis.
          </p>
          {clipUrl ? (
            <video className="sp-video" src={clipUrl} controls playsInline />
          ) : (
            <p className="muted">The clip isn't on this phone anymore.</p>
          )}
        </div>
      ) : null}

      {insights.length > 0 || events.length > 0 ? (
        <div className="rr-actions">
          <Button variant="primary" block to="/">
            Next Shot Plan
          </Button>
          <Button variant="secondary" block to="/practice">
            Practice
          </Button>
        </div>
      ) : null}

      {pending ? (
        <ConfirmSheet
          title={
            pending.kind === 'focus'
              ? `Delete ${pending.insight.title}?`
              : pending.event.kind === 'round'
                ? `Delete this ${pending.event.title}?`
                : 'Delete this practice?'
          }
          body={
            pending.kind === 'focus'
              ? 'This comes off Progress. Rounds you already saved stay.'
              : pending.event.kind === 'round'
                ? 'This round and what you saved in it will be removed from this phone. This cannot be undone.'
                : 'This practice session will be removed from this phone. This cannot be undone.'
          }
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </section>
  )
}
