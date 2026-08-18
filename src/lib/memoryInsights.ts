import {
  focusTitle,
  momentSubcategoryLabel,
  momentTypeLabel,
} from '../data/memory'
import type {
  Adjustment,
  CourseObservation,
  Focus,
  FocusArea,
  FocusInsight,
  PatternStatus,
  PracticeSession,
  RoundMoment,
  SavedRound,
} from '../types/memory'

const THRESHOLDS = {
  window: 5,
  oneOff: 1,
  watching: 2,
  startingToRepeat: 3,
  recurring: 4,
  practiceDelta: 0.04,
}

function looksLikePutt(moment: RoundMoment) {
  const note = moment.note?.toLowerCase() ?? ''
  return note.includes('putt') || note.includes('green')
}

export function momentMatchesArea(moment: RoundMoment, area: FocusArea) {
  if (moment.type === 'good') return false
  if (area === 'iron-contact') {
    return (
      moment.type === 'shot' &&
      (moment.subcategory === 'fat' ||
        moment.subcategory === 'thin' ||
        moment.subcategory === 'poor-contact')
    )
  }
  if (area === 'wedge-distance') {
    return (
      moment.type === 'shot' &&
      moment.subcategory === 'poor-distance' &&
      !looksLikePutt(moment)
    )
  }
  if (area === 'driver-direction' || area === 'start-line') {
    return (
      moment.type === 'shot' &&
      (moment.subcategory === 'left' || moment.subcategory === 'right')
    )
  }
  if (area === 'putting-speed') {
    return (
      moment.type === 'shot' &&
      moment.subcategory === 'poor-distance' &&
      looksLikePutt(moment)
    )
  }
  if (area === 'decision-routine') return moment.type === 'decision'
  if (area === 'mental-reset') return moment.type === 'mental'
  return moment.type === 'shot'
}

export function suggestedFocusFromMoment(moment: RoundMoment) {
  for (const area of [
    'iron-contact',
    'wedge-distance',
    'driver-direction',
    'putting-speed',
    'decision-routine',
    'mental-reset',
  ] as FocusArea[]) {
    if (momentMatchesArea(moment, area)) {
      return { area, title: focusTitle(area) }
    }
  }
  if (moment.type === 'good') {
    if (moment.subcategory === 'great-putt') {
      return { area: 'putting-speed' as const, title: 'Putting Speed' }
    }
    if (moment.subcategory === 'great-drive') {
      return { area: 'driver-direction' as const, title: 'Driver Direction' }
    }
    if (moment.subcategory === 'great-wedge') {
      return { area: 'wedge-distance' as const, title: 'Wedge Distance' }
    }
    if (moment.subcategory === 'great-approach') {
      return { area: 'iron-contact' as const, title: 'Iron Contact' }
    }
    if (moment.subcategory === 'great-decision') {
      return { area: 'decision-routine' as const, title: 'Decision Making' }
    }
    if (moment.subcategory === 'reset-well') {
      return { area: 'mental-reset' as const, title: 'Mental Reset' }
    }
  }
  return {
    area: 'custom' as const,
    title: momentSubcategoryLabel(moment.type, moment.subcategory),
  }
}

export function countAreaInRounds(
  rounds: SavedRound[],
  area: FocusArea,
  window = THRESHOLDS.window,
) {
  const recent = rounds
    .filter((round) => round.status === 'completed')
    .slice(0, window)
  return {
    seen: recent.filter((round) =>
      round.moments.some((moment) => momentMatchesArea(moment, area)),
    ).length,
    total: recent.length,
  }
}

function patternFromCounts(seen: number, total: number): PatternStatus {
  if (total <= 0 || seen <= 0) return 'unclear'
  if (seen <= THRESHOLDS.oneOff) return 'one-off'
  if (seen <= THRESHOLDS.watching) return 'watching'
  if (seen <= THRESHOLDS.startingToRepeat) return 'starting-to-repeat'
  return 'recurring'
}

export function patternLabel(pattern: PatternStatus) {
  switch (pattern) {
    case 'one-off':
      return 'One off'
    case 'watching':
      return 'Watching'
    case 'starting-to-repeat':
      return 'Starting to repeat'
    case 'recurring':
      return 'Recurring'
    case 'improving':
      return 'Improving'
    case 'not-transferring':
      return 'Not transferring yet'
    case 'working':
      return 'Promising'
    default:
      return 'Not enough evidence'
  }
}

function statusCopy(pattern: PatternStatus) {
  switch (pattern) {
    case 'one-off':
      return 'Showing up today.'
    case 'watching':
      return 'Worth watching.'
    case 'starting-to-repeat':
      return 'Starting to repeat.'
    case 'recurring':
      return 'Recurring pattern.'
    case 'improving':
      return 'Practice is improving.'
    case 'not-transferring':
      return 'Your practice result is improving, but the change has not clearly transferred to your rounds.'
    case 'working':
      return 'This is showing promising improvement.'
    default:
      return 'Not enough evidence.'
  }
}

function practiceImproving(sessions: PracticeSession[]) {
  const scored = sessions.filter(
    (session) =>
      typeof session.successCount === 'number' &&
      typeof session.attemptCount === 'number' &&
      session.attemptCount > 0,
  )
  if (scored.length < 2) return false
  const rates = scored.map(
    (session) => (session.successCount ?? 0) / (session.attemptCount ?? 1),
  )
  return rates[0] > rates[rates.length - 1] + THRESHOLDS.practiceDelta
}

function courseWorking(observations: CourseObservation[]) {
  if (observations.length < 2) return false
  return (
    observations.filter((item) => item.result === 'worked').length >=
    Math.ceil(observations.length * 0.6)
  )
}

export function seenLine(seen: number, total: number) {
  if (total <= 0) return 'No rounds saved yet.'
  if (seen <= 0) return 'Has not shown up in recent rounds.'
  if (total === 1) return "You've noticed this in your last round."
  return `You've noticed this in ${seen} of your last ${total} rounds.`
}

export function buildFocusInsight(
  focus: Focus,
  rounds: SavedRound[],
  sessions: PracticeSession[],
  observations: CourseObservation[],
): FocusInsight {
  const { seen, total } = countAreaInRounds(rounds, focus.area)
  let pattern = patternFromCounts(seen, total)
  const improving = practiceImproving(sessions)
  const transferring = courseWorking(observations)
  const showedUp = observations.some((item) => item.result === 'showed-up')
  let statusLine = seenLine(seen, total)

  if (improving && observations.length > 0 && !transferring && showedUp) {
    pattern = 'not-transferring'
    statusLine = statusCopy('not-transferring')
  } else if (improving && transferring) {
    pattern = 'working'
    statusLine = statusCopy('working')
  } else if (improving) {
    pattern = 'improving'
    statusLine = statusCopy('improving')
  } else {
    statusLine = statusCopy(pattern)
  }

  const practiceLine =
    sessions.length === 0
      ? 'No practice yet.'
      : `Practice: ${sessions
          .slice(0, 3)
          .map((session) =>
            typeof session.successCount === 'number' &&
            typeof session.attemptCount === 'number'
              ? `${session.successCount}/${session.attemptCount}`
              : (session.result ?? ''),
          )
          .filter(Boolean)
          .join(' → ')}`

  const showed = observations.filter((item) => item.result === 'showed-up')
    .length
  const worked = observations.filter((item) => item.result === 'worked').length
  const courseLine =
    observations.length === 0
      ? ''
      : worked > showed
        ? 'Course: better in recent rounds'
        : showed > 0
          ? 'Course: still appearing'
          : 'Course: seemed better'

  return {
    focusId: focus.id,
    title: focus.title,
    area: focus.area,
    roundsSeen: seen,
    roundsWindow: total,
    pattern,
    practiceLine,
    courseLine,
    statusLine,
  }
}

export function roundNotices(round: SavedRound) {
  const notices: string[] = []
  for (const area of [
    'iron-contact',
    'wedge-distance',
    'driver-direction',
    'putting-speed',
    'decision-routine',
    'mental-reset',
  ] as FocusArea[]) {
    const count = round.moments.filter((moment) =>
      momentMatchesArea(moment, area),
    ).length
    if (count > 0) {
      notices.push(
        `${focusTitle(area)}, ${count} time${count === 1 ? '' : 's'}`,
      )
    }
  }
  const goods = round.moments.filter((moment) => moment.type === 'good')
  if (goods.length > 0) {
    const first = goods[0]
    notices.push(
      `${momentSubcategoryLabel(first.type, first.subcategory)}, positive`,
    )
  }
  if (notices.length === 0 && round.moments.length > 0) {
    const counts = new Map<string, number>()
    for (const moment of round.moments) {
      const label = `${momentTypeLabel(moment.type)} · ${momentSubcategoryLabel(moment.type, moment.subcategory)}`
      counts.set(label, (counts.get(label) ?? 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([label, count]) => `${label}, ${count}`)
  }
  return notices.slice(0, 4)
}

export function nextWorkLine(insights: FocusInsight[]) {
  const order: PatternStatus[] = [
    'recurring',
    'starting-to-repeat',
    'not-transferring',
    'watching',
    'one-off',
  ]
  let best: FocusInsight | undefined
  let bestRank = order.length
  for (const insight of insights) {
    const rank = order.indexOf(insight.pattern)
    if (rank !== -1 && rank < bestRank) {
      best = insight
      bestRank = rank
    }
  }
  if (best) return `Work on next: ${best.title}. ${best.statusLine}`
}

export function workedAdjustments(adjustments: Adjustment[]) {
  return adjustments.filter((item) => Boolean(item.workedAt))
}

export function todayPlan(input: {
  focus?: Focus
  lastRound?: SavedRound
  lastPractice?: PracticeSession
  seen?: { seen: number; total: number }
  nextWork?: string
  workedLine?: string
}) {
  if (!input.focus) {
    return {
      kicker: "Today's Shot Plan",
      title: "Start saving the things you don't want to forget.",
      why: 'Play a round or start a focus. This becomes what you work on next.',
    }
  }

  const why =
    input.nextWork ||
    (input.seen
      ? seenLine(input.seen.seen, input.seen.total)
      : 'Just getting started.')

  const practiceMs = input.lastPractice?.date
    ? new Date(input.lastPractice.date).getTime()
    : 0
  const roundMs = input.lastRound
    ? new Date(
        input.lastRound.completedAt ?? input.lastRound.createdAt,
      ).getTime()
    : 0
  const lastLine =
    (practiceMs >= roundMs
      ? input.lastPractice?.notes?.trim() || input.lastRound?.remember?.trim()
      : input.lastRound?.remember?.trim() ||
        input.lastPractice?.notes?.trim()) ||
    input.focus.reason ||
    'Just pay attention to it today.'

  return {
    kicker: "Today's Shot Plan",
    title: input.focus.title,
    why,
    lastLine,
    workedLine: input.workedLine,
  }
}
