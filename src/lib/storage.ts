import type {
  ClubFocusBySymptom,
  Session,
  SessionResult,
  SymptomId,
} from '../types'
import { isSymptomId } from '../data/symptoms'
import { parseClubFocusMap } from '../data/clubFocus'

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
  const clubFocus =
    s.clubFocus === undefined ? undefined : parseClubFocusMap(s.clubFocus)
  if (s.clubFocus !== undefined && clubFocus === undefined) {
    // Tolerate unknown shapes by dropping clubFocus rather than rejecting the session.
  }
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

function normalizeSession(value: Session): Session {
  const clubFocus = parseClubFocusMap(value.clubFocus)
  return clubFocus ? { ...value, clubFocus } : { ...value, clubFocus: undefined }
}

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isSession)
      .map(normalizeSession)
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
  clubFocus?: ClubFocusBySymptom
}): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    symptomIds: input.symptomIds,
    drillIds: input.drillIds,
    clubFocus: input.clubFocus,
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
