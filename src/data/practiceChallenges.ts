/**
 * Coaching practice templates.
 * Each drill has multiple challenge variants so sessions stay fresh.
 */

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
      objective: 'Start the ball on your intended line with a matched setup.',
      practice: [
        'Set Stick A at the target. Set Stick B along your toes.',
        'Hit five easy swings. Check feet and face before each one.',
        'Hit eight normal swings at your main target.',
        'Pick a second target and hit four more with the same setup.',
      ],
      successCondition: 'Seven of eight balls start on your intended line.',
      reflection: 'Did the ball start closer to your target?',
    },
    {
      id: 'slice-align-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Hold your alignment under a short finish challenge.',
      practice: [
        'Set both sticks. Square the face to Stick A first.',
        'Hit three smooth warmups.',
        'Now go for three good starts in a row.',
        'Miss one? Restart the streak from zero.',
      ],
      successCondition: 'Three consecutive starts on your intended line.',
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
      successCondition: 'Two clean minutes of setup that still feels square.',
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
      objective: 'String together clean misses under pressure.',
      practice: [
        'Set the headcover. Take two easy feel swings.',
        'Go for five consecutive swings that miss the object.',
        'Touch it once? Restart the streak.',
        'Keep your hands quiet. Path first.',
      ],
      successCondition: 'Five consecutive swings without contacting the object.',
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

  'hook-mirrored-path': [
    {
      id: 'hook-inside-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Miss the inside object and soften the path.',
      practice: [
        'Place the headcover inside and slightly behind the ball.',
        'Take three slow feel swings that miss it.',
        'Go for five clean misses in a row.',
        'Touch the object? Restart.',
      ],
      successCondition: 'Five consecutive swings without contacting the object.',
      reflection: 'Did missing the inside object calm the left miss?',
    },
    {
      id: 'hook-inside-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Repeat a path that clears the inside object.',
      practice: [
        'Set the object. Keep the face quiet.',
        'Hit swings that miss it first, then the ball.',
        'Only count clean misses.',
        'Stay patient. No steering.',
      ],
      successCondition: 'Eight successful repetitions that miss the object.',
      reflection: 'Did the swing feel more around and less under?',
    },
    {
      id: 'hook-inside-flight',
      template: 'ballFlight',
      templateLabel: 'Ball Flight Control',
      estimatedMinutes: 6,
      objective: 'Miss the object and start the ball nearer your line.',
      practice: [
        'Set the object and pick a start line.',
        'Hit six easy misses.',
        'Hit eight normal swings. Miss the object and watch the start.',
        'Count how many start closer to the line.',
      ],
      successCondition: 'Start 6 of 8 near your line while missing the object.',
      reflection: 'Did a softer path help the start line?',
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
        'Only count clean ball-first strikes.',
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
      successCondition: 'Two solid minutes of towel-free contact.',
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
      objective: 'Repeat a through-the-ball finish.',
      practice: [
        'Set the marker. Same ball position every time.',
        'Hit repetitions with the same finish feel.',
        'Only count swings that clear the marker.',
        'Keep the thought simple: finish past the ball.',
      ],
      successCondition: 'Eight successful repetitions past the marker.',
      reflection: 'Did the finish start to feel automatic?',
    },
    {
      id: 'fat-marker-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 4,
      objective: 'Earn a short streak of through-contact.',
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

  'thin-tee-under': [
    {
      id: 'thin-low-strike',
      template: 'strike',
      templateLabel: 'Strike Improvement',
      estimatedMinutes: 5,
      objective: 'Stay down and brush after the ball.',
      practice: [
        'Set the ball as low as you can on the mat.',
        'Hit smooth swings. No scooping.',
        'Only count strikes that brush after the ball.',
        'If you thin one, quiet the hands and stay down longer.',
      ],
      successCondition: 'Eight clean strikes that brush after the ball.',
      reflection: 'Did staying down make contact feel heavier and better?',
    },
    {
      id: 'thin-low-tempo',
      template: 'tempo',
      templateLabel: 'Tempo',
      estimatedMinutes: 5,
      objective: 'Keep a smooth rhythm while staying down through impact.',
      practice: [
        'Low ball. Soft grip pressure.',
        'Swing at about 70% for two minutes.',
        'Brush the mat after the ball on every swing you count.',
        'Finish with four normal swings at the same tempo.',
      ],
      successCondition: 'Two minutes of solid, down-through contact.',
      reflection: 'Did slower tempo help you stay down?',
    },
    {
      id: 'thin-low-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat the same low-ball strike.',
      practice: [
        'Same ball height every swing.',
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
        'Only count ball-first strikes.',
        'If you scoop, quiet the wrists and try again.',
      ],
      successCondition: 'Eight ball-first strikes.',
      reflection: 'Did the towel prove where your low point was?',
    },
    {
      id: 'thin-ahead-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Earn three ball-first strikes in a row.',
      practice: [
        'Set the towel. Hit two feel swings.',
        'Go for three ball-first strikes in a row.',
        'Scoop or hit towel first? Restart.',
        'Compress. Do not scoop.',
      ],
      successCondition: 'Three consecutive ball-first strikes.',
      reflection: 'Did the restart rule sharpen your focus?',
    },
    {
      id: 'thin-ahead-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat ball-first contact with the towel as feedback.',
      practice: [
        'Same towel gap every time.',
        'Same quiet hands.',
        'Only count ball-first swings.',
        'Keep the cue short: compress.',
      ],
      successCondition: 'Eight successful ball-first repetitions.',
      reflection: 'Did scooping start to fade?',
    },
  ],

  'chip-club-ladder': [
    {
      id: 'chip-ladder-distance',
      template: 'distance',
      templateLabel: 'Distance Control',
      estimatedMinutes: 7,
      objective: 'Land chips on one spot using different clubs and one motion.',
      practice: [
        'Pick one landing spot and stay put.',
        'Chip five with a pitching wedge to that spot.',
        'Same swing size with a 9-iron, then an 8-iron.',
        'Change only the club. Keep the motion identical.',
      ],
      successCondition: 'Every club lands inside your target area at least three times.',
      reflection: 'Did one motion cover more distances than you expected?',
    },
    {
      id: 'chip-ladder-accuracy',
      template: 'accuracy',
      templateLabel: 'Accuracy',
      estimatedMinutes: 6,
      objective: 'Hold a tight landing corridor while changing clubs.',
      practice: [
        'Mark a small landing zone.',
        'Alternate PW, 9-iron, and 8-iron.',
        'Same small swing each time.',
        'Only count chips that land in the zone.',
      ],
      successCondition: 'Five successful landings in a row inside the zone.',
      reflection: 'Did changing clubs feel easier than changing swing size?',
    },
    {
      id: 'chip-ladder-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Repeat one chipping motion across three clubs.',
      practice: [
        'One landing spot. One swing size.',
        'Two chips with PW. Two with 9. Two with 8.',
        'Repeat the ladder once more.',
        'Only count soft, centered contact.',
      ],
      successCondition: 'Eight successful chips with the same motion feel.',
      reflection: 'Did the motion stay quiet when the club changed?',
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

  'putt-gate': [
    {
      id: 'putt-gate-accuracy',
      template: 'accuracy',
      templateLabel: 'Accuracy',
      estimatedMinutes: 6,
      objective: 'Start putts on line through a narrow gate.',
      practice: [
        'Build a gate just wider than your putter.',
        'Roll putts through without touching either side.',
        'After five clean putts, move one step farther.',
        'Square face. Straight start.',
      ],
      successCondition: 'Five successful putts from every distance you try.',
      reflection: 'Did the gate make start line feel obvious?',
    },
    {
      id: 'putt-gate-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 5,
      objective: 'Earn a clean streak through the gate.',
      practice: [
        'Set the gate. Hit two feel putts.',
        'Make three gate putts in a row.',
        'Clip a side? Restart.',
        'Slow down if you start steering.',
      ],
      successCondition: 'Three consecutive putts through the gate.',
      reflection: 'Did the restart rule quiet your hands?',
    },
    {
      id: 'putt-gate-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 5,
      objective: 'Repeat a square start through the gate.',
      practice: [
        'Same gate width every putt.',
        'Same setup routine.',
        'Only count clean passes.',
        'No steering after the hit.',
      ],
      successCondition: 'Eight successful gate putts.',
      reflection: 'Did a square face start to feel automatic?',
    },
  ],

  'putt-around-the-world': [
    {
      id: 'putt-world-pressure',
      template: 'pressure',
      templateLabel: 'Pressure Challenge',
      estimatedMinutes: 7,
      objective: 'Make your way around the circle without skipping misses.',
      practice: [
        'Place 6-8 balls in a circle 3-5 feet from the hole.',
        'Putt one ball at a time around the circle.',
        'Miss? Redo that spot before moving on.',
        'Die the ball at the hole. Soft speed.',
      ],
      successCondition: 'Complete the full circle with every miss redone.',
      reflection: 'Did soft speed save more putts than banging it?',
    },
    {
      id: 'putt-world-consistency',
      template: 'consistency',
      templateLabel: 'Consistency',
      estimatedMinutes: 6,
      objective: 'Repeat good short-putt speed from every angle.',
      practice: [
        'Build the circle once.',
        'Go around with the same routine each ball.',
        'Only count putts that die at the hole.',
        'Redo any leave that races by.',
      ],
      successCondition: 'Eight successful short putts with soft speed.',
      reflection: 'Did pace feel more consistent around the circle?',
    },
    {
      id: 'putt-world-accuracy',
      template: 'accuracy',
      templateLabel: 'Accuracy',
      estimatedMinutes: 6,
      objective: 'Start each circle putt on a clear line.',
      practice: [
        'Pick a line for every ball before you stroke.',
        'Roll around the circle.',
        'Miss? Redo that spot.',
        'Keep speed soft enough to die at the hole.',
      ],
      successCondition: 'Finish the circle with clear start lines on every make.',
      reflection: 'Did picking a line first quiet the stroke?',
    },
  ],
}

export function getChallengesForDrill(drillId: string): PracticeChallenge[] {
  return challengesByDrillId[drillId] ?? []
}
