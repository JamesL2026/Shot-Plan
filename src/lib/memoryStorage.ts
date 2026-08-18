import type {
  Adjustment,
  CourseObservation,
  Focus,
  Moment,
  PracticeAttempt,
  PracticeSession,
  Round,
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
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isMoment(value: unknown): value is Moment {
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

function isRound(value: unknown): value is Round {
  if (!isRecord(value)) return false
  if (!Array.isArray(value.moments) || !value.moments.every(isMoment)) return false
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

function isSession(value: unknown): value is PracticeSession {
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

function list<T>(key: string, guard: (value: unknown) => value is T): T[] {
  const parsed = readJson(key)
  if (!Array.isArray(parsed)) return []
  return parsed.filter(guard)
}

export const storage = {
  saveRound(round: Round): void {
    if (round.status === 'in-progress') {
      writeJson(KEYS.draft, round)
      return
    }
    const existing = storage.getRounds().filter((item) => item.id !== round.id)
    existing.unshift(round)
    writeJson(KEYS.rounds, existing)
    localStorage.removeItem(KEYS.draft)
  },

  getRoundDraft(): Round | null {
    const parsed = readJson(KEYS.draft)
    if (!isRound(parsed) || parsed.status !== 'in-progress') return null
    return parsed
  },

  clearRoundDraft(): void {
    localStorage.removeItem(KEYS.draft)
  },

  getRounds(): Round[] {
    return list(KEYS.rounds, isRound)
      .filter((item) => item.status === 'completed')
      .sort(
        (a, b) =>
          new Date(b.completedAt ?? b.createdAt).getTime() -
          new Date(a.completedAt ?? a.createdAt).getTime(),
      )
  },

  getRound(id: string): Round | undefined {
    if (storage.getRoundDraft()?.id === id) return storage.getRoundDraft() ?? undefined
    return storage.getRounds().find((item) => item.id === id)
  },

  deleteRound(id: string): void {
    const remaining = storage.getRounds().filter((item) => item.id !== id)
    writeJson(KEYS.rounds, remaining)
    const observations = storage
      .getCourseObservations()
      .filter((item) => item.roundId !== id)
    writeJson(KEYS.observations, observations)
    if (storage.getRoundDraft()?.id === id) {
      localStorage.removeItem(KEYS.draft)
    }
  },

  deleteFocus(id: string): void {
    const sessionIds = new Set(
      storage.getPracticeSessions(id).map((item) => item.id),
    )
    writeJson(
      KEYS.focuses,
      storage.getFocuses().filter((item) => item.id !== id),
    )
    writeJson(
      KEYS.sessions,
      storage.getPracticeSessions().filter((item) => item.focusId !== id),
    )
    writeJson(
      KEYS.attempts,
      storage
        .getAttempts()
        .filter((item) => !sessionIds.has(item.practiceSessionId)),
    )
    writeJson(
      KEYS.swings,
      storage
        .getSwingCheckpoints()
        .filter((item) => !sessionIds.has(item.practiceSessionId)),
    )
    writeJson(
      KEYS.observations,
      storage.getCourseObservations().filter((item) => item.focusId !== id),
    )
    writeJson(
      KEYS.adjustments,
      storage.getAdjustments().filter((item) => item.focusId !== id),
    )
  },

  saveFocus(focus: Focus): void {
    const next: Focus = {
      ...focus,
      updatedAt: nowIso(),
    }
    const existing = storage
      .getFocuses()
      .filter((item) => item.id !== next.id)
      .map((item) =>
        next.status === 'active' && item.status === 'active'
          ? { ...item, status: 'paused' as const, updatedAt: nowIso() }
          : item,
      )
    existing.unshift(next)
    writeJson(KEYS.focuses, existing)
  },

  getFocuses(): Focus[] {
    return list(KEYS.focuses, isFocus)
  },

  getActiveFocus(): Focus | undefined {
    return storage.getFocuses().find((item) => item.status === 'active')
  },

  savePracticeSession(session: PracticeSession): void {
    const existing = storage
      .getPracticeSessions()
      .filter((item) => item.id !== session.id)
    existing.unshift(session)
    writeJson(KEYS.sessions, existing)
  },

  getPracticeSessions(focusId?: string): PracticeSession[] {
    const all = list(KEYS.sessions, isSession)
    return focusId ? all.filter((item) => item.focusId === focusId) : all
  },

  saveAttempts(attempts: PracticeAttempt[]): void {
    if (attempts.length === 0) return
    const sessionId = attempts[0].practiceSessionId
    const existing = storage
      .getAttempts()
      .filter((item) => item.practiceSessionId !== sessionId)
    writeJson(KEYS.attempts, [...attempts, ...existing])
  },

  getAttempts(sessionId?: string): PracticeAttempt[] {
    const all = list(KEYS.attempts, isAttempt)
    return sessionId
      ? all.filter((item) => item.practiceSessionId === sessionId)
      : all
  },

  saveSwingCheckpoint(checkpoint: SwingCheckpoint): void {
    const existing = storage
      .getSwingCheckpoints()
      .filter((item) => item.id !== checkpoint.id)
    existing.unshift(checkpoint)
    writeJson(KEYS.swings, existing)
  },

  getSwingCheckpoints(sessionId?: string): SwingCheckpoint[] {
    const all = list(KEYS.swings, isSwing)
    return sessionId
      ? all.filter((item) => item.practiceSessionId === sessionId)
      : all
  },

  latestSwing(): SwingCheckpoint | undefined {
    return storage.getSwingCheckpoints()[0]
  },

  saveCourseObservation(observation: CourseObservation): void {
    const existing = storage
      .getCourseObservations()
      .filter((item) => item.id !== observation.id)
    existing.unshift(observation)
    writeJson(KEYS.observations, existing)
  },

  getCourseObservations(focusId?: string): CourseObservation[] {
    const all = list(KEYS.observations, isObservation)
    return focusId ? all.filter((item) => item.focusId === focusId) : all
  },

  saveAdjustment(adjustment: Adjustment): void {
    const existing = storage
      .getAdjustments()
      .filter((item) => item.id !== adjustment.id)
    existing.unshift(adjustment)
    writeJson(KEYS.adjustments, existing)
  },

  getAdjustments(focusId?: string): Adjustment[] {
    const all = list(KEYS.adjustments, isAdjustment).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return focusId ? all.filter((item) => item.focusId === focusId) : all
  },

  markAdjustmentWorked(focusId: string): Adjustment | undefined {
    const open = storage.getAdjustments(focusId).find((item) => !item.workedAt)
    if (!open) return undefined
    const next = { ...open, workedAt: nowIso() }
    storage.saveAdjustment(next)
    return next
  },
}

export function newId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}

export { KEYS as MEMORY_KEYS }
