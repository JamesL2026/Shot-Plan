import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useFeedback } from '../components/FeedbackContext'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import { TodayPlanCard } from '../components/plan/TodayPlanCard'
import { formatDay } from '../data/moments'
import { storage } from '../lib/memoryStorage'
import {
  buildInsight,
  buildTodayPlan,
  hasPlanEvidence,
  roundsWithArea,
  suggestedFocus,
  workOnNext,
  workingAdjustments,
} from '../lib/patterns'
import { trackEvent } from '../lib/track'
import type { PracticeSession, Round } from '../types/memory'

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

function RecentGroup({
  title,
  count,
  grouped,
  children,
}: {
  title: string
  count: number
  grouped: boolean
  children: ReactNode
}) {
  if (!grouped) return children
  return (
    <details className="sp-history__group" open>
      <summary className="sp-history__summary">
        {title}
        <span className="muted"> {count}</span>
      </summary>
      {children}
    </details>
  )
}

function RoundRows({
  items,
  onDelete,
}: {
  items: Round[]
  onDelete: (round: Round) => void
}) {
  return (
    <>
      {items.slice(0, 6).map((round) => (
        <div key={round.id} className="sp-recent-row">
          <p>
            {formatDay(round.completedAt ?? round.createdAt)}
            {round.moments.length
              ? ` · ${round.moments.length} saved`
              : ' · no moments'}
          </p>
          <button
            type="button"
            className="sp-recent-delete"
            onClick={() => onDelete(round)}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  )
}

type Pending =
  | { kind: 'round'; round: Round }
  | { kind: 'practice'; session: PracticeSession }
  | { kind: 'draft' }
  | null

export function Home() {
  const { openFeedback } = useFeedback()
  const [, setTick] = useState(0)
  const [pending, setPending] = useState<Pending>(null)
  const rounds = storage.getRounds()
  const lastRound = rounds[0]
  const sessions = storage.getPracticeSessions()
  const lastPractice = sessions[0]
  const draft = storage.getRoundDraft()
  const focusList = storage.getFocuses()
  const insights = focusList.map((item) =>
    buildInsight(
      item,
      rounds,
      storage.getPracticeSessions(item.id),
      storage.getCourseObservations(item.id),
    ),
  )
  const planFocus = hasPlanEvidence(sessions, rounds)
    ? suggestedFocus(focusList, insights, lastPractice)
    : undefined
  const worked = planFocus
    ? workingAdjustments(storage.getAdjustments(planFocus.id))[0]
    : undefined
  const plan = buildTodayPlan({
    focus: planFocus,
    lastRound,
    lastPractice: planFocus
      ? storage.getPracticeSessions(planFocus.id)[0]
      : lastPractice,
    sessions: planFocus ? storage.getPracticeSessions(planFocus.id) : sessions,
    rounds,
    seen: planFocus ? roundsWithArea(rounds, planFocus.area) : null,
    nextWork:
      workOnNext(
        planFocus
          ? insights.filter((item) => item.focusId === planFocus.id)
          : insights,
      ) || workOnNext(insights),
    workedLine: worked ? worked.whatITried : undefined,
    tried: worked?.whatITried,
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
    } else if (pending.kind === 'practice') {
      storage.deletePracticeSession(pending.session.id)
    } else {
      storage.clearRoundDraft()
    }
    setPending(null)
    refresh()
  }

  const nine = rounds.filter((round) => round.holesPlayed === 9)
  const eighteen = rounds.filter((round) => round.holesPlayed === 18)
  const otherRounds = rounds.filter((round) => !round.holesPlayed)
  const recentGroups = [
    nine.length > 0 ? 1 : 0,
    eighteen.length > 0 ? 1 : 0,
    otherRounds.length > 0 ? 1 : 0,
    sessions.length > 0 ? 1 : 0,
  ].reduce((sum, item) => sum + item, 0)
  const groupRecent = recentGroups > 1 || rounds.length + sessions.length > 1

  return (
    <section className="page home animate-in">
      <div className="home-intro">
        <h1>Golf memory</h1>
        <p className="home-intro__lead">
          Don&apos;t start every round over.
        </p>
      </div>

      {planFocus ? (
        <TodayPlanCard
          kicker={plan.kicker}
          title={plan.title}
          why={plan.why}
          lastLine={plan.lastLine}
          workedLine={plan.workedLine}
          todayTest={plan.todayTest}
          playTo="/play"
          playLabel={draft ? 'Continue round' : 'Play a round'}
          practiceLabel={plan.enoughHistory ? 'Practice' : 'Start baseline'}
          showView={plan.enoughHistory}
          onPractice={() => trackEvent('plan_followed')}
          onPlay={() => trackEvent('plan_skipped')}
        />
      ) : (
        <TodayPlanCard
          kicker={plan.kicker}
          title={plan.title}
          why={plan.why}
          todayTest={plan.todayTest}
          playTo="/play"
          playLabel={draft ? 'Continue round' : 'Play a round'}
          practiceLabel="Choose practice"
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
          {nine.length > 0 ? (
            <RecentGroup title="9 holes" count={nine.length} grouped={groupRecent}>
              <RoundRows
                items={nine}
                onDelete={(round) => setPending({ kind: 'round', round })}
              />
            </RecentGroup>
          ) : null}
          {eighteen.length > 0 ? (
            <RecentGroup
              title="18 holes"
              count={eighteen.length}
              grouped={groupRecent}
            >
              <RoundRows
                items={eighteen}
                onDelete={(round) => setPending({ kind: 'round', round })}
              />
            </RecentGroup>
          ) : null}
          {otherRounds.length > 0 ? (
            <RecentGroup
              title="Rounds"
              count={otherRounds.length}
              grouped={groupRecent}
            >
              <RoundRows
                items={otherRounds}
                onDelete={(round) => setPending({ kind: 'round', round })}
              />
            </RecentGroup>
          ) : null}
          {sessions.length > 0 ? (
            <RecentGroup
              title="Practice"
              count={sessions.length}
              grouped={groupRecent}
            >
              {sessions.slice(0, 6).map((session) => (
                <div key={session.id} className="sp-recent-row">
                  <p>
                    {formatDay(session.date)}
                    {session.whatWasTried
                      ? ` · tried ${session.whatWasTried}`
                      : session.result
                        ? ` · ${session.result}`
                        : ''}
                  </p>
                  <button
                    type="button"
                    className="sp-recent-delete"
                    onClick={() => setPending({ kind: 'practice', session })}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </RecentGroup>
          ) : null}
        </div>
      ) : null}

      <details className="home-earlier">
        <summary>Earlier versions</summary>
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
      </details>

      <p className="home-feedback-nudge">
        <button
          type="button"
          className="home-feedback-nudge__btn"
          onClick={() => openFeedback()}
        >
          Help Improve
        </button>
      </p>

      {pending ? (
        <ConfirmSheet
          title={
            pending.kind === 'draft'
              ? 'Discard this round?'
              : pending.kind === 'practice'
                ? 'Delete this practice?'
                : 'Delete this round?'
          }
          body={
            pending.kind === 'draft'
              ? 'The shots you already saved in this unfinished round will be gone.'
              : pending.kind === 'practice'
                ? 'This practice session will be removed from this phone. This cannot be undone.'
                : 'This round and what you saved in it will be removed from this phone. This cannot be undone.'
          }
          confirmLabel={
            pending.kind === 'draft'
              ? 'Discard round'
              : pending.kind === 'practice'
                ? 'Delete practice'
                : 'Delete round'
          }
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </section>
  )
}
