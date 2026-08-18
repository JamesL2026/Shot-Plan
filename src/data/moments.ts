import type {
  DecisionSubcategory,
  FocusArea,
  GoodSubcategory,
  MentalSubcategory,
  MomentSubcategory,
  MomentType,
  PracticeTestType,
  ShotSubcategory,
  StoodOut,
  TransferFeel,
} from '../types/memory'

export const MOMENT_TYPES: {
  value: MomentType
  label: string
  hint: string
}[] = [
  {
    value: 'shot',
    label: 'Missed shot',
    hint: 'Fat, thin, left, right, or distance',
  },
  {
    value: 'decision',
    label: 'A decision',
    hint: 'Wrong club, target, or too aggressive',
  },
  {
    value: 'mental',
    label: 'In your head',
    hint: 'Rushed, frustrated, or lost focus',
  },
  {
    value: 'good',
    label: 'A good one',
    hint: 'A shot or choice you want to keep',
  },
]

export const SHOT_SUBS: { value: ShotSubcategory; label: string }[] = [
  { value: 'fat', label: 'Fat' },
  { value: 'thin', label: 'Thin' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'poor-distance', label: 'Poor Distance' },
  { value: 'poor-contact', label: 'Poor Contact' },
  { value: 'other', label: 'Other' },
]

export const DECISION_SUBS: { value: DecisionSubcategory; label: string }[] = [
  { value: 'wrong-club', label: 'Wrong Club' },
  { value: 'wrong-target', label: 'Wrong Target' },
  { value: 'too-aggressive', label: 'Too Aggressive' },
  { value: 'hero-shot', label: 'Hero Shot' },
  { value: 'other', label: 'Other' },
]

export const MENTAL_SUBS: { value: MentalSubcategory; label: string }[] = [
  { value: 'rushed', label: 'Rushed' },
  { value: 'lost-focus', label: 'Lost Focus' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'poor-routine', label: 'Poor Routine' },
  { value: 'other', label: 'Other' },
]

export const GOOD_SUBS: { value: GoodSubcategory; label: string }[] = [
  { value: 'great-drive', label: 'Great Drive' },
  { value: 'great-approach', label: 'Great Approach' },
  { value: 'great-wedge', label: 'Great Wedge' },
  { value: 'great-save', label: 'Great Save' },
  { value: 'great-putt', label: 'Great Putt' },
  { value: 'great-decision', label: 'Great Decision' },
  { value: 'reset-well', label: 'Reset Well' },
  { value: 'other', label: 'Other' },
]

export const SUBS_BY_TYPE: Record<
  MomentType,
  { value: MomentSubcategory; label: string }[]
> = {
  shot: SHOT_SUBS,
  decision: DECISION_SUBS,
  mental: MENTAL_SUBS,
  good: GOOD_SUBS,
}

export const FOCUS_AREAS: { value: FocusArea; label: string }[] = [
  { value: 'iron-contact', label: 'Iron Contact' },
  { value: 'wedge-distance', label: 'Wedge Distance' },
  { value: 'driver-direction', label: 'Driver Direction' },
  { value: 'putting-speed', label: 'Putting Speed' },
  { value: 'start-line', label: 'Start Line' },
  { value: 'decision-routine', label: 'Decision Making' },
  { value: 'mental-reset', label: 'Mental Reset' },
  { value: 'custom', label: 'Other' },
]

export const STOOD_OUT: { value: StoodOut; label: string }[] = [
  { value: 'kept-happening', label: 'Something kept happening' },
  { value: 'played-well', label: 'Something worked' },
  { value: 'decisions', label: 'A decision I want to remember' },
  { value: 'mental', label: 'My mental game' },
  { value: 'not-sure', label: 'Nothing in particular' },
]

export const TRANSFER_FEEL: { value: TransferFeel; label: string }[] = [
  { value: 'clearly-better', label: 'Clearly Better' },
  { value: 'somewhat-better', label: 'Somewhat Better' },
  { value: 'no-change', label: 'No Real Change' },
  { value: 'worse', label: 'Worse' },
  { value: 'not-enough', label: 'Not Enough Evidence' },
]

export const TEST_FOR_AREA: Record<FocusArea, PracticeTestType> = {
  'iron-contact': 'contact',
  'wedge-distance': 'distance',
  'driver-direction': 'direction',
  'putting-speed': 'putting',
  'start-line': 'direction',
  'decision-routine': 'process',
  'mental-reset': 'process',
  custom: 'custom',
}

export const ATTEMPT_OPTIONS: Record<PracticeTestType, string[]> = {
  contact: ['Clean', 'Fat', 'Thin'],
  direction: ['Left', 'Target', 'Right'],
  distance: ['Short', 'Good', 'Long'],
  putting: ['Short', 'Good', 'Long'],
  process: ['Worked', "Didn't Work"],
  custom: ['Worked', "Didn't Work"],
}

export const SUCCESS_FOR_TEST: Record<PracticeTestType, string> = {
  contact: 'Clean',
  direction: 'Target',
  distance: 'Good',
  putting: 'Good',
  process: 'Worked',
  custom: 'Worked',
}

export const DEFAULT_ATTEMPTS = 5

export function practiceResultLine(
  successCount: number,
  total: number,
  success: string,
): string {
  return `${successCount} / ${total} ${success.toLowerCase()}`
}

export function areaLabel(area: FocusArea): string {
  return FOCUS_AREAS.find((item) => item.value === area)?.label ?? area
}

export function typeLabel(type: MomentType): string {
  return MOMENT_TYPES.find((item) => item.value === type)?.label ?? type
}

export function subLabel(type: MomentType, sub: MomentSubcategory): string {
  return SUBS_BY_TYPE[type].find((item) => item.value === sub)?.label ?? sub
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
