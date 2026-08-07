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

/** Main coaching focus so drills feel distinct from each other. */
export type BodyFocus =
  | 'Setup / Alignment'
  | 'Path'
  | 'Rotation / Balance'
  | 'Hands / Wrists'
  | 'Low Point'
  | 'Extension'
  | 'Distance Control'
  | 'Start Line'
  | 'Speed'
  | 'Connection'

/** Club follow-up answers. Path shots use driver/irons; strike shots use irons/wedges. */
export type ClubFocus = 'driver' | 'irons' | 'wedges' | 'both'

export type ClubFocusBySymptom = Partial<Record<SymptomId, ClubFocus>>

/** Diagram flavor — only when setup genuinely changes. */
export type DiagramVariant = 'default' | 'driver' | 'irons' | 'wedges'

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
  /** What part of the motion this drill coaches. */
  bodyFocus: BodyFocus
  worksOn: SurfaceType
  matAdjustment?: string
  equipment: EquipmentId[]
  setup: string
  view: DiagramView
  steps: string[]
  commonMistake: {
    mistake: string
    instead: string
  }
  cue: string
  whyItWorks: string
}

/** Same drill content with optional club-specific copy, diagram flavor, and coaching challenge. */
export interface AdaptedDrill extends Drill {
  diagramVariant: DiagramVariant
  clubLabel: string | null
  estimatedMinutes?: number
  objective?: string
  successCondition?: string
  reflection?: string
  templateLabel?: string
  challengeId?: string
}

export type SessionResult = 'helped' | 'did-not-help' | 'not-tried' | null

export interface Session {
  id: string
  createdAt: string
  symptomIds: SymptomId[]
  drillIds: string[]
  /** Club follow-up answers keyed by symptom. */
  clubFocus?: ClubFocusBySymptom
  tried: boolean | null
  helped: boolean | null
  result: SessionResult
  checklist?: Record<string, boolean>
  practiceDone?: boolean
}
