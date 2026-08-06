import { getSymptom } from './symptoms'
import type { Drill, SymptomId } from '../types'

export const drills: Drill[] = [
  // —— Slice ——
  {
    id: 'slice-alignment-stick',
    symptomId: 'slice',
    name: 'Alignment stick drill',
    likelyCause: 'Body aims left while the face points right.',
    steps: [
      'Lay one stick on the target line.',
      'Lay a second stick along your toes.',
      'Hit half-swings square to both lines, then build speed.',
    ],
    cue: 'Feet, hips, shoulders square — face follows the line.',
    whyItWorks:
      'The sticks make a crossed setup obvious so you can square up before you swing.',
    equipment: ['alignment-stick', 'ball'],
  },
  {
    id: 'slice-object-avoidance',
    symptomId: 'slice',
    name: 'Object avoidance drill',
    likelyCause: 'The club is cutting across the ball from out to in.',
    steps: [
      'Place a headcover just outside and behind the ball.',
      'Make slow swings that miss the object.',
      'Build to normal tempo while still missing it.',
    ],
    cue: 'Swing from inside — miss the object, then the ball.',
    whyItWorks:
      'Missing the outside object trains a shallower path instead of coming over the top.',
    equipment: ['headcover', 'ball'],
  },

  // —— Hook ——
  {
    id: 'hook-grip-check',
    symptomId: 'hook',
    name: 'Grip check',
    likelyCause: 'A strong grip is shutting the face too early.',
    steps: [
      'Set the face square to the target.',
      'Place the lead hand so you see about two knuckles.',
      'Hit 10 easy shots and watch the start line.',
    ],
    cue: 'Softer hands, quieter face through the ball.',
    whyItWorks:
      'A more neutral grip gives the face a fair chance to stay square at impact.',
    equipment: ['ball'],
  },
  {
    id: 'hook-mirrored-path',
    symptomId: 'hook',
    name: 'Mirrored path drill',
    likelyCause: 'Path is too far in-to-out with a closed face.',
    steps: [
      'Place a headcover just inside and behind the ball.',
      'Swing without touching it — the mirror of the slice drill.',
      'Keep tempo smooth and notice a softer curve.',
    ],
    cue: 'Feel the club move more around, not under and out.',
    whyItWorks:
      'Guarding the inside object softens an extreme in-to-out path that feeds hooks.',
    equipment: ['headcover', 'ball'],
  },

  // —— Fat ——
  {
    id: 'fat-towel-behind',
    symptomId: 'fat',
    name: 'Towel behind the ball',
    likelyCause: 'Low point is behind the ball — ground first.',
    steps: [
      'Fold a towel a few inches behind the ball.',
      'Hit shots without touching the towel.',
      'Brush the turf after the ball, not before.',
    ],
    cue: 'Ball first, ground second.',
    whyItWorks:
      'Keeping the towel clean forces the club to bottom out forward of the ball.',
    equipment: ['towel', 'ball'],
  },
  {
    id: 'fat-tee-in-front',
    symptomId: 'fat',
    name: 'Tee peg in front',
    likelyCause: 'You’re hanging back instead of moving through.',
    steps: [
      'Stick a tee a couple inches in front of the ball.',
      'Swing through and try to clip the tee after contact.',
      'Feel pressure shift toward the target.',
    ],
    cue: 'Finish past the ball — clip the tee.',
    whyItWorks:
      'Reaching the front tee nudges weight and low point forward through impact.',
    equipment: ['tee', 'ball'],
  },

  // —— Thin ——
  {
    id: 'thin-tee-under',
    symptomId: 'thin',
    name: 'Tee under the ball',
    likelyCause: 'You’re lifting up through impact.',
    steps: [
      'Tee the ball very low, almost on the grass.',
      'Hit irons with a light brush after the ball.',
      'Leave a small mark in front of the tee.',
    ],
    cue: 'Stay down — brush turf past the ball.',
    whyItWorks:
      'A low tee plus a forward brush keeps the club traveling down through contact.',
    equipment: ['tee', 'ball'],
  },
  {
    id: 'thin-towel-low-point',
    symptomId: 'thin',
    name: 'Towel low-point drill',
    likelyCause: 'You’re scooping or the low point jumps around.',
    steps: [
      'Place a towel a few inches in front of the ball.',
      'Hit down and through without scooping.',
      'Miss the towel or barely kiss it after contact.',
    ],
    cue: 'Compress, then release — don’t scoop.',
    whyItWorks:
      'Controlling where the club bottoms out restores solid, slightly descending contact.',
    equipment: ['towel', 'ball'],
  },

  // —— Chipping ——
  {
    id: 'chip-club-ladder',
    symptomId: 'chipping',
    name: 'Club ladder drill',
    likelyCause: 'Changing your swing every chip instead of the club.',
    steps: [
      'Pick one landing spot near the green.',
      'Hit it with a PW, then 9-iron, then 8-iron.',
      'Keep the same small motion — let loft change carry.',
    ],
    cue: 'One motion, different clubs.',
    whyItWorks:
      'One simple motion covers more distances when you change clubs, not technique.',
    equipment: ['clubs', 'ball'],
  },
  {
    id: 'chip-headcover',
    symptomId: 'chipping',
    name: 'Headcover drill',
    likelyCause: 'Busy wrists make the low point jump around.',
    steps: [
      'Tuck a headcover under your lead arm.',
      'Chip without dropping it.',
      'Brush the grass with quiet wrists.',
    ],
    cue: 'Quiet wrists — body and arms move together.',
    whyItWorks:
      'The headcover keeps the arms connected so contact stays in the same place.',
    equipment: ['headcover', 'ball'],
  },

  // —— Putting ——
  {
    id: 'putt-gate',
    symptomId: 'putting',
    name: 'Gate drill',
    likelyCause: 'The face isn’t square, so putts start offline.',
    steps: [
      'Set two tees just wider than the putter, a foot ahead.',
      'Roll putts through the gate.',
      'Restart if you clip a tee.',
    ],
    cue: 'Square face, straight start.',
    whyItWorks:
      'A gate gives instant feedback on face and start line without overthinking the stroke.',
    equipment: ['tee', 'ball'],
  },
  {
    id: 'putt-around-the-world',
    symptomId: 'putting',
    name: 'Around the world',
    likelyCause: 'Speed control drifts from hole to hole.',
    steps: [
      'Place balls in a circle 3–5 feet from the hole.',
      'Make your way around the circle.',
      'Miss one? Restart that spot, then continue.',
    ],
    cue: 'Die the ball at the hole — smooth speed.',
    whyItWorks:
      'Short-range circle work builds repeatable pace where confidence matters most.',
    equipment: ['ball'],
  },
]

const MAX_RECOMMENDATIONS = 3

const drillsBySymptomId: Record<SymptomId, string[]> = {
  slice: ['slice-alignment-stick', 'slice-object-avoidance'],
  hook: ['hook-grip-check', 'hook-mirrored-path'],
  fat: ['fat-towel-behind', 'fat-tee-in-front'],
  thin: ['thin-tee-under', 'thin-towel-low-point'],
  chipping: ['chip-club-ladder', 'chip-headcover'],
  putting: ['putt-gate', 'putt-around-the-world'],
}

export function getDrillById(id: string): Drill | undefined {
  return drills.find((drill) => drill.id === id)
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
  remember: string
}

export function buildPrescription(
  symptomIds: SymptomId[],
  recommended: Drill[],
): PracticePrescription {
  const labels = symptomIds
    .map((id) => getSymptom(id)?.label.toLowerCase())
    .filter((label): label is string => Boolean(label))

  let goal = 'Build a clearer, more repeatable strike.'
  if (labels.length === 1) {
    goal = `Settle your ${labels[0]} with focused, quality reps.`
  } else if (labels.length >= 2) {
    goal = `Settle your ${labels[0]} and ${labels[1]} with two clear feels.`
  }

  const estimatedTime =
    recommended.length >= 3 ? 'About 25 minutes' : 'About 20 minutes'

  const remember =
    recommended[0]?.cue ?? 'One clear feel beats ten swing thoughts.'

  return { goal, estimatedTime, remember }
}
