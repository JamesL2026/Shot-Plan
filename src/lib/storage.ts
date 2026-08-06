import type { Session, SessionResult, SymptomId } from '../types'
import { isSymptomId } from '../data/symptoms'

const SESSIONS_KEY = 'shotplan:sessions'

function isSessionResult(value: unknown): value is SessionResult {
  return (
    value === null ||
    value === 'helped' ||
    value === 'did-not-help' ||
    value === 'not-tried'
  )
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.createdAt === 'string' &&
    Array.isArray(s.symptomIds) &&
    s.symptomIds.every((id) => typeof id === 'string' && isSymptomId(id)) &&
    Array.isArray(s.drillIds) &&
    s.drillIds.every((id) => typeof id === 'string') &&
    (typeof s.tried === 'boolean' || s.tried === null) &&
    (typeof s.helped === 'boolean' || s.helped === null) &&
    isSessionResult(s.result)
  )
}

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isSession)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  } catch {
    return []
  }
}

export function getSession(id: string): Session | undefined {
  return getSessions().find((session) => session.id === id)
}

function writeSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function saveSession(session: Session): void {
  const sessions = getSessions().filter((item) => item.id !== session.id)
  sessions.unshift(session)
  writeSessions(sessions)
}

export function createSession(input: {
  symptomIds: SymptomId[]
  drillIds: string[]
}): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    symptomIds: input.symptomIds,
    drillIds: input.drillIds,
    tried: null,
    helped: null,
    result: null,
  }
  saveSession(session)
  return session
}

export function updateSession(
  id: string,
  patch: Partial<
    Pick<
      Session,
      'tried' | 'helped' | 'result' | 'checklist' | 'practiceDone'
    >
  >,
): Session | undefined {
  const sessions = getSessions()
  const index = sessions.findIndex((session) => session.id === id)
  if (index === -1) return undefined

  const updated: Session = { ...sessions[index], ...patch }
  sessions[index] = updated
  writeSessions(sessions)
  return updated
}

export function deriveSessionResult(
  tried: boolean | null,
  helped: boolean | null,
): SessionResult {
  if (tried === false) return 'not-tried'
  if (tried === true && helped === true) return 'helped'
  if (tried === true && helped === false) return 'did-not-help'
  return null
}

export { SESSIONS_KEY }
