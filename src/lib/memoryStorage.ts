import type {
  Adjustment,
  CourseObservation,
  Focus,
  PracticeAttempt,
  PracticeSession,
  RoundMoment,
  SavedRound,
  SwingCheckpoint,
} from '../types/memory'

const KEYS = {
  rounds: 'shotplan:memory:rounds:v1',
  draft: 'shotplan:memory:round-draft:v1',
  focuses: 'shotplan:memory:focuses:v1',
  sessions: 'shotplan:memory:practice:v1',
  attempts: 'shotplan:memory:attempts:v1',
  swings: 'shotplan:memory:swings:v1',
  observations: 'shotplan:memory:observations:v1',
  adjustments: 'shotplan:memory:adjustments:v1',
} as const

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isMoment(value: unknown): value is RoundMoment {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.roundId === 'string' &&
    typeof value.timestamp === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.type === 'string' &&
    typeof value.subcategory === 'string'
  )
}

function isRound(value: unknown): value is SavedRound {
  if (!isRecord(value) || !Array.isArray(value.moments)) return false
  if (!value.moments.every(isMoment)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    (value.completedAt === null || typeof value.completedAt === 'string') &&
    (value.status === 'in-progress' || value.status === 'completed')
  )
}

function isFocus(value: unknown): value is Focus {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.area === 'string' &&
    typeof value.createdAt === 'string' &&
    (value.status === 'active' ||
      value.status === 'completed' ||
      value.status === 'paused' ||
      value.status === 'archived')
  )
}

function isPracticeSession(value: unknown): value is PracticeSession {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.focusId === 'string' &&
    typeof value.date === 'string' &&
    typeof value.testType === 'string' &&
    typeof value.successCriteria === 'string'
  )
}

function isAttempt(value: unknown): value is PracticeAttempt {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.practiceSessionId === 'string' &&
    typeof value.sequence === 'number' &&
    typeof value.result === 'string'
  )
}

function isSwing(value: unknown): value is SwingCheckpoint {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.practiceSessionId === 'string' &&
    typeof value.focus === 'string' &&
    typeof value.localReference === 'string' &&
    typeof value.createdAt === 'string'
  )
}

function isObservation(value: unknown): value is CourseObservation {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.roundId === 'string' &&
    typeof value.focusId === 'string' &&
    (value.result === 'worked' || value.result === 'showed-up') &&
    typeof value.createdAt === 'string'
  )
}

function isAdjustment(value: unknown): value is Adjustment {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.focusId === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.whatITried === 'string' &&
    (value.source === 'practice' ||
      value.source === 'round' ||
      value.source === 'manual')
  )
}

function readList<T>(key: string, guard: (value: unknown) => value is T): T[] {
  const raw = readJson(key)
  return Array.isArray(raw) ? raw.filter(guard) : []
}

export function newId() {
  return crypto.randomUUID()
}

export function nowIso() {
  return new Date().toISOString()
}

export const memoryStore = {
  saveRound(round: SavedRound) {
    if (round.status === 'in-progress') {
      writeJson(KEYS.draft, round)
      return
    }
    const rounds = memoryStore.getRounds().filter((item) => item.id !== round.id)
    rounds.unshift(round)
    writeJson(KEYS.rounds, rounds)
    localStorage.removeItem(KEYS.draft)
  },

  getRoundDraft() {
    const draft = readJson(KEYS.draft)
    if (!isRound(draft) || draft.status !== 'in-progress') return null
    return draft
  },

  clearRoundDraft() {
    localStorage.removeItem(KEYS.draft)
  },

  getRounds() {
    return readList(KEYS.rounds, isRound)
      .filter((round) => round.status === 'completed')
      .sort(
        (a, b) =>
          new Date(b.completedAt ?? b.createdAt).getTime() -
          new Date(a.completedAt ?? a.createdAt).getTime(),
      )
  },

  getRound(id: string) {
    const draft = memoryStore.getRoundDraft()
    if (draft?.id === id) return draft
    return memoryStore.getRounds().find((round) => round.id === id)
  },

  deleteRound(id: string) {
    writeJson(
      KEYS.rounds,
      memoryStore.getRounds().filter((round) => round.id !== id),
    )
    writeJson(
      KEYS.observations,
      memoryStore
        .getCourseObservations()
        .filter((item) => item.roundId !== id),
    )
    if (memoryStore.getRoundDraft()?.id === id) {
      localStorage.removeItem(KEYS.draft)
    }
  },

  deleteFocus(id: string) {
    const sessionIds = new Set(
      memoryStore.getPracticeSessions(id).map((session) => session.id),
    )
    writeJson(
      KEYS.focuses,
      memoryStore.getFocuses().filter((focus) => focus.id !== id),
    )
    writeJson(
      KEYS.sessions,
      memoryStore
        .getPracticeSessions()
        .filter((session) => session.focusId !== id),
    )
    writeJson(
      KEYS.attempts,
      memoryStore
        .getAttempts()
        .filter((attempt) => !sessionIds.has(attempt.practiceSessionId)),
    )
    writeJson(
      KEYS.swings,
      memoryStore
        .getSwingCheckpoints()
        .filter((swing) => !sessionIds.has(swing.practiceSessionId)),
    )
    writeJson(
      KEYS.observations,
      memoryStore
        .getCourseObservations()
        .filter((item) => item.focusId !== id),
    )
    writeJson(
      KEYS.adjustments,
      memoryStore.getAdjustments().filter((item) => item.focusId !== id),
    )
  },

  saveFocus(focus: Focus) {
    const next = { ...focus, updatedAt: nowIso() }
    const focuses = memoryStore
      .getFocuses()
      .filter((item) => item.id !== next.id)
      .map((item) =>
        next.status === 'active' && item.status === 'active'
          ? { ...item, status: 'paused' as const, updatedAt: nowIso() }
          : item,
      )
    focuses.unshift(next)
    writeJson(KEYS.focuses, focuses)
  },

  getFocuses() {
    return readList(KEYS.focuses, isFocus)
  },

  getActiveFocus() {
    return memoryStore.getFocuses().find((focus) => focus.status === 'active')
  },

  savePracticeSession(session: PracticeSession) {
    const sessions = memoryStore
      .getPracticeSessions()
      .filter((item) => item.id !== session.id)
    sessions.unshift(session)
    writeJson(KEYS.sessions, sessions)
  },

  getPracticeSessions(focusId?: string) {
    const sessions = readList(KEYS.sessions, isPracticeSession)
    return focusId
      ? sessions.filter((session) => session.focusId === focusId)
      : sessions
  },

  saveAttempts(attempts: PracticeAttempt[]) {
    if (attempts.length === 0) return
    const sessionId = attempts[0].practiceSessionId
    const rest = memoryStore
      .getAttempts()
      .filter((attempt) => attempt.practiceSessionId !== sessionId)
    writeJson(KEYS.attempts, [...attempts, ...rest])
  },

  getAttempts(sessionId?: string) {
    const attempts = readList(KEYS.attempts, isAttempt)
    return sessionId
      ? attempts.filter((attempt) => attempt.practiceSessionId === sessionId)
      : attempts
  },

  saveSwingCheckpoint(swing: SwingCheckpoint) {
    const swings = memoryStore
      .getSwingCheckpoints()
      .filter((item) => item.id !== swing.id)
    swings.unshift(swing)
    writeJson(KEYS.swings, swings)
  },

  getSwingCheckpoints(sessionId?: string) {
    const swings = readList(KEYS.swings, isSwing)
    return sessionId
      ? swings.filter((swing) => swing.practiceSessionId === sessionId)
      : swings
  },

  latestSwing() {
    return memoryStore.getSwingCheckpoints()[0]
  },

  saveCourseObservation(observation: CourseObservation) {
    const observations = memoryStore
      .getCourseObservations()
      .filter((item) => item.id !== observation.id)
    observations.unshift(observation)
    writeJson(KEYS.observations, observations)
  },

  getCourseObservations(focusId?: string) {
    const observations = readList(KEYS.observations, isObservation)
    return focusId
      ? observations.filter((item) => item.focusId === focusId)
      : observations
  },

  saveAdjustment(adjustment: Adjustment) {
    const adjustments = memoryStore
      .getAdjustments()
      .filter((item) => item.id !== adjustment.id)
    adjustments.unshift(adjustment)
    writeJson(KEYS.adjustments, adjustments)
  },

  getAdjustments(focusId?: string) {
    const adjustments = readList(KEYS.adjustments, isAdjustment).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return focusId
      ? adjustments.filter((item) => item.focusId === focusId)
      : adjustments
  },

  markAdjustmentWorked(focusId: string) {
    const pending = memoryStore
      .getAdjustments(focusId)
      .find((item) => !item.workedAt)
    if (!pending) return
    const next = { ...pending, workedAt: nowIso() }
    memoryStore.saveAdjustment(next)
    return next
  },
}
