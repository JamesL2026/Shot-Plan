/**
 * Real-setup photos audited against current drills.
 * Only list a photo when it actually shows that drill's setup.
 * Prefer the diagram when the photo would mislead (wrong club or wrong drill).
 */

export type PhotoClubHint = 'driver' | 'iron' | 'wedge' | 'putter' | 'unknown'

export interface DrillPhotoMeta {
  /** Public path under /drills/ */
  src: string
  /** Club visible in the photo */
  photoClub: PhotoClubHint
  /** Honest caption for golfers */
  caption: string
  /** True when setup aids match the drill */
  setupAccurate: boolean
}

const catalog: Record<string, DrillPhotoMeta | null> = {
  'slice-alignment-stick': {
    src: '/drills/slice-alignment-stick.jpg',
    photoClub: 'driver',
    caption:
      'Real setup with a driver. If you chose irons, match the iron ball position from the diagram.',
    setupAccurate: true,
  },
  'slice-object-avoidance': {
    src: '/drills/slice-object-avoidance.jpg',
    photoClub: 'driver',
    caption:
      'Real setup with a driver and outside headcover. If you chose irons, use an iron and the diagram ball position.',
    setupAccurate: true,
  },
  'hook-finish-position': {
    src: '/drills/hook-finish-position.jpg',
    photoClub: 'iron',
    caption:
      'Balanced finish with chest to the target. Match your chosen club from the diagram.',
    setupAccurate: true,
  },
  // No split hand photo yet; diagram only
  'hook-split-hand': null,
  'fat-towel-behind': {
    src: '/drills/fat-towel-behind.jpg',
    photoClub: 'wedge',
    caption:
      'Towel behind the ball. Photo shows a short iron or wedge. If you chose irons, keep the same towel gap.',
    setupAccurate: true,
  },
  'fat-tee-in-front': {
    src: '/drills/fat-tee-in-front.jpg',
    photoClub: 'iron',
    caption:
      'Coin or marker in front of the ball. Photo shows an iron. If you chose wedges, use a wedge with the same marker gap.',
    setupAccurate: true,
  },
  'thin-brush-line': {
    src: '/drills/thin-brush-line.jpg',
    photoClub: 'iron',
    caption:
      'Marker ahead of the ball as your brush line. Photo shows an iron. Match your club from the diagram.',
    setupAccurate: true,
  },
  'thin-towel-low-point': {
    src: '/drills/thin-towel-low-point.jpg',
    photoClub: 'iron',
    caption:
      'Towel ahead of the ball. Photo shows an iron. If you chose wedges, keep the same towel gap with a wedge.',
    setupAccurate: true,
  },
  'chip-headcover': {
    src: '/drills/chip-headcover.jpg',
    photoClub: 'wedge',
    caption: 'Headcover under the lead arm with a wedge. Match this connection feel.',
    setupAccurate: true,
  },
  'chip-wedge-ladder': {
    src: '/drills/chip-wedge-ladder.jpg',
    photoClub: 'wedge',
    caption:
      'One wedge to a landing spot. Use your everyday wedge and change only swing length.',
    setupAccurate: true,
  },
  // Lag ladder has no accurate photo yet (old circle photo would mislead)
  'putt-lag-ladder': null,
  'putt-start-line-gate': {
    src: '/drills/putt-start-line-gate.jpg',
    photoClub: 'putter',
    caption:
      'Gate on the start line with a putter. Place your gate about 2-3 feet ahead of the ball.',
    setupAccurate: true,
  },
}

export function getDrillPhoto(drillId: string): DrillPhotoMeta | null {
  return catalog[drillId] ?? null
}
