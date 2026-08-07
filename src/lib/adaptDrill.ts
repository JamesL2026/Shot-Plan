import { formatClubFocusLabel } from '../data/clubFocus'
import type {
  AdaptedDrill,
  ClubFocus,
  ClubFocusBySymptom,
  DiagramVariant,
  Drill,
} from '../types'

type Patch = Partial<
  Pick<Drill, 'setup' | 'cue' | 'matAdjustment' | 'goal'>
> & { diagramVariant?: DiagramVariant }

function driverTeeMatNote(): string {
  return 'On mats, you usually cannot use a real tee. Rest the ball on a rubber tee insert if the bay has one, or place it on a low spot on the mat and keep the same ball position.'
}

function resolveVariant(focus: ClubFocus | undefined): DiagramVariant {
  if (!focus || focus === 'both') return 'default'
  if (focus === 'driver') return 'driver'
  if (focus === 'wedges') return 'wedges'
  return 'irons'
}

const patches: Record<string, Partial<Record<ClubFocus, Patch>>> = {
  'slice-alignment-stick': {
    driver: {
      diagramVariant: 'driver',
      setup:
        'Tee the ball up (or use a mat tee insert). Lay Stick A at the target. Lay Stick B along your toes, parallel to Stick A. Take a wider driver stance with both feet on Stick B. Play the ball near your lead heel, between the sticks.',
      cue: 'Wide stance. Ball near lead heel. Body and face match.',
      matAdjustment: driverTeeMatNote(),
    },
    irons: {
      diagramVariant: 'irons',
      setup:
        'Ball on the mat or turf. No tee. Lay Stick A at the target. Lay Stick B along your toes, parallel to Stick A. Take a neutral iron stance with feet on Stick B. Play the ball near the middle of your stance, between the sticks.',
      cue: 'Ball centered. Neutral stance. Body and face match.',
    },
  },
  'slice-object-avoidance': {
    driver: {
      diagramVariant: 'driver',
      setup:
        'Tee the ball (or use a mat tee insert). Place a headcover just outside the ball and a little behind it. Wider stance. Ball near the lead heel. Miss the headcover, then hit the driver.',
      cue: 'Miss the object with the driver. Then the ball.',
      matAdjustment: driverTeeMatNote(),
    },
    irons: {
      diagramVariant: 'irons',
      setup:
        'Ball on the mat or turf. Place a headcover just outside the ball and a little behind it. Neutral iron stance. Ball near mid stance. Miss the headcover, then hit the iron.',
      cue: 'Miss the object with the iron. Then the ball.',
    },
  },
  'hook-grip-check': {
    driver: {
      diagramVariant: 'driver',
      setup:
        'Tee the ball. Point the driver face at your target. Place your lead hand so you see about two knuckles. Do not twist the face closed after your hands are set. Wider stance. Ball near the lead heel.',
      cue: 'Two knuckles on the driver. Quiet face.',
      matAdjustment: driverTeeMatNote(),
    },
    irons: {
      diagramVariant: 'irons',
      setup:
        'Ball on the mat or turf. Point the iron face at your target. Place your lead hand so you see about two knuckles. Do not twist the face closed after your hands are set. Neutral stance. Ball near mid stance.',
      cue: 'Two knuckles on the iron. Quiet face.',
    },
  },
  'hook-mirrored-path': {
    driver: {
      diagramVariant: 'driver',
      setup:
        'Tee the ball. Place a headcover just inside the ball and a little behind it (closer to your body). Wider stance. Ball near the lead heel. Miss the headcover, then hit the driver.',
      cue: 'Driver: swing around, not under and out.',
      matAdjustment: driverTeeMatNote(),
    },
    irons: {
      diagramVariant: 'irons',
      setup:
        'Ball on the mat or turf. Place a headcover just inside the ball and a little behind it. Neutral iron stance. Ball near mid stance. Miss the headcover, then hit the iron.',
      cue: 'Iron: swing around, not under and out.',
    },
  },
  'fat-towel-behind': {
    irons: {
      diagramVariant: 'irons',
      setup:
        'Use a mid-iron. Fold a towel. Place it about four inches behind the ball. Neutral stance. Ball near mid-stance. Hit the ball without touching the towel.',
      cue: 'Mid-iron: ball first. Ground second.',
    },
    wedges: {
      diagramVariant: 'wedges',
      setup:
        'Use a wedge. Fold a towel. Place it about four inches behind the ball. Slightly narrower stance. Ball a touch back of center. Hit the ball without touching the towel.',
      cue: 'Wedge: ball first. Ground second.',
    },
  },
  'fat-tee-in-front': {
    irons: {
      diagramVariant: 'irons',
      setup:
        'Use a mid-iron. Place a coin (or tee on grass) 2-3 inches in front of the ball toward the target. Neutral stance. Ball near mid stance. After you hit the ball, your club should pass over that marker.',
      cue: 'Mid-iron: finish past the ball.',
      matAdjustment:
        'On mats, do not push a tee in. Place a coin 2-3 inches in front of the ball toward the target.',
    },
    wedges: {
      diagramVariant: 'wedges',
      setup:
        'Use a wedge. Place a coin (or tee on grass) 2-3 inches in front of the ball toward the target. Slightly narrower stance. Ball a touch back of center. After you hit the ball, your club should pass over that marker.',
      cue: 'Wedge: finish past the ball.',
      matAdjustment:
        'On mats, do not push a tee in. Place a coin 2-3 inches in front of the ball toward the target.',
    },
  },
  'thin-tee-under': {
    irons: {
      diagramVariant: 'irons',
      setup:
        'Use a mid-iron. Place the ball very low on the mat (or on a short tee in grass). Neutral stance. Ball near mid stance. Do not try to lift it. Brush the surface after the ball.',
      cue: 'Mid-iron: stay down through the ball.',
      matAdjustment:
        'On mats, rest the ball as low as possible on the mat. Focus on brushing the mat just after the ball.',
    },
    wedges: {
      diagramVariant: 'wedges',
      setup:
        'Use a wedge. Place the ball very low on the mat (or on a short tee in grass). Slightly narrower stance. Ball a touch back of center. Do not try to lift it. Brush the surface after the ball.',
      cue: 'Wedge: stay down through the ball.',
      matAdjustment:
        'On mats, rest the ball as low as possible on the mat. Focus on brushing the mat just after the ball.',
    },
  },
  'thin-towel-low-point': {
    irons: {
      diagramVariant: 'irons',
      setup:
        'Use a mid-iron. Place a towel a few inches in front of the ball toward the target. Neutral stance. Ball near mid stance. Hit the ball first. Miss the towel, or barely touch it after the ball.',
      cue: 'Mid-iron: compress. Don’t scoop.',
    },
    wedges: {
      diagramVariant: 'wedges',
      setup:
        'Use a wedge. Place a towel a few inches in front of the ball toward the target. Slightly narrower stance. Ball a touch back of center. Hit the ball first. Miss the towel, or barely touch it after the ball.',
      cue: 'Wedge: compress. Don’t scoop.',
    },
  },
}

export function adaptDrill(
  drill: Drill,
  focus: ClubFocus | undefined,
): AdaptedDrill {
  const label = formatClubFocusLabel(focus)
  const patch =
    focus && focus !== 'both' ? patches[drill.id]?.[focus] : undefined

  if (!patch) {
    return {
      ...drill,
      diagramVariant: resolveVariant(focus),
      clubLabel: label,
    }
  }

  const { diagramVariant, ...fields } = patch
  return {
    ...drill,
    ...fields,
    diagramVariant: diagramVariant ?? resolveVariant(focus),
    clubLabel: label,
  }
}

export function adaptDrills(
  drills: Drill[],
  clubFocus: ClubFocusBySymptom | undefined,
): AdaptedDrill[] {
  return drills.map((drill) =>
    adaptDrill(drill, clubFocus?.[drill.symptomId]),
  )
}
