export type SymptomId =
  | 'slice'
  | 'hook'
  | 'fat'
  | 'thin'
  | 'chipping'
  | 'putting'

export type EquipmentId =
  | 'towel'
  | 'alignment-stick'
  | 'tee'
  | 'headcover'
  | 'clubs'
  | 'ball'
  | 'coin'
  | 'two-tees'

export type SurfaceType = 'mats' | 'grass' | 'both'

export type DiagramView = 'top' | 'side'

export interface Symptom {
  id: SymptomId
  label: string
  description: string
}

export interface Drill {
  id: string
  symptomId: SymptomId
  name: string
  goal: string
  worksOn: SurfaceType
  matAdjustment?: string
  equipment: EquipmentId[]
  setup: string
  view: DiagramView
  steps: [string, string, string]
  commonMistake: {
    mistake: string
    instead: string
  }
  cue: string
  whyItWorks: string
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
  checklist?: Record<string, boolean>
  practiceDone?: boolean
}
