import {
  ASSESSMENT_TESTS,
  isDriverMiss,
  isFullSwingResult,
  isIronMiss,
  isLagResult,
  isShortPuttResult,
  isWedgeMiss,
  isWedgeResult,
} from '../data/assessment'
import type {
  AccuracyReason,
  Assessment,
  AssessmentDraft,
  AssessmentFeedback,
  AssessmentResult,
  AssessmentShot,
  AssessmentSource,
  AssessmentTest,
  AssessmentTestId,
  MissType,
  PracticeChange,
  ProfileAccuracy,
  ShotResult,
  ShotScore,
  SkillScore,
} from '../types/assessment'

const ASSESSMENTS_KEY = 'shotplan:assessments:v2'
const DRAFT_KEY = 'shotplan:assessment-draft:v2'
const FEEDBACK_KEY = 'shotplan:assessment-feedback:v1'

const TEST_IDS = new Set<AssessmentTestId>(
  ASSESSMENT_TESTS.map((test) => test.id),
)

function isTestId(value: unknown): value is AssessmentTestId {
  return typeof value === 'string' && TEST_IDS.has(value as AssessmentTestId)
}

function isShotScore(value: unknown): value is ShotScore {
  return value === 0 || value === 1 || value === 2
}

function isShotResult(value: unknown): value is ShotResult {
  return (
    typeof value === 'string' &&
    (isFullSwingResult(value as ShotResult) ||
      isWedgeResult(value as ShotResult) ||
      isLagResult(value as ShotResult) ||
      isShortPuttResult(value as ShotResult))
  )
}

function isMissType(value: unknown): value is MissType {
  return (
    typeof value === 'string' &&
    (isDriverMiss(value) || isIronMiss(value) || isWedgeMiss(value))
  )
}

function isSource(value: unknown): value is AssessmentSource {
  return value === 'manual' || value === 'launch-monitor' || value === 'video'
}

function isMode(value: unknown): value is Assessment['mode'] {
  return value === 'quick-baseline' || value === 'full-combine'
}

function isProfileAccuracy(value: unknown): value is ProfileAccuracy {
  return value === 'accurate' || value === 'mostly' || value === 'inaccurate'
}

function isAccuracyReason(value: unknown): value is AccuracyReason {
  return (
    value === 'sample-too-small' ||
    value === 'score-wrong' ||
    value === 'strongest-wrong' ||
    value === 'opportunity-wrong' ||
    value === 'not-course' ||
    value === 'other'
  )
}

function isPracticeChange(value: unknown): value is PracticeChange {
  return value === 'yes' || value === 'maybe' || value === 'no'
}

function isFeedback(value: unknown): value is AssessmentFeedback {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  if (item.accuracyReason !== undefined && !isAccuracyReason(item.accuracyReason)) {
    return false
  }
  if (
    item.accuracyComment !== undefined &&
    typeof item.accuracyComment !== 'string'
  ) {
    return false
  }
  if (
    item.wouldChangePractice !== undefined &&
    !isPracticeChange(item.wouldChangePractice)
  ) {
    return false
  }
  if (
    item.profileAccuracy !== undefined &&
    !isProfileAccuracy(item.profileAccuracy)
  ) {
    return false
  }
  return typeof item.assessmentId === 'string' && typeof item.timestamp === 'string'
}

function isShot(value: unknown): value is AssessmentShot {
  if (!value || typeof value !== 'object') return false
  const shot = value as Record<string, unknown>
  if (shot.missType !== undefined && !isMissType(shot.missType)) return false
  if (
    shot.distanceYards !== undefined &&
    typeof shot.distanceYards !== 'number'
  ) {
    return false
  }
  return (
    typeof shot.id === 'string' &&
    isTestId(shot.testId) &&
    typeof shot.shotNumber === 'number' &&
    typeof shot.club === 'string' &&
    isShotResult(shot.result) &&
    isShotScore(shot.score) &&
    typeof shot.timestamp === 'string'
  )
}

function isSkillScore(value: unknown): value is SkillScore {
  if (!value || typeof value !== 'object') return false
  const skill = value as Record<string, unknown>
  return (
    isTestId(skill.testId) &&
    typeof skill.label === 'string' &&
    typeof skill.score === 'number'
  )
}

function isAssessmentResult(value: unknown): value is AssessmentResult {
  if (!value || typeof value !== 'object') return false
  const result = value as Record<string, unknown>
  return (
    typeof result.overallScore === 'number' &&
    Array.isArray(result.skills) &&
    result.skills.every(isSkillScore) &&
    isSkillScore(result.strongest) &&
    isSkillScore(result.biggestOpportunity) &&
    typeof result.opportunitySentence === 'string' &&
    (result.mostCommonMiss === null ||
      (typeof result.mostCommonMiss === 'object' &&
        result.mostCommonMiss !== null &&
        typeof (result.mostCommonMiss as { label?: unknown }).label ===
          'string'))
  )
}

function isAssessmentTest(value: unknown): value is AssessmentTest {
  if (!value || typeof value !== 'object') return false
  const test = value as Record<string, unknown>
  return (
    isTestId(test.id) &&
    typeof test.title === 'string' &&
    Array.isArray(test.shots) &&
    test.shots.every(isShot) &&
    typeof test.rawPoints === 'number' &&
    typeof test.maxPoints === 'number' &&
    typeof test.shotPlanScore === 'number'
  )
}

function isAssessment(value: unknown): value is Assessment {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  if (item.result !== null && !isAssessmentResult(item.result)) return false
  if (item.feedback !== undefined && !isFeedback(item.feedback)) return false
  return (
    typeof item.id === 'string' &&
    typeof item.createdAt === 'string' &&
    (item.completedAt === null || typeof item.completedAt === 'string') &&
    isSource(item.source) &&
    isMode(item.mode) &&
    Array.isArray(item.tests) &&
    item.tests.length === ASSESSMENT_TESTS.length &&
    item.tests.every(isAssessmentTest)
  )
}

function isDraft(value: unknown): value is AssessmentDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  return (
    isAssessment(draft.assessment) &&
    typeof draft.testIndex === 'number' &&
    draft.testIndex >= 0 &&
    draft.testIndex < ASSESSMENT_TESTS.length
  )
}

export function getAssessments(): Assessment[] {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isAssessment)
      .filter((item) => item.completedAt !== null && item.result)
      .sort(
        (a, b) =>
          new Date(b.completedAt ?? b.createdAt).getTime() -
          new Date(a.completedAt ?? a.createdAt).getTime(),
      )
  } catch {
    return []
  }
}

export function getLatestAssessment(): Assessment | undefined {
  return getAssessments()[0]
}

export function saveCompletedAssessment(assessment: Assessment): void {
  const existing = getAssessments().filter((item) => item.id !== assessment.id)
  existing.unshift(assessment)
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(existing))
}

export function updateAssessment(
  id: string,
  patch: Partial<Pick<Assessment, 'feedback'>>,
): Assessment | undefined {
  const assessments = getAssessments()
  const index = assessments.findIndex((item) => item.id === id)
  if (index === -1) return undefined
  const updated: Assessment = { ...assessments[index], ...patch }
  assessments[index] = updated
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments))
  if (updated.feedback) writeFeedbackLog(updated.feedback)
  return updated
}

function writeFeedbackLog(feedback: AssessmentFeedback): void {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const list = Array.isArray(parsed) ? parsed.filter(isFeedback) : []
    const next = [feedback, ...list.filter((item) => item.assessmentId !== feedback.assessmentId)]
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next.slice(0, 100)))
  } catch {
    /* ignore */
  }
}

export function getAssessmentDraft(): AssessmentDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isDraft(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveAssessmentDraft(draft: AssessmentDraft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function clearAssessmentDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}

export { ASSESSMENTS_KEY, DRAFT_KEY, FEEDBACK_KEY }
