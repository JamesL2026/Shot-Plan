export type SymptomId =
  | 'slice'
  | 'hook'
  | 'fat'
  | 'thin'
  | 'chipping'
  | 'putting'

export interface Symptom {
  id: SymptomId
  label: string
  description: string
}

export interface Drill {
  id: string
  symptomId: SymptomId
  name: string
  likelyCause: string
  howTo: string
  cue: string
  whyExplanation: string
}

export type SessionResult = 'helped' | 'did-not-help' | 'not-tried' | null

export interface Session {
  id: string
  createdAt: string
  symptomIds: SymptomId[]
  drillIds: string[]
  tried: boolean | null
  helped: boolean | null
  result: SessionResult
}
