import { getSymptom } from './symptoms'
import type { Drill, SymptomId } from '../types'

/**
 * Mainstream range drills, written for a 15-handicap alone on mats.
 * Purpose preserved; wording optimized for instant setup clarity.
 */
export const drills: Drill[] = [
  {
    id: 'slice-alignment-stick',
    symptomId: 'slice',
    name: 'Alignment stick drill',
    goal: 'Aim your body and clubface at the same target to reduce slices.',
    worksOn: 'both',
    equipment: ['alignment-stick', 'ball'],
    setup:
      'Lay Stick A on the ground pointing at your target. Lay Stick B along your toes, parallel to Stick A. Stand with both feet on Stick B. Place the ball between the sticks.',
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
    whyItWorks:
      'The sticks show a crossed setup before you swing, so you can fix aim, not guess.',
  },
  {
    id: 'slice-object-avoidance',
    symptomId: 'slice',
    name: 'Object avoidance drill',
    goal: 'Train a better swing path to reduce slices.',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup:
      'Place a headcover just outside the ball and a little behind it (farther from your body). If you chop across the ball, you hit the headcover. Your job: miss the headcover, then hit the ball.',
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
    whyItWorks:
      'Missing the outside object stops the over-the-top cut that creates a slice.',
  },
  {
    id: 'hook-finish-position',
    symptomId: 'hook',
    name: 'Finish position drill',
    goal: 'Reduce hooks by improving body rotation and club release.',
    worksOn: 'both',
    equipment: ['ball'],
    setup:
      'Normal practice setup. No special equipment required. Take your usual address and plan to finish every swing in balance.',
    view: 'side',
    steps: [
      'Hit controlled half swings.',
      'Finish every swing balanced with your chest facing the target.',
      'Let the club finish around your body instead of getting stuck behind you.',
    ],
    commonMistake: {
      mistake: 'Spinning out early or quitting on the finish.',
      instead: 'Rotate through. Hold a tall, balanced finish.',
    },
    cue: 'Finish tall. Chest to the target.',
    whyItWorks:
      'A balanced finish encourages a more neutral path and reduces excessive clubface closure.',
  },
  {
    id: 'hook-mirrored-path',
    symptomId: 'hook',
    name: 'Inside object drill',
    goal: 'Soften a path that is too far from the inside, which feeds hooks.',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup:
      'Place a headcover just inside the ball and a little behind it (closer to your body). If the club attacks too far from the inside, you hit it. Miss the headcover, then hit the ball.',
    view: 'top',
    steps: [
      'Put the headcover inside and slightly behind the ball.',
      'Make 8 slow swings that miss it.',
      'Hit 10 normal shots with the same miss-it feel.',
    ],
    commonMistake: {
      mistake: 'Holding the face open to “save” a hook.',
      instead: 'Miss the inside object. Keep the face quiet.',
    },
    cue: 'Swing around, not under and out.',
    whyItWorks:
      'Guarding the inside object softens an extreme path that closes the face through impact.',
  },
  {
    id: 'fat-towel-behind',
    symptomId: 'fat',
    name: 'Towel behind the ball',
    goal: 'Improve strike by moving your low point in front of the ball.',
    worksOn: 'both',
    equipment: ['towel', 'ball'],
    setup:
      'Fold a towel. Place it about four inches behind the ball. Hit the ball without touching the towel.',
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
    whyItWorks:
      'If the towel stays clean, the club is bottoming out after the ball, not before.',
  },
  {
    id: 'fat-tee-in-front',
    symptomId: 'fat',
    name: 'Marker in front',
    goal: 'Stop fat shots by swinging through to a marker past the ball.',
    worksOn: 'both',
    matAdjustment:
      'On mats, do not push a tee in. Place a coin 2-3 inches in front of the ball toward the target.',
    equipment: ['coin', 'ball'],
    setup:
      'Place a coin (or tee on grass) 2-3 inches in front of the ball toward the target. After you hit the ball, your club should pass over that marker.',
    view: 'side',
    steps: [
      'Place the coin in front of the ball toward the target.',
      'Hit 10 half swings that pass the coin after the ball.',
      'Hit 10 fuller swings with the same finish-through feel.',
    ],
    commonMistake: {
      mistake: 'Stopping the club at the ball.',
      instead: 'Swing through to the coin. Finish past the ball.',
    },
    cue: 'Finish past the ball.',
    whyItWorks:
      'Reaching a marker in front moves pressure and contact forward, so you stop hitting ground first.',
  },
  {
    id: 'thin-tee-under',
    symptomId: 'thin',
    name: 'Low ball drill',
    goal: 'Stop thin shots by staying down through the hit.',
    worksOn: 'both',
    matAdjustment:
      'On mats, rest the ball as low as possible on the mat. Focus on brushing the mat just after the ball.',
    equipment: ['ball'],
    setup:
      'Place the ball very low on the mat (or on a short tee in grass). Do not try to lift it. Brush the surface after the ball.',
    view: 'side',
    steps: [
      'Set the ball as low as you can.',
      'Hit 10 irons with a smooth tempo.',
      'Brush after the ball. Do not lift up early.',
    ],
    commonMistake: {
      mistake: 'Trying to lift the ball into the air.',
      instead: 'Stay down. Let the loft on the club send it up.',
    },
    cue: 'Stay down through the ball.',
    whyItWorks:
      'Lifting early catches the middle of the ball. Staying down keeps the club moving through.',
  },
  {
    id: 'thin-towel-low-point',
    symptomId: 'thin',
    name: 'Towel ahead drill',
    goal: 'Stop scooping by controlling where the club bottoms out.',
    worksOn: 'both',
    equipment: ['towel', 'ball'],
    setup:
      'Place a towel a few inches in front of the ball toward the target. Hit the ball first. Miss the towel, or barely touch it after the ball.',
    view: 'side',
    steps: [
      'Place the towel a few inches in front of the ball.',
      'Hit 10 smooth swings.',
      'Ball first. Towel second, or not at all.',
    ],
    commonMistake: {
      mistake: 'Flipping the wrists to help the ball up.',
      instead: 'Quiet wrists. Hit down and through.',
    },
    cue: 'Compress. Don’t scoop.',
    whyItWorks:
      'When the ball comes before the towel, you are no longer scooping thin.',
  },
  {
    id: 'chip-club-ladder',
    symptomId: 'chipping',
    name: 'Club ladder drill',
    goal: 'Make chips more consistent with one motion and different clubs.',
    worksOn: 'both',
    equipment: ['clubs', 'ball'],
    setup:
      'Pick one landing spot. From the same place, chip to that spot with a pitching wedge, then a 9-iron, then an 8-iron. Keep the same small swing size.',
    view: 'top',
    steps: [
      'Pick one landing spot and stay put.',
      'Hit 5 chips with PW, then 9-iron, then 8-iron.',
      'Same swing size each time. Change only the club.',
    ],
    commonMistake: {
      mistake: 'A new swing for every distance.',
      instead: 'One motion. Different club.',
    },
    cue: 'One motion. Different clubs.',
    whyItWorks:
      'Changing clubs covers more distances without inventing a new technique each time.',
  },
  {
    id: 'chip-headcover',
    symptomId: 'chipping',
    name: 'Headcover under arm',
    goal: 'Quiet busy wrists so chip contact stays predictable.',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup:
      'Tuck a headcover under your lead arm (the arm closer to the target). Chip without dropping it. Soft arms. Quiet hands.',
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
    whyItWorks:
      'The headcover keeps your arms connected so the club bottoms out in the same place.',
  },
  {
    id: 'putt-gate',
    symptomId: 'putting',
    name: 'Gate drill',
    goal: 'Start putts on line with a square face through a small gate.',
    worksOn: 'both',
    matAdjustment:
      'On mats, use two coins as the gate if you cannot stick tees in.',
    equipment: ['two-tees', 'coin', 'ball'],
    setup:
      'Place two tees (or coins) just wider than your putter, about one foot in front of the ball. Roll the ball through the gate without touching either side.',
    view: 'top',
    steps: [
      'Build a gate slightly wider than your putter.',
      'Roll 10 putts through the gate.',
      'Clip a side? Slow down and try again.',
    ],
    commonMistake: {
      mistake: 'Steering with the hands after the hit.',
      instead: 'Square face at the ball. Let it roll through.',
    },
    cue: 'Square face. Straight start.',
    whyItWorks:
      'The gate gives instant feedback on face and start line. No guesswork.',
  },
  {
    id: 'putt-around-the-world',
    symptomId: 'putting',
    name: 'Around the world',
    goal: 'Build short-putt speed and confidence from every angle.',
    worksOn: 'both',
    equipment: ['ball'],
    setup:
      'Place 6-8 balls in a circle 3-5 feet from a hole or cup target. Go around the circle. Miss one? Redo that spot before moving on.',
    view: 'top',
    steps: [
      'Set balls in a circle around the hole.',
      'Putt one ball at a time around the circle.',
      'Miss? Redo that spot, then continue.',
    ],
    commonMistake: {
      mistake: 'Banging putts hard to remove break.',
      instead: 'Die the ball at the hole with smooth speed.',
    },
    cue: 'Die it at the hole.',
    whyItWorks:
      'Short circle work builds the pace that saves the most strokes.',
  },
]

const MAX_RECOMMENDATIONS = 3

const drillsBySymptomId: Record<SymptomId, string[]> = {
  slice: ['slice-alignment-stick', 'slice-object-avoidance'],
  hook: ['hook-finish-position', 'hook-mirrored-path'],
  fat: ['fat-towel-behind', 'fat-tee-in-front'],
  thin: ['thin-tee-under', 'thin-towel-low-point'],
  chipping: ['chip-club-ladder', 'chip-headcover'],
  putting: ['putt-gate', 'putt-around-the-world'],
}

export function getDrillById(id: string): Drill | undefined {
  // Old sessions may still reference the retired grip-check primary drill.
  const resolved = id === 'hook-grip-check' ? 'hook-finish-position' : id
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

  let goal = 'Leave the range with one clearer feel.'
  if (labels.length === 1) {
    goal = `Improve your ${labels[0]} with a focused coaching session.`
  } else if (labels.length >= 2) {
    goal = `Improve your ${labels[0]} and ${labels[1]} with clear challenges.`
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
        ? `Success: ${adapted.successCondition}`
        : drill.steps.slice(1).join(' '),
    })
  })

  const last = recommended[recommended.length - 1] as
    | (Drill & { reflection?: string })
    | undefined

  steps.push({
    number: n++,
    title: 'Final reflection',
    detail:
      last?.reflection ??
      'Did contact improve? Note one thing that worked.',
  })

  return steps
}

export function buildChecklist(recommended: Drill[]): ChecklistItem[] {
  return recommended.map((drill, index) => ({
    id: `drill-${drill.id}`,
    label: `Challenge ${index + 1}: ${drill.name}`,
  }))
}
