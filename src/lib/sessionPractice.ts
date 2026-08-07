import {
  getChallengesForDrill,
  type PracticeChallenge,
} from '../data/practiceChallenges'
import type { AdaptedDrill, Drill } from '../types'

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function pickChallenge(
  drillId: string,
  sessionSeed: string,
  index = 0,
): PracticeChallenge | undefined {
  const variants = getChallengesForDrill(drillId)
  if (variants.length === 0) return undefined
  const n = hashSeed(`${sessionSeed}:${drillId}:${index}`)
  return variants[n % variants.length]
}

/** Prefer different templates across drills in one session when possible. */
export function pickSessionChallenges(
  drills: Drill[],
  sessionSeed: string,
): PracticeChallenge[] {
  const usedTemplates = new Set<string>()
  const picked: PracticeChallenge[] = []

  drills.forEach((drill, index) => {
    const variants = getChallengesForDrill(drill.id)
    if (variants.length === 0) return

    const fresh = variants.filter((v) => !usedTemplates.has(v.template))
    const pool = fresh.length > 0 ? fresh : variants
    const n = hashSeed(`${sessionSeed}:${drill.id}:${index}:pick`)
    const choice = pool[n % pool.length]
    usedTemplates.add(choice.template)
    picked.push(choice)
  })

  return picked
}

export function applyChallenge(
  drill: Drill | AdaptedDrill,
  challenge: PracticeChallenge | undefined,
): AdaptedDrill {
  const base: AdaptedDrill =
    'diagramVariant' in drill
      ? drill
      : {
          ...drill,
          diagramVariant: 'default',
          clubLabel: null,
        }

  if (!challenge) {
    return {
      ...base,
      steps: [...base.steps],
    }
  }

  return {
    ...base,
    steps: challenge.practice,
    estimatedMinutes: challenge.estimatedMinutes,
    objective: challenge.objective,
    successCondition: challenge.successCondition,
    reflection: challenge.reflection,
    templateLabel: challenge.templateLabel,
    challengeId: challenge.id,
  }
}

export function applySessionChallenges(
  drills: Array<Drill | AdaptedDrill>,
  sessionSeed: string,
): AdaptedDrill[] {
  const challenges = pickSessionChallenges(drills, sessionSeed)
  return drills.map((drill, index) =>
    applyChallenge(drill, challenges[index] ?? pickChallenge(drill.id, sessionSeed, index)),
  )
}

export function totalEstimatedMinutes(drills: AdaptedDrill[]): number {
  const sum = drills.reduce(
    (acc, drill) => acc + (drill.estimatedMinutes ?? 5),
    0,
  )
  return Math.max(sum, drills.length * 4)
}

export function formatMinutesRange(total: number): string {
  const low = Math.max(10, total - 3)
  const high = total + 3
  return `${low}-${high} minutes`
}
