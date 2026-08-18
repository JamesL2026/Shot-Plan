import type {
  FocusArea,
  MomentSubcategory,
  MomentType,
  StoodOut,
  TestKind,
  TransferFeel,
} from '../types/memory'

export const momentTypes: {
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

export const momentSubcategories: Record<
  MomentType,
  { value: MomentSubcategory; label: string }[]
> = {
  shot: [
    { value: 'fat', label: 'Fat' },
    { value: 'thin', label: 'Thin' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'poor-distance', label: 'Poor Distance' },
    { value: 'poor-contact', label: 'Poor Contact' },
    { value: 'other', label: 'Other' },
  ],
  decision: [
    { value: 'wrong-club', label: 'Wrong Club' },
    { value: 'wrong-target', label: 'Wrong Target' },
    { value: 'too-aggressive', label: 'Too Aggressive' },
    { value: 'hero-shot', label: 'Hero Shot' },
    { value: 'other', label: 'Other' },
  ],
  mental: [
    { value: 'rushed', label: 'Rushed' },
    { value: 'lost-focus', label: 'Lost Focus' },
    { value: 'frustrated', label: 'Frustrated' },
    { value: 'poor-routine', label: 'Poor Routine' },
    { value: 'other', label: 'Other' },
  ],
  good: [
    { value: 'great-drive', label: 'Great Drive' },
    { value: 'great-approach', label: 'Great Approach' },
    { value: 'great-wedge', label: 'Great Wedge' },
    { value: 'great-save', label: 'Great Save' },
    { value: 'great-putt', label: 'Great Putt' },
    { value: 'great-decision', label: 'Great Decision' },
    { value: 'reset-well', label: 'Reset Well' },
    { value: 'other', label: 'Other' },
  ],
}

export const focusOptions: { value: FocusArea; label: string }[] = [
  { value: 'iron-contact', label: 'Iron Contact' },
  { value: 'wedge-distance', label: 'Wedge Distance' },
  { value: 'driver-direction', label: 'Driver Direction' },
  { value: 'putting-speed', label: 'Putting Speed' },
  { value: 'start-line', label: 'Start Line' },
  { value: 'decision-routine', label: 'Decision Making' },
  { value: 'mental-reset', label: 'Mental Reset' },
  { value: 'custom', label: 'Other' },
]

export const stoodOutOptions: { value: StoodOut; label: string }[] = [
  { value: 'kept-happening', label: 'Something kept happening' },
  { value: 'played-well', label: 'Something worked' },
  { value: 'decisions', label: 'A decision I want to remember' },
  { value: 'mental', label: 'My mental game' },
  { value: 'not-sure', label: 'Nothing in particular' },
]

export const transferFeelOptions: { value: TransferFeel; label: string }[] = [
  { value: 'clearly-better', label: 'Clearly Better' },
  { value: 'somewhat-better', label: 'Somewhat Better' },
  { value: 'no-change', label: 'No Real Change' },
  { value: 'worse', label: 'Worse' },
  { value: 'not-enough', label: 'Not Enough Evidence' },
]

export const testKindByArea: Record<FocusArea, TestKind> = {
  'iron-contact': 'contact',
  'wedge-distance': 'distance',
  'driver-direction': 'direction',
  'putting-speed': 'putting',
  'start-line': 'direction',
  'decision-routine': 'process',
  'mental-reset': 'process',
  custom: 'custom',
}

export const testOptionsByKind: Record<TestKind, string[]> = {
  contact: ['Clean', 'Fat', 'Thin'],
  direction: ['Left', 'Target', 'Right'],
  distance: ['Short', 'Good', 'Long'],
  putting: ['Short', 'Good', 'Long'],
  process: ['Worked', "Didn't Work"],
  custom: ['Worked', "Didn't Work"],
}

export const successLabelByKind: Record<TestKind, string> = {
  contact: 'Clean',
  direction: 'Target',
  distance: 'Good',
  putting: 'Good',
  process: 'Worked',
  custom: 'Worked',
}

export function formatPracticeScore(
  success: number,
  attempts: number,
  label: string,
) {
  return `${success} / ${attempts} ${label.toLowerCase()}`
}

export function focusTitle(area: FocusArea) {
  return focusOptions.find((option) => option.value === area)?.label ?? area
}

export function momentTypeLabel(type: MomentType) {
  return momentTypes.find((option) => option.value === type)?.label ?? type
}

export function momentSubcategoryLabel(
  type: MomentType,
  subcategory: MomentSubcategory,
) {
  return (
    momentSubcategories[type].find((option) => option.value === subcategory)
      ?.label ?? subcategory
  )
}

export function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
