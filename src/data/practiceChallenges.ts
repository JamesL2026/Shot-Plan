/**
 * Coaching practice templates.
 * Each drill has multiple challenge variants so sessions stay fresh.
 */

import { resolveDrillId } from './drills'

export type TemplateKind =
  | 'strike'
  | 'ballFlight'
  | 'distance'
  | 'accuracy'
  | 'consistency'
  | 'pressure'
  | 'tempo'

export interface PracticeChallenge {
  id: string
  template: TemplateKind
  templateLabel: string
  estimatedMinutes: number
  objective: string
  practice: string[]
  successCondition: string
  reflection: string
}

export const templateMeta: Record<
  TemplateKind,
  { label: string; goalFocus: string }
> = {
  strike: {
    label: 'Strike Improvement',
    goalFocus: 'Improve strike quality',
  },
  ballFlight: {
    label: 'Ball Flight Control',
    goalFocus: 'Start the ball on your intended line',
  },
  distance: {
    label: 'Distance Control',
    goalFocus: 'Control carry distance',
  },
  accuracy: {
    label: 'Accuracy',
    goalFocus: 'Improve directional control',
  },
  consistency: {
    label: 'Consistency',
    goalFocus: 'Repeat the same movement',
  },
  pressure: {
    label: 'Pressure Challenge',
    goalFocus: 'Finish under pressure',
  },
  tempo: {
    label: 'Tempo',
    goalFocus: 'Develop smooth rhythm',
  },
}

/** Two to three coach-written challenges per drill. */
export const challengesByDrillId: Record<string, PracticeChallenge[]> = {
  'slice-alignment-stick': [
    {
      id: 'slice-align-flight',
      template: 'ballFlight',
      templateLabel: 'Ball Flight Control',
      estimatedMinutes: 6,
      objective: 'Start the ball where you aimed.',
      practice: [
        'Set Stick A at the target. Set Stick B along your toes.',
        'Hit five easy swings. Check feet and face before each one.',
        'Hit eight normal swings at your main target.',
        'Pick a second target and hit four more with the same setup.',
      ],
      successCondition: 'Seven of eight balls start toward the target.',
      reflection: 'Did the ball start closer to your target?',
    },
    {
      id: 'slice-align-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Keep your setup under a short streak challenge.',
      practice: [
        'Set both sticks. Square the face to Stick A first.',
        'Hit three smooth warmups.',
        'Now go for three good starts in a row.',
        'Miss one? Restart the streak from zero.',
      ],
      successCondition: 'Three starts in a row toward the target.',
      reflection: 'Did this feel more intentional than guessing at aim?',
    },
    {
      id: 'slice-align-tempo',
      template: 'tempo',
      templateLabel: 'Tempo',
      estimatedMinutes: 5,
      objective: 'Keep alignment while swinging at an easy rhythm.',
      practice: [
        'Build the stick setup once. Leave it alone.',
        'Swing at about 70% speed for two minutes.',
        'Only count swings where feet stay on Stick B.',
        'Finish with four normal swings at the same tempo.',
      ],
      successCondition: 'For two minutes, keep feet on Stick B and aim the face at Stick A.',
      reflection: 'Was it easier to stay lined up at a smoother tempo?',
    },
  ],

  'slice-object-avoidance': [
    {
      id: 'slice-avoid-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Miss the outside object and train a better path.',
      practice: [
        'Place the headcover outside and slightly behind the ball.',
        'Make four slow rehearsal swings that miss it.',
        'Hit shots that miss the object first, then the ball.',
        'Only count swings that clear the object.',
      ],
      successCondition: 'Eight successful swings without touching the object.',
      reflection: 'Did the start line look quieter?',
    },
    {
      id: 'slice-avoid-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Miss the headcover five times in a row. If you hit it, start over.',
      practice: [
        'Set the headcover. Take two easy feel swings.',
        'Go for five consecutive swings that miss the object.',
        'Touch it once? Restart the streak.',
        'Keep your hands quiet. Path first.',
      ],
      successCondition: 'Five swings in a row without touching the headcover.',
      reflection: 'Did you trust the path more as the streak grew?',
    },
    {
      id: 'slice-avoid-flight',
      template: 'ballFlight',
      templateLabel: 'Ball Flight Control',
      estimatedMinutes: 6,
      objective: 'Miss the object and start the ball toward the target.',
      practice: [
        'Set the object. Pick a clear start line.',
        'Hit six swings that miss the object.',
        'On the next eight, miss the object and watch the start.',
        'Note how many start near your line.',
      ],
      successCondition: 'Start 6 of 8 shots near your target line while missing the object.',
      reflection: 'Did a better path help the ball start straighter?',
    },
  ],

  'hook-finish-position': [
    {
      id: 'hook-finish-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Finish in balance with your chest facing the target.',
      practice: [
        'Take your normal address. No extra equipment.',
        'Hit controlled half swings.',
        'Hold every finish. Chest to the target. Club around your body.',
        'Only count finishes you can hold for a full second.',
      ],
      successCondition: 'Finish in balance for 8 of your next 10 swings.',
      reflection: 'Did a taller finish calm the left miss?',
    },
    {
      id: 'hook-finish-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Earn a short streak of balanced finishes.',
      practice: [
        'Hit two easy warmups and hold the finish.',
        'Go for three balanced finishes in a row.',
        'Fall off balance or quit early? Restart the streak.',
        'Finish tall. Chest to the target.',
      ],
      successCondition: 'Three consecutive balanced finishes.',
      reflection: 'Did pressure make you want to steer instead of rotate?',
    },
    {
      id: 'hook-finish-tempo',
      template: 'tempo',
      templateLabel: 'Tempo',
      estimatedMinutes: 5,
      objective: 'Keep smooth rhythm and still finish tall.',
      practice: [
        'Swing at about 70% for two minutes.',
        'Hold a balanced finish after every swing.',
        'Chest facing the target. Club around the body.',
        'Finish with four normal swings at the same pace.',
      ],
      successCondition: 'Two solid minutes of tall, balanced finishes.',
      reflection: 'Did smoother tempo make the finish easier to hold?',
    },
  ],

  'hook-split-hand': [
    {
      id: 'hook-split-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Keep the clubface from snapping shut with a split grip.',
      practice: [
        'Split your hands 2-3 inches apart on the grip.',
        'Hit two easy half swing warmups.',
        'Go for five clean half swings in a row with no snap shut feel.',
        'If the face flips hard, restart the streak.',
      ],
      successCondition: 'Five half swings in a row with a split grip and no snap shut.',
      reflection: 'Did quieter hands calm the left miss?',
    },
    {
      id: 'hook-split-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Repeat quieter hands with a split grip.',
      practice: [
        'Set the split grip once and keep it.',
        'Hit smooth half swings only.',
        'Only count swings where the face does not snap shut.',
        'Stay patient. No steering.',
      ],
      successCondition: 'Eight half swings with a split grip and no snap shut.',
      reflection: 'Did the split grip make hand action easier to feel?',
    },
    {
      id: 'hook-split-flight',
      template: 'ballFlight',
      templateLabel: 'Ball Flight Control',
      estimatedMinutes: 6,
      objective: 'Start the ball nearer your line with quieter hands.',
      practice: [
        'Split the grip. Pick a start line.',
        'Hit six easy half swings.',
        'Hit eight more and watch the start.',
        'Count how many start closer to the line.',
      ],
      successCondition: 'Start 6 of 8 near your line with quieter hands.',
      reflection: 'Did softer hands help the start line?',
    },
  ],

  'fat-towel-behind': [
    {
      id: 'fat-towel-strike',
      template: 'strike',
      templateLabel: 'Strike Improvement',
      estimatedMinutes: 6,
      objective: 'Hit the ball first. Leave the towel alone.',
      practice: [
        'Place the towel about four inches behind the ball.',
        'Hit easy swings. Miss the towel every time.',
        'Only count clean ball first strikes.',
        'If you catch the towel, reset and slow down.',
      ],
      successCondition: 'Eight clean strikes that miss the towel.',
      reflection: 'Did contact feel more ball first?',
    },
    {
      id: 'fat-towel-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'String together clean strikes under a restart rule.',
      practice: [
        'Set the towel. Take two feel swings.',
        'Go for three clean strikes in a row.',
        'Touch the towel? Restart the streak.',
        'Stay through the shot. Do not hang back.',
      ],
      successCondition: 'Three consecutive clean strikes that miss the towel.',
      reflection: 'Did pressure make you want to help the ball up?',
    },
    {
      id: 'fat-towel-tempo',
      template: 'tempo',
      templateLabel: 'Tempo',
      estimatedMinutes: 5,
      objective: 'Keep smooth rhythm while missing the towel.',
      practice: [
        'Set the towel once.',
        'Swing at about 70% for two minutes.',
        'Only count swings that miss the towel.',
        'Finish with four normal swings at the same pace.',
      ],
      successCondition: 'Two solid minutes of towel free contact.',
      reflection: 'Was cleaner contact easier at a smoother tempo?',
    },
  ],

  'fat-tee-in-front': [
    {
      id: 'fat-marker-strike',
      template: 'strike',
      templateLabel: 'Strike Improvement',
      estimatedMinutes: 5,
      objective: 'Swing through so the club passes the marker after the ball.',
      practice: [
        'Place the coin 2-3 inches in front of the ball.',
        'Hit easy swings that brush past the marker.',
        'Only count swings that finish through the coin.',
        'If you stop at the ball, make the next one longer through.',
      ],
      successCondition: 'Eight swings that pass the marker after the ball.',
      reflection: 'Did finishing past the ball improve the strike?',
    },
    {
      id: 'fat-marker-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat the same finish through the ball.',
      practice: [
        'Set the marker. Same ball position every time.',
        'Hit repetitions with the same finish feel.',
        'Only count swings that clear the marker.',
        'Keep the thought simple: finish past the ball.',
      ],
      successCondition: 'Eight swings that pass the marker after the ball.',
      reflection: 'Did the finish start to feel automatic?',
    },
    {
      id: 'fat-marker-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 4,
      objective: 'Pass the marker three times in a row.',
      practice: [
        'Set the coin. Hit two warmups.',
        'Make three swings in a row that pass the marker.',
        'Miss? Restart.',
        'Stay aggressive through the ball.',
      ],
      successCondition: 'Three consecutive swings past the marker.',
      reflection: 'Did the streak force a more committed finish?',
    },
  ],

  'thin-brush-line': [
    {
      id: 'thin-brush-strike',
      template: 'strike',
      templateLabel: 'Strike Improvement',
      estimatedMinutes: 5,
      objective: 'Hit the ball, then brush the line every time.',
      practice: [
        'Set a coin or towel edge 1-2 inches in front of the ball.',
        'Hit smooth half swings. Ball first, then brush the line.',
        'Only count swings that brush after the ball.',
        'If you miss high, stay down longer on the next one.',
      ],
      successCondition: 'Eight clean strikes that brush the line after the ball.',
      reflection: 'Did brushing the line make contact feel heavier and better?',
    },
    {
      id: 'thin-brush-tempo',
      template: 'tempo',
      templateLabel: 'Tempo',
      estimatedMinutes: 5,
      objective: 'Keep smooth rhythm while brushing the line.',
      practice: [
        'Set the brush line once.',
        'Swing at about 70% for two minutes.',
        'Brush the line after the ball on every swing you count.',
        'Finish with four normal swings at the same tempo.',
      ],
      successCondition: 'Two minutes of solid, brush after contact.',
      reflection: 'Did slower tempo help you stay down?',
    },
    {
      id: 'thin-brush-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat the same brush the line strike.',
      practice: [
        'Same brush line gap every swing.',
        'Same smooth tempo.',
        'Only count brushes after the ball.',
        'No lifting early.',
      ],
      successCondition: 'Eight successful repetitions with brush after the ball.',
      reflection: 'Did contact feel more repeatable?',
    },
  ],

  'thin-towel-low-point': [
    {
      id: 'thin-ahead-strike',
      template: 'strike',
      templateLabel: 'Strike Improvement',
      estimatedMinutes: 6,
      objective: 'Hit ball first. Towel second, or not at all.',
      practice: [
        'Place the towel a few inches ahead of the ball.',
        'Hit swings that take the ball before the towel.',
        'Only count ball first strikes.',
        'If you scoop, quiet the wrists and try again.',
      ],
      successCondition: 'Eight ball first strikes.',
      reflection: 'Did the towel prove where your low point was?',
    },
    {
      id: 'thin-ahead-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Earn three ball first strikes in a row.',
      practice: [
        'Set the towel. Hit two feel swings.',
        'Go for three ball first strikes in a row.',
        'Scoop or hit towel first? Restart.',
        'Compress. Do not scoop.',
      ],
      successCondition: 'Three consecutive ball first strikes.',
      reflection: 'Did the restart rule sharpen your focus?',
    },
    {
      id: 'thin-ahead-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat ball first contact with the towel as feedback.',
      practice: [
        'Same towel gap every time.',
        'Same quiet hands.',
        'Only count ball first swings.',
        'Keep the cue short: compress.',
      ],
      successCondition: 'Eight successful ball first repetitions.',
      reflection: 'Did scooping start to fade?',
    },
  ],

  'chip-wedge-ladder': [
    {
      id: 'chip-wedge-distance',
      template: 'distance',
      templateLabel: 'Distance Control',
      estimatedMinutes: 7,
      objective: 'Land chips at three distances with one everyday wedge.',
      practice: [
        'Pick your most common wedge (54, 56, or 58). Stay put.',
        'Hit five short chips to a near landing spot.',
        'Hit five medium, then five longer, same wedge.',
        'Change only swing length. Never change clubs.',
      ],
      successCondition: 'Land at least three chips in each distance zone.',
      reflection: 'Did one wedge cover more distances than you expected?',
    },
    {
      id: 'chip-wedge-accuracy',
      template: 'accuracy',
      templateLabel: 'Accuracy',
      estimatedMinutes: 6,
      objective: 'Hold a tight landing corridor while changing only swing length.',
      practice: [
        'Mark three landing zones with your everyday wedge.',
        'Alternate short, medium, and long swings.',
        'Same setup each time. Same club.',
        'Only count chips that land in the intended zone.',
      ],
      successCondition: 'Five successful landings in a row in the intended zone.',
      reflection: 'Did swing length feel clearer than changing clubs?',
    },
    {
      id: 'chip-wedge-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Repeat one chipping motion across three distances.',
      practice: [
        'One wedge. One setup.',
        'Two chips short. Two medium. Two long.',
        'Repeat the ladder once more.',
        'Only count soft, centered contact.',
      ],
      successCondition: 'Eight successful chips with the same wedge feel.',
      reflection: 'Did the motion stay quiet when distance changed?',
    },
  ],

  'chip-headcover': [
    {
      id: 'chip-cover-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Chip without dropping the headcover so the arms stay connected.',
      practice: [
        'Tuck the headcover under your lead arm.',
        'Hit soft chips. Brush the turf or mat.',
        'Only count chips where the headcover stays put.',
        'Quiet wrists. Connected arms.',
      ],
      successCondition: 'Eight successful chips without dropping the headcover.',
      reflection: 'Did quieter wrists make contact more predictable?',
    },
    {
      id: 'chip-cover-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 4,
      objective: 'Keep the headcover in place through a short streak.',
      practice: [
        'Tuck the headcover. Hit two warmups.',
        'Make three chips in a row without dropping it.',
        'Drop it? Restart.',
        'Let loft send the ball up.',
      ],
      successCondition: 'Three consecutive chips without dropping the headcover.',
      reflection: 'Did pressure tempt you to flip the hands?',
    },
    {
      id: 'chip-cover-distance',
      template: 'distance',
      templateLabel: 'Distance Control',
      estimatedMinutes: 5,
      objective: 'Land soft chips near one spot with a connected motion.',
      practice: [
        'Pick a landing spot.',
        'Chip with the headcover under the arm.',
        'Vary only swing length, not wrist action.',
        'Only count landings near the spot with the cover still in place.',
      ],
      successCondition: 'Land 6 chips near the spot without dropping the cover.',
      reflection: 'Did connected arms help distance feel simpler?',
    },
  ],

  'putt-lag-ladder': [
    {
      id: 'putt-lag-distance',
      template: 'distance',
      templateLabel: 'Distance Control',
      estimatedMinutes: 7,
      objective: 'Die lag putts near the hole from three distances.',
      practice: [
        'Mark short, medium, and long spots to the same hole.',
        'Putt four balls from short, then medium, then long.',
        'Focus on speed. Holing is a bonus.',
        'Count leaves inside a 3 foot circle.',
      ],
      successCondition: 'Leave 8 of 12 putts inside a 3 foot circle.',
      reflection: 'Did smoother tempo leave you closer?',
    },
    {
      id: 'putt-lag-tempo',
      template: 'tempo',
      templateLabel: 'Tempo',
      estimatedMinutes: 6,
      objective: 'Keep the same rhythm while climbing the distance ladder.',
      practice: [
        'Set three distances once.',
        'Use the same backswing to through feel at every distance.',
        'Only lengthen the stroke as the putt gets longer.',
        'Die the ball near the hole.',
      ],
      successCondition: 'Two clean trips up the ladder with soft finishes.',
      reflection: 'Did one tempo cover all three distances?',
    },
    {
      id: 'putt-lag-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 6,
      objective: 'Earn close leaves under a restart rule.',
      practice: [
        'Start at the medium distance.',
        'Leave three putts in a row inside 3 feet.',
        'Race one by? Restart the streak.',
        'Soft speed. No banging.',
      ],
      successCondition: 'Three consecutive leaves inside 3 feet.',
      reflection: 'Did pressure tempt you to hit it too hard?',
    },
  ],

  'putt-start-line-gate': [
    {
      id: 'putt-start-accuracy',
      template: 'accuracy',
      templateLabel: 'Accuracy',
      estimatedMinutes: 6,
      objective: 'Start putts on line through a gate 2-3 feet ahead.',
      practice: [
        'Build a gate 2-3 feet in front of the ball on your start line.',
        'Roll putts through without touching either side.',
        'After five clean putts, move one step farther from the hole.',
        'Square face. Clean start.',
      ],
      successCondition: 'Five successful putts from every distance you try.',
      reflection: 'Did the ahead gate make start line feel obvious?',
    },
    {
      id: 'putt-start-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Earn a clean streak through the start line gate.',
      practice: [
        'Set the gate 2-3 feet ahead. Hit two feel putts.',
        'Make three gate putts in a row.',
        'Clip a side? Restart.',
        'Slow down if you start steering.',
      ],
      successCondition: 'Three consecutive putts through the gate.',
      reflection: 'Did the restart rule quiet your hands?',
    },
    {
      id: 'putt-start-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat a square start through the ahead gate.',
      practice: [
        'Same gate distance every putt (2-3 feet ahead).',
        'Same setup routine.',
        'Only count clean passes.',
        'No steering after the hit.',
      ],
      successCondition: 'Eight successful start line gate putts.',
      reflection: 'Did a square face start to feel automatic?',
    },
  ],
}

export function getChallengesForDrill(drillId: string): PracticeChallenge[] {
  return challengesByDrillId[resolveDrillId(drillId)] ?? []
}
