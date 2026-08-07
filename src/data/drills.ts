import { getSymptom } from './symptoms'
import type { Drill, SymptomId } from '../types'

/**
 * Curated range drills. Each one coaches a different part of the motion.
 * Written for a mid-handicap alone on mats or grass.
 */
export const drills: Drill[] = [
  {
    id: 'slice-alignment-stick',
    symptomId: 'slice',
    name: 'Alignment stick drill',
    goal: 'Aim your body and clubface at the same target to reduce slices.',
    bodyFocus: 'Aim and setup',
    worksOn: 'both',
    equipment: ['alignment-stick', 'ball'],
    setup: [
      'Lay Stick A on the ground pointing at your target.',
      'Lay Stick B along your toes, parallel to Stick A.',
      'Stand with both feet on Stick B.',
      'Place the ball between the sticks.',
    ],
    view: 'top',
    steps: [
      'Set Stick A at the target. Set Stick B parallel along your toes.',
      'Hit 10 easy half swings. Keep feet on Stick B.',
      'Hit 10 fuller swings only if the start line looks better.',
    ],
    commonMistake: {
      mistake: 'Feet aim at the target while the clubface points right.',
      instead: 'Square the face to Stick A first. Then set your feet on Stick B.',
    },
    cue: 'Body and face point the same way.',
    coachIntro:
      'Before we chase a draw or distance, let\'s get your aim honest.',
    coachSays:
      'Square the face to Stick A. Then set your feet. That\'s the whole start.',
  },
  {
    id: 'slice-object-avoidance',
    symptomId: 'slice',
    name: 'Object avoidance drill',
    goal: 'Train a better swing path to reduce slices.',
    bodyFocus: 'Swing path',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup: [
      'Place a headcover just outside the ball and a little behind it (farther from your body).',
      'If you chop across the ball, you hit the headcover.',
      'Your job: miss the headcover, then hit the ball.',
    ],
    view: 'top',
    steps: [
      'Put the headcover outside and slightly behind the ball.',
      'Make 8 slow swings that miss the headcover.',
      'Hit 10 normal shots still missing the headcover.',
    ],
    commonMistake: {
      mistake: 'Trying to steer the ball left with your hands.',
      instead: 'Miss the red object first. Path first. Hands quiet.',
    },
    cue: 'Miss the object. Then the ball.',
    coachIntro:
      'We\'re starting with path because a cut across the ball feeds the slice.',
    coachSays:
      'Miss the red object first. Hands stay quiet. Path does the work.',
  },
  {
    id: 'hook-finish-position',
    symptomId: 'hook',
    name: 'Finish position drill',
    goal: 'Reduce hooks by rotating through and holding a balanced finish.',
    bodyFocus: 'Finish balance',
    worksOn: 'both',
    equipment: ['ball'],
    setup: [
      'Normal practice setup. No special equipment.',
      'Plan to finish every swing tall, chest facing the target.',
      'Trail foot up. Club wrapping around your body.',
    ],
    view: 'side',
    steps: [
      'Hit controlled half swings.',
      'Finish every swing balanced with your chest facing the target.',
      'Hold the finish for one full second before you reset.',
    ],
    commonMistake: {
      mistake: 'Spinning out early or quitting on the finish.',
      instead: 'Rotate through. Hold a tall, balanced finish.',
    },
    cue: 'Finish tall. Chest to the target.',
    coachIntro:
      'Today we\'re not forcing the release. We\'re finishing in balance.',
    coachSays:
      'Swing through. Hold a tall finish. Chest to the target.',
  },
  {
    id: 'hook-split-hand',
    symptomId: 'hook',
    name: 'Split hand drill',
    goal: 'Calm hands and face control so the clubface does not shut too early.',
    bodyFocus: 'Hands',
    worksOn: 'both',
    equipment: ['ball'],
    setup: [
      'Take your normal grip.',
      'Slide your trail hand down so there is a clear 2-3 inch gap between your hands.',
      'Hit easy half swings with a quieter face through the ball.',
    ],
    view: 'side',
    steps: [
      'Split your hands on the grip with a clear gap between them.',
      'Hit 8 slow half swings. Keep the face from snapping shut.',
      'Hit 8 more at a smooth tempo, still split handed.',
    ],
    commonMistake: {
      mistake: 'Trying to roll the hands harder to “save” the shot.',
      instead: 'Quiet hands. Let the split grip slow the release.',
    },
    cue: 'Quiet hands. Soft face.',
    coachIntro:
      'Before we add speed, let\'s calm the hands that snap the face shut.',
    coachSays:
      'Leave a gap between your hands. Easy half swings. Soft through the ball.',
  },
  {
    id: 'fat-towel-behind',
    symptomId: 'fat',
    name: 'Towel behind the ball',
    goal: 'Improve strike by moving your low point in front of the ball.',
    bodyFocus: 'Where the club hits',
    worksOn: 'both',
    equipment: ['towel', 'ball'],
    setup: [
      'Fold a towel.',
      'Place it about four inches behind the ball.',
      'Hit the ball without touching the towel.',
    ],
    view: 'side',
    steps: [
      'Place the towel four inches behind the ball.',
      'Hit 10 slow half swings.',
      'Miss the towel every swing.',
    ],
    commonMistake: {
      mistake: 'Hanging back to help the ball up.',
      instead: 'Move through the shot. Ball first. Ground second.',
    },
    cue: 'Ball first. Ground second.',
    coachIntro:
      'We\'re starting with strike because nothing else matters until contact improves.',
    coachSays:
      'Ball first. Miss the towel. Don\'t help it up.',
  },
  {
    id: 'fat-tee-in-front',
    symptomId: 'fat',
    name: 'Marker in front',
    goal: 'Stop fat shots by swinging through to a marker past the ball.',
    bodyFocus: 'Swing through',
    worksOn: 'both',
    matAdjustment:
      'On mats, do not push a tee in. Place a coin 2-3 inches in front of the ball toward the target.',
    equipment: ['coin', 'ball'],
    setup: [
      'Place a coin (or tee on grass) 2-3 inches in front of the ball toward the target.',
      'Hit the ball, then let the club pass over that marker.',
      'Finish through the ball. Do not stop at impact.',
    ],
    view: 'side',
    steps: [
      'Place the coin in front of the ball toward the target.',
      'Hit 10 half swings that pass the coin after the ball.',
      'Hit 10 fuller swings with the same finish through feel.',
    ],
    commonMistake: {
      mistake: 'Stopping the club at the ball.',
      instead: 'Swing through to the coin. Finish past the ball.',
    },
    cue: 'Finish past the ball.',
    coachIntro:
      'If you\'re hanging back, let\'s train finishing past the ball.',
    coachSays:
      'Hit it, then pass the coin. Keep moving through.',
  },
  {
    id: 'thin-brush-line',
    symptomId: 'thin',
    name: 'Brush the line',
    goal: 'Stop thin shots by brushing a line on the ground just after the ball.',
    bodyFocus: 'Where the club hits',
    worksOn: 'both',
    matAdjustment:
      'On mats, lay a coin or the edge of a towel as your brush line. Do not dig. Just brush past it after the ball.',
    equipment: ['coin', 'ball'],
    setup: [
      'Place a coin (or towel edge) 1-2 inches in front of the ball toward the target.',
      'That marker is your brush line.',
      'Hit the ball first, then brush the line. Works on mats and grass.',
    ],
    view: 'side',
    steps: [
      'Set the brush line 1-2 inches in front of the ball.',
      'Hit 10 smooth half swings. Ball first, then brush the line.',
      'If you miss the line high, stay down longer on the next swing.',
    ],
    commonMistake: {
      mistake: 'Trying to lift the ball into the air.',
      instead: 'Stay down. Brush the line after the ball. Let loft send it up.',
    },
    cue: 'Ball, then brush the line.',
    coachIntro:
      'Thin shots lift early. We\'re staying down long enough to brush after the ball.',
    coachSays:
      'Ball first. Then brush the line. Let loft send it up.',
  },
  {
    id: 'thin-towel-low-point',
    symptomId: 'thin',
    name: 'Towel ahead drill',
    goal: 'Stop scooping by keeping the wrists quiet through contact.',
    bodyFocus: 'Hands',
    worksOn: 'both',
    equipment: ['towel', 'ball'],
    setup: [
      'Place a towel a few inches in front of the ball toward the target.',
      'Hit the ball first with quiet wrists.',
      'Miss the towel, or barely touch it after the ball.',
    ],
    view: 'side',
    steps: [
      'Place the towel a few inches in front of the ball.',
      'Hit 10 smooth swings with quiet wrists.',
      'Ball first. Towel second, or not at all.',
    ],
    commonMistake: {
      mistake: 'Flipping the wrists to help the ball up.',
      instead: 'Quiet wrists. Hit down and through.',
    },
    cue: 'Compress. Don’t scoop.',
    coachIntro:
      'Scooping thins the shot. Quiet wrists. Compress, don\'t flip.',
    coachSays:
      'Ball first. Towel second. Stay patient through impact.',
  },
  {
    id: 'chip-headcover',
    symptomId: 'chipping',
    name: 'Headcover under arm',
    goal: 'Quiet busy wrists so chip contact stays predictable.',
    bodyFocus: 'Connected arms',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup: [
      'Tuck a headcover under your lead arm (closer to the target).',
      'Chip without dropping it.',
      'Soft arms. Quiet hands.',
    ],
    view: 'side',
    steps: [
      'Tuck the headcover under your lead arm.',
      'Hit 10 small chips without dropping it.',
      'Brush the mat or grass. Keep wrists quiet.',
    ],
    commonMistake: {
      mistake: 'Trying to lift chips with the hands.',
      instead: 'Arms and body move together. Loft sends it up.',
    },
    cue: 'Quiet wrists. Connected arms.',
    coachIntro:
      'Busy hands make chips unpredictable. We\'re connecting the arms first.',
    coachSays:
      'Soft chips. Keep the headcover tucked. Same motion every time.',
  },
  {
    id: 'chip-wedge-ladder',
    symptomId: 'chipping',
    name: 'One wedge ladder',
    goal: 'Control chip distance with one wedge and three swing lengths.',
    bodyFocus: 'Distance',
    worksOn: 'both',
    equipment: ['clubs', 'ball'],
    setup: [
      'Use your most common wedge (usually 54, 56, or 58).',
      'Stay in one spot. Pick three landing distances: short, medium, and long.',
      'Same club every shot. Change only how long the swing is.',
    ],
    view: 'top',
    steps: [
      'Pick your everyday wedge and stay put.',
      'Hit 5 short chips to a near landing spot.',
      'Hit 5 medium, then 5 longer, still with the same wedge.',
    ],
    commonMistake: {
      mistake: 'Changing clubs or inventing a new motion for every distance.',
      instead: 'One wedge. Three swing lengths. Same landing feel.',
    },
    cue: 'One wedge. Three distances.',
    coachIntro:
      'Today\'s goal isn\'t perfect chips. It\'s one wedge and clear distances.',
    coachSays:
      'Same club. Change only swing length. Short, medium, then long.',
  },
  {
    id: 'putt-lag-ladder',
    symptomId: 'putting',
    name: 'Lag putting ladder',
    goal: 'Train speed and distance control on longer putts.',
    bodyFocus: 'Speed',
    worksOn: 'both',
    equipment: ['ball'],
    setup: [
      'Pick a hole or a coin target.',
      'Mark three distances (about 15, 25, and 35 feet, or three clear spots).',
      'Putt short to long. Die the ball near the hole. Holing is a bonus.',
    ],
    view: 'top',
    steps: [
      'Set three distances to the same target.',
      'Putt 4 balls from the short spot, then medium, then long.',
      'Count leaves inside a 3 foot circle around the hole.',
    ],
    commonMistake: {
      mistake: 'Banging long putts and racing them past.',
      instead: 'Smooth tempo. Die the ball near the hole.',
    },
    cue: 'Die it near the hole.',
    coachIntro:
      'Don\'t try to make everything. We\'re training speed that dies near the hole.',
    coachSays:
      'Smooth tempo. Soft finish. Leave it close.',
  },
  {
    id: 'putt-start-line-gate',
    symptomId: 'putting',
    name: 'Start line gate',
    goal: 'Start putts on line with a square face through a gate ahead of the ball.',
    bodyFocus: 'Start line',
    worksOn: 'both',
    matAdjustment:
      'On mats, use two coins as the gate if you cannot stick tees in.',
    equipment: ['two-tees', 'coin', 'ball'],
    setup: [
      'Place two tees (or coins) as a narrow gate about 2-3 feet in front of the ball.',
      'Put the gate on your start line, ahead of the ball, not around the putter.',
      'Roll the ball through the gate toward the hole.',
    ],
    view: 'top',
    steps: [
      'Build a gate 2-3 feet in front of the ball on your start line.',
      'Roll 10 putts through the gate without touching either side.',
      'Clip a side? Slow down and square the face again.',
    ],
    commonMistake: {
      mistake: 'Building the gate around the putter head.',
      instead: 'Put the gate 2-3 feet ahead so you train where the ball starts.',
    },
    cue: 'Square face. Clean start.',
    coachIntro:
      'Before we worry about breaking putts, let\'s start them on line.',
    coachSays:
      'Square face. Roll it clean through the gate. That\'s the whole job.',
  },
]

const MAX_RECOMMENDATIONS = 3

const drillsBySymptomId: Record<SymptomId, string[]> = {
  slice: ['slice-alignment-stick', 'slice-object-avoidance'],
  hook: ['hook-finish-position', 'hook-split-hand'],
  fat: ['fat-towel-behind', 'fat-tee-in-front'],
  thin: ['thin-brush-line', 'thin-towel-low-point'],
  chipping: ['chip-headcover', 'chip-wedge-ladder'],
  putting: ['putt-lag-ladder', 'putt-start-line-gate'],
}

/** Old session / library IDs → current drills. */
const retiredDrillIds: Record<string, string> = {
  'hook-grip-check': 'hook-finish-position',
  'hook-mirrored-path': 'hook-split-hand',
  'thin-tee-under': 'thin-brush-line',
  'chip-club-ladder': 'chip-wedge-ladder',
  'putt-gate': 'putt-start-line-gate',
  'putt-around-the-world': 'putt-lag-ladder',
}

export function resolveDrillId(id: string): string {
  return retiredDrillIds[id] ?? id
}

export function getDrillById(id: string): Drill | undefined {
  const resolved = resolveDrillId(id)
  return drills.find((drill) => drill.id === resolved)
}

export function getDrillsBySymptom(symptomId: SymptomId): Drill[] {
  const order = drillsBySymptomId[symptomId] ?? []
  return order
    .map((id) => getDrillById(id))
    .filter((drill): drill is Drill => drill !== undefined)
}

export function getDrillsForSymptoms(symptomIds: SymptomId[]): Drill[] {
  const uniqueIds = [...new Set(symptomIds)]
  const lists = uniqueIds.map((id) => getDrillsBySymptom(id))

  const selected: Drill[] = []
  const seen = new Set<string>()
  let depth = 0
  let madeProgress = true

  while (selected.length < MAX_RECOMMENDATIONS && madeProgress) {
    madeProgress = false
    for (const list of lists) {
      const drill = list[depth]
      if (!drill || seen.has(drill.id)) continue
      seen.add(drill.id)
      selected.push(drill)
      madeProgress = true
      if (selected.length >= MAX_RECOMMENDATIONS) break
    }
    depth += 1
  }

  return selected
}

export interface PracticePrescription {
  goal: string
  estimatedTime: string
  primaryFocus: string
  remember: string
}

export interface PracticeOrderStep {
  number: number
  title: string
  detail: string
}

export interface ChecklistItem {
  id: string
  label: string
}

export function buildPrescription(
  symptomIds: SymptomId[],
  recommended: Drill[],
): PracticePrescription {
  const labels = symptomIds
    .map((id) => getSymptom(id)?.label.toLowerCase())
    .filter((label): label is string => Boolean(label))

  let goal = 'Leave with one clearer feel.'
  if (labels.length === 1) {
    goal = `Fix your ${labels[0]} today.`
  } else if (labels.length >= 2) {
    goal = `Work your ${labels[0]} and ${labels[1]} with calm focus.`
  }

  const primaryFocus =
    labels.length === 0
      ? 'Your next range session'
      : labels.length === 1
        ? labels[0].charAt(0).toUpperCase() + labels[0].slice(1)
        : `${labels[0].charAt(0).toUpperCase() + labels[0].slice(1)} · ${labels[1]}`

  const minutes = recommended.reduce((sum, drill) => {
    const adapted = drill as Drill & { estimatedMinutes?: number }
    return sum + (adapted.estimatedMinutes ?? 5)
  }, 0)
  const total = Math.max(minutes, recommended.length * 4)
  const estimatedTime = `${Math.max(10, total - 3)}-${total + 3} minutes`

  const remember =
    recommended[0]?.cue ?? 'One clear feel beats ten swing thoughts.'

  return { goal, estimatedTime, primaryFocus, remember }
}

export function buildPracticeOrder(recommended: Drill[]): PracticeOrderStep[] {
  const steps: PracticeOrderStep[] = []
  let n = 1

  recommended.forEach((drill, index) => {
    const adapted = drill as Drill & {
      objective?: string
      successCondition?: string
      templateLabel?: string
    }
    const challengeLabel = adapted.templateLabel ?? `Challenge ${index + 1}`

    steps.push({
      number: n++,
      title: drill.name,
      detail: adapted.objective
        ? `${challengeLabel}. ${adapted.objective}`
        : `Set up and complete ${drill.name}.`,
    })

    steps.push({
      number: n++,
      title: 'Complete the challenge',
      detail: adapted.successCondition
        ? `You're ready when: ${adapted.successCondition}`
        : 'Finish the challenge, then move on.',
    })
  })

  return steps
}

export function buildChecklist(recommended: Drill[]): ChecklistItem[] {
  return recommended.map((drill) => ({
    id: `drill-${drill.id}`,
    label: drill.name,
  }))
}
