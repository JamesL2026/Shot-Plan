import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFeedback } from '../components/FeedbackContext'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import { TodayPlanCard } from '../components/plan/TodayPlanCard'
import { formatDay } from '../data/moments'
import { storage } from '../lib/memoryStorage'
import {
  buildInsight,
  buildTodayPlan,
  lastRoundNotices,
  roundsWithArea,
  workOnNext,
  workingAdjustments,
} from '../lib/patterns'
import { trackEvent } from '../lib/track'
import type { Round } from '../types/memory'

const EARLIER_TOOLS = [
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
] as const

type Pending =
  | { kind: 'round'; round: Round }
  | { kind: 'draft' }
  | null

export function Home() {
  const { openFeedback } = useFeedback()
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<Pending>(null)
  const focus = storage.getActiveFocus()
  const rounds = storage.getRounds()
  const lastRound = rounds[0]
  const lastPractice = storage.getPracticeSessions(focus?.id)[0]
  const draft = storage.getRoundDraft()
  const seen = focus ? roundsWithArea(rounds, focus.area) : null
  const notices = lastRound ? lastRoundNotices(lastRound) : []
  const insights = storage.getFocuses().map((item) =>
    buildInsight(
      item,
      rounds,
      storage.getPracticeSessions(item.id),
      storage.getCourseObservations(item.id),
    ),
  )
  const worked = focus
    ? workingAdjustments(storage.getAdjustments(focus.id))[0]
    : undefined
  const plan = buildTodayPlan({
    focus,
    lastRound,
    lastPractice,
    seen,
    nextWork:
      workOnNext(
        focus ? insights.filter((item) => item.focusId === focus.id) : insights,
      ) || workOnNext(insights),
    workedLine: worked
      ? `Last time this worked: ${worked.whatITried}`
      : undefined,
  })

  useEffect(() => {
    trackEvent('plan_viewed')
  }, [])

  function refresh() {
    setTick((value) => value + 1)
  }

  function confirmDelete() {
    if (!pending) return
    if (pending.kind === 'round') {
      storage.deleteRound(pending.round.id)
    } else {
      storage.clearRoundDraft()
    }
    setPending(null)
    refresh()
  }

  return (
    <section className="page home animate-in">
      <div className="home-intro">
        <h1>Golf memory</h1>
        <p className="home-intro__lead">
          Don&apos;t start over every round.
        </p>
      </div>

      {focus ? (
        <TodayPlanCard
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
        <TodayPlanCard
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
                {draft.moments.length
                  ? ` · ${draft.moments.length} saved`
                  : ''}
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
            <div key={round.id} className="sp-recent-row">
              <p>
                {formatDay(round.completedAt ?? round.createdAt)}
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
              Last practice: {formatDay(lastPractice.date)}
              {lastPractice.result ? ` · ${lastPractice.result}` : ''}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="home-tools">
        <h2 className="home-tools__title">Earlier experiments</h2>
        <p className="muted home-tools__lead">
          Still here. Not the main loop.
        </p>
        <ul className="home-tools__list">
          {EARLIER_TOOLS.map((tool) => (
            <li key={tool.to}>
              <Link to={tool.to} className="home-tool">
                <span className="home-tool__title">{tool.title}</span>
                <span className="home-tool__desc">{tool.desc}</span>
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
            pending.kind === 'draft' ? 'Discard this round?' : 'Delete this round?'
          }
          body={
            pending.kind === 'draft'
              ? 'The shots you already saved in this unfinished round will be gone.'
              : 'This round and what you saved in it will be removed from this phone. This cannot be undone.'
          }
          confirmLabel={pending.kind === 'draft' ? 'Discard round' : 'Delete round'}
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </section>
  )
}
