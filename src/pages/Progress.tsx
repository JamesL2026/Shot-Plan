import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import { HistoryList } from '../components/history/HistoryList'
import { formatDay } from '../data/moments'
import { buildHistory } from '../lib/history'
import { storage } from '../lib/memoryStorage'
import { buildInsight, patternBadge, workingAdjustments } from '../lib/patterns'
import { getVideoUrl } from '../lib/videoStore'
import type { ProgressInsight } from '../types/memory'

export function ProgressPage() {
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<ProgressInsight | null>(null)
  const focuses = storage.getFocuses()
  const rounds = storage.getRounds()
  const swing = storage.latestSwing()
  const sessions = storage.getPracticeSessions()
  const events = buildHistory(
    rounds,
    sessions,
    storage.getAdjustments(),
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
    storage.deleteFocus(pending.focusId)
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
          {insights.map((item) => {
            const focus = focuses.find((row) => row.id === item.focusId)
            return (
              <li key={item.focusId} className="sp-insight">
                <div className="sp-insight__head">
                  <p className="sp-insight__title">{item.title}</p>
                  <button
                    type="button"
                    className="sp-recent-delete"
                    onClick={() => setPending(item)}
                  >
                    Delete
                  </button>
                </div>
                <p className="muted">
                  {item.roundsSeen} of last {item.roundsWindow || 5} rounds
                  {focus ? ` · ${formatDay(focus.createdAt)}` : ''}
                </p>
                <p className="sp-insight__status">{patternBadge(item.pattern)}</p>
                <p>{item.statusLine}</p>
                <p>{item.practiceLine}</p>
                {item.courseLine ? <p className="muted">{item.courseLine}</p> : null}
                {(() => {
                  const worked = workingAdjustments(
                    storage.getAdjustments(item.focusId),
                  )[0]
                  return worked ? (
                    <p className="muted">
                      Last time this worked: {worked.whatITried}
                    </p>
                  ) : null
                })()}
              </li>
            )
          })}
        </ul>
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
