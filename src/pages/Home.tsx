import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFeedback } from '../components/FeedbackContext'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { Button } from '../components/ui/Button'
import { formatShortDate } from '../data/memory'
import {
  buildFocusInsight,
  countAreaInRounds,
  nextWorkLine,
  roundNotices,
  todayPlan,
  workedAdjustments,
} from '../lib/memoryInsights'
import { memoryStore } from '../lib/memoryStorage'
import { track } from '../lib/track'
import type { SavedRound } from '../types/memory'

const EARLIER = [
  {
    to: '/check-in',
    title: 'After a rough round',
    desc: 'Pick what went wrong. Get a short practice plan.',
  },
  {
    to: '/assessment',
    title: 'Test your game',
    desc: '15 shots at the range. See what’s strong and what needs work.',
  },
  {
    to: '/library',
    title: 'Practice library',
    desc: 'Browse drills by miss. Fat shots, slices, putting, and more.',
  },
  {
    to: '/sessions',
    title: 'Practice journal',
    desc: 'Past coaching sessions saved on this phone.',
  },
  {
    to: '/case-study',
    title: 'How ShotPlan evolved',
    desc: 'The earlier versions, and what each one taught us.',
  },
]

function FocusCard({
  kicker,
  title,
  why,
  lastLine,
  workedLine,
  notices,
  playTo,
  playLabel,
  practiceLabel,
  showView,
}: {
  kicker: string
  title: string
  why: string
  lastLine?: string
  workedLine?: string
  notices?: string[]
  playTo: string
  playLabel: string
  practiceLabel: string
  showView?: boolean
}) {
  return (
    <div className="sp-focus-card">
      <p className="rr-kicker">{kicker}</p>
      <p className="sp-focus-card__title">{title}</p>
      <p className="muted">{why}</p>
      {lastLine ? <p>{lastLine}</p> : null}
      {workedLine ? <p className="muted">{workedLine}</p> : null}
      {notices && notices.length > 0 ? (
        <ul className="rr-counts">
          {notices.map((notice) => (
            <li className="rr-count" key={notice}>
              {notice}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="sp-focus-card__actions">
        <Button to="/practice" variant="primary" block>
          {practiceLabel}
        </Button>
        <Button to={playTo} variant="secondary" block>
          {playLabel}
        </Button>
        {showView ? (
          <Button to="/progress" variant="secondary" block>
            History
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export function Home() {
  const { openFeedback } = useFeedback()
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<
    { kind: 'round'; round: SavedRound } | { kind: 'draft' } | null
  >(null)

  const focus = memoryStore.getActiveFocus()
  const rounds = memoryStore.getRounds()
  const lastRound = rounds[0]
  const lastPractice = memoryStore.getPracticeSessions(focus?.id)[0]
  const draft = memoryStore.getRoundDraft()
  const seen = focus ? countAreaInRounds(rounds, focus.area) : null
  const notices = lastRound ? roundNotices(lastRound) : []
  const insights = memoryStore.getFocuses().map((item) =>
    buildFocusInsight(
      item,
      rounds,
      memoryStore.getPracticeSessions(item.id),
      memoryStore.getCourseObservations(item.id),
    ),
  )
  const lastWorked = focus
    ? workedAdjustments(memoryStore.getAdjustments(focus.id))[0]
    : undefined
  const plan = todayPlan({
    focus,
    lastRound,
    lastPractice,
    seen: seen ?? undefined,
    nextWork:
      nextWorkLine(
        focus ? insights.filter((item) => item.focusId === focus.id) : insights,
      ) || nextWorkLine(insights),
    workedLine: lastWorked
      ? `Last time this worked: ${lastWorked.whatITried}`
      : undefined,
  })

  useEffect(() => {
    track('plan_viewed')
  }, [])

  function refresh() {
    setTick((value) => value + 1)
  }

  function confirmDelete() {
    if (!pending) return
    if (pending.kind === 'round') memoryStore.deleteRound(pending.round.id)
    else memoryStore.clearRoundDraft()
    setPending(null)
    refresh()
  }

  return (
    <section className="page home animate-in">
      <div className="home-intro">
        <h1>Golf memory</h1>
        <p className="home-intro__lead">Don't start over every round.</p>
      </div>

      {focus ? (
        <FocusCard
          kicker={plan.kicker}
          title={plan.title}
          why={plan.why}
          lastLine={plan.lastLine}
          workedLine={plan.workedLine}
          playTo="/play"
          playLabel={draft ? 'Continue round' : 'Play a round'}
          practiceLabel="Practice"
          showView
        />
      ) : (
        <FocusCard
          kicker={plan.kicker}
          title={plan.title}
          why={plan.why}
          notices={notices}
          playTo="/play"
          playLabel={draft ? 'Continue round' : 'Play a round'}
          practiceLabel="Start a focus"
        />
      )}

      {draft || rounds.length > 0 || lastPractice ? (
        <div className="sp-recent">
          <p className="rr-kicker">Recent</p>
          {draft ? (
            <div className="sp-recent-row">
              <p>
                Unfinished round
                {draft.moments.length ? ` · ${draft.moments.length} saved` : ''}
              </p>
              <button
                type="button"
                className="sp-recent-delete"
                onClick={() => setPending({ kind: 'draft' })}
              >
                Discard
              </button>
            </div>
          ) : null}
          {rounds.slice(0, 8).map((round) => (
            <div className="sp-recent-row" key={round.id}>
              <p>
                {formatShortDate(round.completedAt ?? round.createdAt)}
                {round.moments.length
                  ? ` · ${round.moments.length} saved`
                  : ''}
              </p>
              <button
                type="button"
                className="sp-recent-delete"
                onClick={() => setPending({ kind: 'round', round })}
              >
                Delete
              </button>
            </div>
          ))}
          {lastPractice ? (
            <p>
              Last practice: {formatShortDate(lastPractice.date)}
              {lastPractice.result ? ` · ${lastPractice.result}` : ''}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="home-tools">
        <h2 className="home-tools__title">Earlier experiments</h2>
        <p className="muted home-tools__lead">Still here. Not the main loop.</p>
        <ul className="home-tools__list">
          {EARLIER.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="home-tool">
                <span className="home-tool__title">{item.title}</span>
                <span className="home-tool__desc">{item.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="home-feedback-nudge">
        <button
          type="button"
          className="home-feedback-nudge__btn"
          onClick={() => openFeedback()}
        >
          Help Improve
        </button>
        {' · two taps'}
      </p>

      {pending ? (
        <ConfirmSheet
          title={
            pending.kind === 'draft'
              ? 'Discard this round?'
              : 'Delete this round?'
          }
          body={
            pending.kind === 'draft'
              ? 'The shots you already saved in this unfinished round will be gone.'
              : 'This round and what you saved in it will be removed from this phone. This cannot be undone.'
          }
          confirmLabel={
            pending.kind === 'draft' ? 'Discard round' : 'Delete round'
          }
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </section>
  )
}
