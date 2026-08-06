import { getSymptom } from './symptoms'
import type { Drill, SymptomId } from '../types'

export const drills: Drill[] = [
  // —— Slice ——
  {
    id: 'slice-alignment-stick',
    symptomId: 'slice',
    name: 'Alignment stick drill',
    likelyCause: 'Your body aims left while the clubface points right at impact.',
    howTo:
      'Lay one stick on your target line and another along your toes. Hit half-swings matching both lines, then build to full swings.',
    cue: 'Feet, hips, and shoulders square — face follows the line.',
    whyExplanation:
      'A slice often starts with crossed setup: body open, face open. The sticks make that mismatch obvious so you can square up before you swing.',
  },
  {
    id: 'slice-object-avoidance',
    symptomId: 'slice',
    name: 'Object avoidance drill',
    likelyCause: 'The club is cutting across the ball from out to in.',
    howTo:
      'Place a headcover or water bottle just outside the ball and a few inches behind it. Swing without hitting the object. Start slow.',
    cue: 'Swing from inside — miss the object, then the ball.',
    whyExplanation:
      'Coming over the top sends the path left and spins the ball right. Missing the object trains a shallower, more in-to-out feel.',
  },

  // —— Hook ——
  {
    id: 'hook-grip-check',
    symptomId: 'hook',
    name: 'Grip check',
    likelyCause: 'A strong grip is closing the face too early.',
    howTo:
      'Set the club face square, then place your hands so you see about two knuckles on your lead hand. Hit 10 easy shots and notice the start line.',
    cue: 'Softer hands, quieter face through the ball.',
    whyExplanation:
      'When the lead hand sits too far under the grip, the face wants to shut. A neutral grip gives the face a fair chance to stay square.',
  },
  {
    id: 'hook-mirrored-path',
    symptomId: 'hook',
    name: 'Mirrored path drill',
    likelyCause: 'The club is swinging too far from in to out with a closed face.',
    howTo:
      'Place a headcover just inside the ball and slightly behind it. Swing without hitting it — the opposite of the slice avoidance drill. Smooth tempo.',
    cue: 'Feel the club move more around, not under and out.',
    whyExplanation:
      'A hook is often the mirror of a slice: path too far right, face shut. Guarding the inside object softens that extreme path.',
  },

  // —— Fat ——
  {
    id: 'fat-towel-behind',
    symptomId: 'fat',
    name: 'Towel behind the ball',
    likelyCause: 'Low point is behind the ball, so you hit ground first.',
    howTo:
      'Fold a towel a few inches behind the ball. Hit shots without touching the towel. Brush the turf after the ball.',
    cue: 'Ball first, ground second.',
    whyExplanation:
      'Fat contact means the club bottoms out too early. Keeping the towel clean forces the low point forward, where it belongs.',
  },
  {
    id: 'fat-tee-in-front',
    symptomId: 'fat',
    name: 'Tee peg in front',
    likelyCause: 'You’re hanging back instead of moving through the shot.',
    howTo:
      'Stick a tee a couple inches in front of the ball on the target side. Try to clip the tee after you hit the ball.',
    cue: 'Finish past the ball — clip the tee.',
    whyExplanation:
      'Weight stuck on the trail side drops the club early. Reaching the front tee nudges pressure and low point forward.',
  },

  // —— Thin ——
  {
    id: 'thin-tee-under',
    symptomId: 'thin',
    name: 'Tee under the ball',
    likelyCause: 'You’re lifting up through impact instead of staying down.',
    howTo:
      'Tee the ball very low, almost resting on the grass. Hit irons with the goal of taking a light divot in front of the tee.',
    cue: 'Stay down — brush turf past the ball.',
    whyExplanation:
      'Thin shots come from catching the equator. A low tee and a forward brush teach you to keep the club traveling down and through.',
  },
  {
    id: 'thin-towel-low-point',
    symptomId: 'thin',
    name: 'Towel low-point drill',
    likelyCause: 'Your low point is too far ahead or you’re scooping.',
    howTo:
      'Place a towel a few inches in front of the ball. Hit down and through so you miss the towel or barely kiss it after contact.',
    cue: 'Compress, then release — don’t scoop.',
    whyExplanation:
      'Scooping lifts the club and thins the hit. Controlling where the club bottoms out restores solid, slightly descending contact.',
  },

  // —— Chipping ——
  {
    id: 'chip-club-ladder',
    symptomId: 'chipping',
    name: 'Club ladder drill',
    likelyCause: 'Changing technique every chip instead of changing club.',
    howTo:
      'From one spot, hit the same landing spot with three clubs (PW, 9, 8). Same small swing — let loft change the carry.',
    cue: 'One motion, different clubs.',
    whyExplanation:
      'Inconsistent chips often come from inventing a new swing each time. A ladder proves one simple motion can cover more distances.',
  },
  {
    id: 'chip-headcover',
    symptomId: 'chipping',
    name: 'Headcover drill',
    likelyCause: 'Wrists get busy and the low point jumps around.',
    howTo:
      'Tuck a headcover under your lead arm and chip without dropping it. Soft arms, quiet wrists, brush the grass.',
    cue: 'Quiet wrists — body and arms move together.',
    whyExplanation:
      'Flippy wrists make contact random. The headcover keeps the arms connected so the club bottoms out in the same place.',
  },

  // —— Putting ——
  {
    id: 'putt-gate',
    symptomId: 'putting',
    name: 'Gate drill',
    likelyCause: 'The face isn’t square at impact, so putts start offline.',
    howTo:
      'Set two tees just wider than your putter head, a foot in front of the ball. Roll putts through the gate without touching a tee.',
    cue: 'Square face, straight start.',
    whyExplanation:
      'Most missed putts start on the wrong line. A gate gives instant feedback on face and path without overthinking stroke style.',
  },
  {
    id: 'putt-around-the-world',
    symptomId: 'putting',
    name: 'Around the world',
    likelyCause: 'Speed control drifts under pressure or from one distance.',
    howTo:
      'Place balls in a circle 3–5 feet from the hole. Make your way around. Miss one, restart that spot. Stay patient.',
    cue: 'Die the ball at the hole — smooth speed.',
    whyExplanation:
      'Inconsistent putting is often pace, not aim. Around the world builds repeatable speed from short range where confidence matters most.',
  },
]

const MAX_RECOMMENDATIONS = 3

/** Preferred drill order per symptom (most relevant first). */
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

/**
 * Build a short practice plan: 2–3 drills max.
 * Round-robins across selected symptoms so each issue gets a top pick first.
 */
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

export function buildPlanSummary(symptomIds: SymptomId[]): string {
  const labels = symptomIds
    .map((id) => getSymptom(id)?.label.toLowerCase())
    .filter((label): label is string => Boolean(label))

  if (labels.length === 0) {
    return 'Pick a symptom to get today’s practice plan.'
  }

  if (labels.length === 1) {
    return `Today, focus on your ${labels[0]}. Work these drills for about 20 minutes — quality over quantity.`
  }

  return `Today, focus on ${labels[0]} and ${labels[1]}. One solid drill for each, about 25 minutes total.`
}
