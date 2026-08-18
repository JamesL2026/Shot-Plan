import { areaLabel, subLabel, SUCCESS_FOR_TEST, typeLabel } from '../data/moments'
import type {
  CourseObservation,
  Focus,
  FocusArea,
  Moment,
  PatternLabel,
  PracticeSession,
  ProgressInsight,
  Round,
  Adjustment,
} from '../types/memory'

/** Centralized pattern thresholds. Window is last N completed rounds. */
export const PATTERN = {
  window: 5,
  oneOff: 1,
  watching: 2,
  startingToRepeat: 3,
  recurring: 4,
  practiceDelta: 0.04,
} as const

function looksLikePutt(moment: Moment): boolean {
  const note = moment.note?.toLowerCase() ?? ''
  return note.includes('putt') || note.includes('green')
}

export function momentMatchesArea(moment: Moment, area: FocusArea): boolean {
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

export function focusFromMoment(moment: Moment): { area: FocusArea; title: string } {
  const areas: FocusArea[] = [
    'iron-contact',
    'wedge-distance',
    'driver-direction',
    'putting-speed',
    'decision-routine',
    'mental-reset',
  ]
  for (const area of areas) {
    if (momentMatchesArea(moment, area)) {
      return { area, title: areaLabel(area) }
    }
  }
  if (moment.type === 'good') {
    if (moment.subcategory === 'great-putt') {
      return { area: 'putting-speed', title: 'Putting Speed' }
    }
    if (moment.subcategory === 'great-drive') {
      return { area: 'driver-direction', title: 'Driver Direction' }
    }
    if (moment.subcategory === 'great-wedge') {
      return { area: 'wedge-distance', title: 'Wedge Distance' }
    }
    if (moment.subcategory === 'great-approach') {
      return { area: 'iron-contact', title: 'Iron Contact' }
    }
    if (moment.subcategory === 'great-decision') {
      return { area: 'decision-routine', title: 'Decision Making' }
    }
    if (moment.subcategory === 'reset-well') {
      return { area: 'mental-reset', title: 'Mental Reset' }
    }
  }
  return { area: 'custom', title: subLabel(moment.type, moment.subcategory) }
}

export function roundsWithArea(
  rounds: Round[],
  area: FocusArea,
  window = PATTERN.window,
): { seen: number; total: number } {
  const recent = rounds
    .filter((item) => item.status === 'completed')
    .slice(0, window)
  const seen = recent.filter((round) =>
    round.moments.some((moment) => momentMatchesArea(moment, area)),
  ).length
  return { seen, total: recent.length }
}

export function patternFromCount(seen: number, total: number): PatternLabel {
  if (total <= 0 || seen <= 0) return 'unclear'
  if (seen <= PATTERN.oneOff) return 'one-off'
  if (seen <= PATTERN.watching) return 'watching'
  if (seen <= PATTERN.startingToRepeat) return 'starting-to-repeat'
  return 'recurring'
}

export function patternCopy(label: PatternLabel): string {
  switch (label) {
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

export function patternBadge(label: PatternLabel): string {
  switch (label) {
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

function practiceImproving(sessions: PracticeSession[]): boolean {
  const scored = sessions.filter(
    (item) =>
      typeof item.successCount === 'number' &&
      typeof item.attemptCount === 'number' &&
      item.attemptCount > 0,
  )
  if (scored.length < 2) return false
  const rates = scored.map(
    (item) => (item.successCount ?? 0) / (item.attemptCount ?? 1),
  )
  return rates[0] > rates[rates.length - 1] + PATTERN.practiceDelta
}

function courseImproving(observations: CourseObservation[]): boolean {
  if (observations.length < 2) return false
  const worked = observations.filter((item) => item.result === 'worked').length
  return worked >= Math.ceil(observations.length * 0.6)
}

export function showingLine(seen: number, total: number): string {
  if (total <= 0) return 'No rounds saved yet.'
  if (seen <= 0) return 'Has not shown up in recent rounds.'
  if (total === 1) return "You've noticed this in your last round."
  return `You've noticed this in ${seen} of your last ${total} rounds.`
}

export function buildInsight(
  focus: Focus,
  rounds: Round[],
  sessions: PracticeSession[],
  observations: CourseObservation[],
): ProgressInsight {
  const { seen, total } = roundsWithArea(rounds, focus.area)
  let pattern = patternFromCount(seen, total)
  const practiceUp = practiceImproving(sessions)
  const courseUp = courseImproving(observations)
  const courseStill = observations.some((item) => item.result === 'showed-up')

  let statusLine = showingLine(seen, total)
  if (practiceUp && observations.length > 0 && !courseUp && courseStill) {
    pattern = 'not-transferring'
    statusLine = patternCopy('not-transferring')
  } else if (practiceUp && courseUp) {
    pattern = 'working'
    statusLine = patternCopy('working')
  } else if (practiceUp) {
    pattern = 'improving'
    statusLine = patternCopy('improving')
  } else {
    statusLine = patternCopy(pattern)
  }

  const practiceLine =
    sessions.length === 0
      ? 'No practice yet.'
      : `Practice: ${sessions
          .slice(0, 3)
          .map((item) =>
            typeof item.successCount === 'number' &&
            typeof item.attemptCount === 'number'
              ? `${item.successCount}/${item.attemptCount}`
              : (item.result ?? ''),
          )
          .filter(Boolean)
          .join(' → ')}`

  const showed = observations.filter((item) => item.result === 'showed-up').length
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

export function todayWatchHint(
  moments: Moment[],
): { area: FocusArea; title: string; count: number } | null {
  const areas: FocusArea[] = [
    'iron-contact',
    'wedge-distance',
    'driver-direction',
    'putting-speed',
    'decision-routine',
    'mental-reset',
  ]
  let best: { area: FocusArea; title: string; count: number } | null = null
  for (const area of areas) {
    const count = moments.filter((moment) => momentMatchesArea(moment, area)).length
    if (count > (best?.count ?? 0)) {
      best = { area, title: areaLabel(area), count }
    }
  }
  return best && best.count > 0 ? best : null
}

export function typeCounts(moments: Moment[]): { shots: number; decisions: number; mental: number; good: number } {
  return {
    shots: moments.filter((item) => item.type === 'shot').length,
    decisions: moments.filter((item) => item.type === 'decision').length,
    mental: moments.filter((item) => item.type === 'mental').length,
    good: moments.filter((item) => item.type === 'good').length,
  }
}

export function lastRoundNotices(round: Round): string[] {
  const lines: string[] = []
  const hintAreas: FocusArea[] = [
    'iron-contact',
    'wedge-distance',
    'driver-direction',
    'putting-speed',
    'decision-routine',
    'mental-reset',
  ]
  for (const area of hintAreas) {
    const count = round.moments.filter((moment) =>
      momentMatchesArea(moment, area),
    ).length
    if (count > 0) {
      lines.push(
        `${areaLabel(area)}, ${count} time${count === 1 ? '' : 's'}`,
      )
    }
  }
  const goods = round.moments.filter((item) => item.type === 'good')
  if (goods.length > 0) {
    const top = goods[0]
    lines.push(`${subLabel(top.type, top.subcategory)}, positive`)
  }
  if (lines.length === 0 && round.moments.length > 0) {
    const map = new Map<string, number>()
    for (const moment of round.moments) {
      const key = `${typeLabel(moment.type)} · ${subLabel(moment.type, moment.subcategory)}`
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key, count]) => `${key}, ${count}`)
  }
  return lines.slice(0, 4)
}

export function carryForwardChoices(
  round: Round,
): { area: FocusArea; title: string }[] {
  const choices: { area: FocusArea; title: string }[] = []
  const hint = todayWatchHint(round.moments)
  if (hint) choices.push({ area: hint.area, title: hint.title })
  if (
    round.moments.some((item) => item.type === 'decision') &&
    !choices.some((item) => item.area === 'decision-routine')
  ) {
    choices.push({ area: 'decision-routine', title: 'Decision Making' })
  }
  const putt = round.moments.some(
    (item) => item.type === 'good' && item.subcategory === 'great-putt',
  )
  if (putt && !choices.some((item) => item.area === 'putting-speed')) {
    choices.push({ area: 'putting-speed', title: 'Putting Speed' })
  }
  return choices.slice(0, 3)
}

export function successLabel(testType: PracticeSession['testType']): string {
  return SUCCESS_FOR_TEST[testType]
}

export function workOnNext(insights: ProgressInsight[]): string | undefined {
  const rank: PatternLabel[] = [
    'recurring',
    'starting-to-repeat',
    'not-transferring',
    'watching',
    'one-off',
  ]
  let best: ProgressInsight | undefined
  let bestRank = rank.length
  for (const item of insights) {
    const index = rank.indexOf(item.pattern)
    if (index !== -1 && index < bestRank) {
      best = item
      bestRank = index
    }
  }
  if (!best) return undefined
  return `Work on next: ${best.title}. ${best.statusLine}`
}

export function workingAdjustments(adjustments: Adjustment[]) {
  return adjustments.filter((item) => Boolean(item.workedAt))
}

export function buildTodayPlan(input: {
  focus?: Focus
  lastRound?: Round | null
  lastPractice?: PracticeSession
  seen?: { seen: number; total: number } | null
  nextWork?: string
  workedLine?: string
}): {
  kicker: string
  title: string
  why: string
  lastLine?: string
  workedLine?: string
} {
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
      ? showingLine(input.seen.seen, input.seen.total)
      : 'Just getting started.')
  const practiceAt = input.lastPractice?.date
    ? new Date(input.lastPractice.date).getTime()
    : 0
  const roundAt = input.lastRound
    ? new Date(input.lastRound.completedAt ?? input.lastRound.createdAt).getTime()
    : 0
  const newestNote =
    practiceAt >= roundAt
      ? input.lastPractice?.notes?.trim() || input.lastRound?.remember?.trim()
      : input.lastRound?.remember?.trim() || input.lastPractice?.notes?.trim()
  const lastLine =
    newestNote ||
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

