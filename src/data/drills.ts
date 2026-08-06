import { getSymptom } from './symptoms'
import type { Drill, SymptomId } from '../types'

export const drills: Drill[] = [
  {
    id: 'slice-alignment-stick',
    symptomId: 'slice',
    name: 'Alignment stick drill',
    goal: 'Stop the slice by aiming your body and clubface at the same target.',
    worksOn: 'both',
    equipment: ['alignment-stick', 'ball'],
    setup:
      'Lay one stick on the ground pointing at your target. Lay a second stick along your toes, parallel to the first. Place the ball between them. Your feet, hips, and shoulders should match the toe stick.',
    view: 'top',
    steps: [
      'Set both sticks parallel, like train tracks to the target.',
      'Hit 10 easy half swings keeping your body square to the sticks.',
      'If the ball starts straighter, build to full swings.',
    ],
    commonMistake: {
      mistake: 'Aiming your feet at the target but leaving the clubface open.',
      instead: 'Check the face first. Then match your feet to the sticks.',
    },
    cue: 'Body and face point the same way.',
    whyItWorks:
      'Most slices start with a crossed setup. The sticks make that mismatch obvious before you swing.',
  },
  {
    id: 'slice-object-avoidance',
    symptomId: 'slice',
    name: 'Object avoidance drill',
    goal: 'Stop cutting across the ball by swinging more from the inside.',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup:
      'Place a headcover (or water bottle) just outside the ball and a few inches behind it. If you swing over the top, you will hit the object. Your job is to miss it, then hit the ball.',
    view: 'top',
    steps: [
      'Place the headcover outside and slightly behind the ball.',
      'Make 8 slow swings that miss the headcover completely.',
      'Hit 10 normal shots still missing the headcover.',
    ],
    commonMistake: {
      mistake: 'Trying to steer the ball left with your hands.',
      instead: 'Miss the object first. Let the path fix the curve.',
    },
    cue: 'Miss the object. Then the ball.',
    whyItWorks:
      'Missing the outside object trains a shallower swing path instead of coming over the top.',
  },
  {
    id: 'hook-grip-check',
    symptomId: 'hook',
    name: 'Grip check',
    goal: 'Quiet a hook by setting a more neutral lead-hand grip.',
    worksOn: 'both',
    equipment: ['ball'],
    setup:
      'Hold the club so the face points straight at your target. Place your lead hand so you can see about two knuckles. The “V” between thumb and finger should point near your trail shoulder—not outside it.',
    view: 'top',
    steps: [
      'Set the face square, then place your hands.',
      'Check for two visible knuckles on the lead hand.',
      'Hit 10 smooth shots and watch the start line.',
    ],
    commonMistake: {
      mistake: 'Twisting the face closed after you set the grip.',
      instead: 'Set the face first. Hands second. Leave them alone.',
    },
    cue: 'Two knuckles. Quiet face.',
    whyItWorks:
      'A grip that is too strong shuts the face early. A neutral grip gives the face a fair chance to stay square.',
  },
  {
    id: 'hook-mirrored-path',
    symptomId: 'hook',
    name: 'Mirrored path drill',
    goal: 'Soften a hook by stopping an extreme inside-to-out swing path.',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup:
      'Place a headcover just inside the ball and slightly behind it—the opposite side from the slice drill. If your path is too far from the inside, you will hit it. Miss the object, then hit the ball.',
    view: 'top',
    steps: [
      'Place the headcover inside and slightly behind the ball.',
      'Make slow swings that miss the inside object.',
      'Hit 10 shots with the same miss-the-object feel.',
    ],
    commonMistake: {
      mistake: 'Blocking the face open to “hold off” the hook.',
      instead: 'Fix the path by missing the inside object. Keep the face quiet.',
    },
    cue: 'Swing around—not under and out.',
    whyItWorks:
      'Guarding the inside object softens an extreme in-to-out path that feeds hooks.',
  },
  {
    id: 'fat-towel-behind',
    symptomId: 'fat',
    name: 'Towel behind the ball',
    goal: 'Improve strike by moving your low point in front of the ball.',
    worksOn: 'both',
    equipment: ['towel', 'ball'],
    setup:
      'Fold a small towel and place it about four inches behind the ball. Hit the ball without touching the towel. You want ball first, then a brush of turf (or mat) after the ball.',
    view: 'side',
    steps: [
      'Place the towel four inches behind the ball.',
      'Hit 10 half swings.',
      'Miss the towel every time.',
    ],
    commonMistake: {
      mistake: 'Hanging back on your trail foot to “help” the ball up.',
      instead: 'Move through the shot. Ball first. Ground second.',
    },
    cue: 'Ball first. Ground second.',
    whyItWorks:
      'Keeping the towel clean forces the club to bottom out ahead of the ball instead of behind it.',
  },
  {
    id: 'fat-tee-in-front',
    symptomId: 'fat',
    name: 'Marker in front',
    goal: 'Stop fat shots by finishing past the ball toward the target.',
    worksOn: 'both',
    matAdjustment:
      'On mats, do not push a tee into the surface. Place a coin, second golf ball, or the tip of an alignment stick a couple inches in front of your ball on the target side.',
    equipment: ['tee', 'coin', 'ball'],
    setup:
      'Put a marker a couple inches in front of the ball toward the target. On grass, use a tee. On mats, use a coin. Try to brush or pass the marker after you hit the ball.',
    view: 'side',
    steps: [
      'Place the marker 2–3 inches in front of the ball.',
      'Hit half swings that pass the marker after contact.',
      'Build to full swings with the same finish-through feel.',
    ],
    commonMistake: {
      mistake: 'Stopping the club at the ball.',
      instead: 'Swing through to the marker. Finish past the ball.',
    },
    cue: 'Finish past the ball.',
    whyItWorks:
      'Reaching a marker in front nudges weight and low point forward so you stop hitting ground first.',
  },
  {
    id: 'thin-tee-under',
    symptomId: 'thin',
    name: 'Low ball drill',
    goal: 'Stop thin shots by staying down through impact.',
    worksOn: 'both',
    matAdjustment:
      'On mats, rest the ball on the mat as low as possible—or on a rubber tee if the bay has one. Focus on brushing the mat just after the ball, not scooping up.',
    equipment: ['tee', 'ball'],
    setup:
      'Place the ball very low. On grass, use a short tee. On mats, rest it nearly on the surface. Your goal is a light brush after the ball—not a scoop.',
    view: 'side',
    steps: [
      'Set the ball as low as you can.',
      'Hit 10 irons with a quiet lower body.',
      'Brush after the ball. Do not lift up early.',
    ],
    commonMistake: {
      mistake: 'Trying to lift the ball into the air.',
      instead: 'Stay down. Let the loft on the club face do the work.',
    },
    cue: 'Stay down through the ball.',
    whyItWorks:
      'Thin contact comes from catching the middle of the ball. Staying down keeps the club traveling through, not up.',
  },
  {
    id: 'thin-towel-low-point',
    symptomId: 'thin',
    name: 'Towel low-point drill',
    goal: 'Control where the club bottoms out so you stop scooping thin shots.',
    worksOn: 'both',
    equipment: ['towel', 'ball'],
    setup:
      'Place a towel a few inches in front of the ball toward the target. Hit down and through. Miss the towel, or barely kiss it after the ball—never hit it before the ball.',
    view: 'side',
    steps: [
      'Place the towel a few inches in front of the ball.',
      'Hit 10 smooth swings.',
      'Contact the ball before the towel every time.',
    ],
    commonMistake: {
      mistake: 'Flipping the wrists to help the ball up.',
      instead: 'Keep the wrists quiet. Compress, then release.',
    },
    cue: 'Compress. Don’t scoop.',
    whyItWorks:
      'Controlling the low point stops the scoop that thins the hit.',
  },
  {
    id: 'chip-club-ladder',
    symptomId: 'chipping',
    name: 'Club ladder drill',
    goal: 'Make chips more consistent by using one motion and changing clubs.',
    worksOn: 'both',
    equipment: ['clubs', 'ball'],
    setup:
      'Pick one landing spot a few paces onto the green (or a towel on the range). From the same lie, chip to that spot with a pitching wedge, then a 9-iron, then an 8-iron. Keep the same small swing.',
    view: 'top',
    steps: [
      'Pick one landing spot and stay there.',
      'Hit 5 chips with PW, then 9-iron, then 8-iron.',
      'Keep the swing size the same. Let loft change the carry.',
    ],
    commonMistake: {
      mistake: 'Inventing a new swing for every distance.',
      instead: 'One motion. Different club.',
    },
    cue: 'One motion. Different clubs.',
    whyItWorks:
      'Changing clubs covers more distances without changing technique every chip.',
  },
  {
    id: 'chip-headcover',
    symptomId: 'chipping',
    name: 'Headcover drill',
    goal: 'Quiet busy wrists so your chipping contact stays predictable.',
    worksOn: 'both',
    equipment: ['headcover', 'ball'],
    setup:
      'Tuck a headcover under your lead arm (the arm closest to the target). Chip without dropping it. Soft arms, quiet wrists, brush the grass or mat.',
    view: 'side',
    steps: [
      'Tuck the headcover under your lead arm.',
      'Hit 10 small chips without dropping it.',
      'Brush the surface. Keep the wrists quiet.',
    ],
    commonMistake: {
      mistake: 'Trying to lift chips with the hands.',
      instead: 'Body and arms move together. Let loft send it up.',
    },
    cue: 'Quiet wrists. Connected arms.',
    whyItWorks:
      'The headcover keeps your arms connected so the club bottoms out in the same place.',
  },
  {
    id: 'putt-gate',
    symptomId: 'putting',
    name: 'Gate drill',
    goal: 'Start putts on line by keeping the face square through a small gate.',
    worksOn: 'both',
    matAdjustment:
      'On mats or carpet, use two coins or tee tips as gate posts if you cannot stick tees in.',
    equipment: ['tee', 'coin', 'ball'],
    setup:
      'Set two tees (or coins) just wider than your putter head, about a foot in front of the ball. Roll putts through the gate without touching either side.',
    view: 'top',
    steps: [
      'Build a gate slightly wider than your putter.',
      'Roll 10 putts through the gate.',
      'If you clip a side, reset and try again slower.',
    ],
    commonMistake: {
      mistake: 'Steering with the hands after impact.',
      instead: 'Square face at the ball. Let it roll through the gate.',
    },
    cue: 'Square face. Straight start.',
    whyItWorks:
      'A gate gives instant feedback on face and start line without overthinking stroke style.',
  },
  {
    id: 'putt-around-the-world',
    symptomId: 'putting',
    name: 'Around the world',
    goal: 'Build reliable short-putt speed and confidence from every angle.',
    worksOn: 'both',
    equipment: ['ball'],
    setup:
      'Place 6–8 balls in a circle 3–5 feet from the hole (or a cup/target on a mat). Work your way around. Miss one? Redo that spot before moving on.',
    view: 'top',
    steps: [
      'Set balls in a circle around the hole.',
      'Make your way around, one ball at a time.',
      'Miss? Restart that spot, then continue.',
    ],
    commonMistake: {
      mistake: 'Banging putts hard to “eliminate break.”',
      instead: 'Die the ball at the hole with smooth speed.',
    },
    cue: 'Die it at the hole.',
    whyItWorks:
      'Short-range circle work builds repeatable pace where most strokes are gained or lost.',
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
  primaryFocus: string
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

  const primaryFocus =
    labels.length === 0
      ? 'Your next range session'
      : labels.length === 1
        ? labels[0].charAt(0).toUpperCase() + labels[0].slice(1)
        : `${labels[0].charAt(0).toUpperCase() + labels[0].slice(1)} · ${labels[1]}`

  const estimatedTime =
    recommended.length >= 3 ? 'About 25 minutes' : 'About 20 minutes'

  const remember =
    recommended[0]?.cue ?? 'One clear feel beats ten swing thoughts.'

  return { goal, estimatedTime, primaryFocus, remember }
}
