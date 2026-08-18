import { Button } from '../ui/Button'
import type {
  AssessmentFeedback,
  AssessmentResult,
  PracticeChange,
  ProfileAccuracy,
  SkillScore,
} from '../../types/assessment'

interface AssessmentResultsProps {
  result: AssessmentResult
  feedback?: AssessmentFeedback
  onFeedback: (patch: {
    profileAccuracy?: ProfileAccuracy
    wouldChangePractice?: PracticeChange
  }) => void
  onSave: () => void
  onRetake: () => void
}

const ACCURACY_OPTIONS: { value: ProfileAccuracy; label: string }[] = [
  { value: 'accurate', label: 'Yes' },
  { value: 'mostly', label: 'Mostly' },
  { value: 'inaccurate', label: 'No' },
]

const PRACTICE_OPTIONS: { value: PracticeChange; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
]

function SkillBar({
  skill,
  strongestId,
  opportunityId,
}: {
  skill: SkillScore
  strongestId: string
  opportunityId: string
}) {
  const isStrongest = skill.testId === strongestId
  const isOpportunity = skill.testId === opportunityId

  return (
    <div
      className={
        isOpportunity
          ? 'assess-skill assess-skill--opportunity'
          : isStrongest
            ? 'assess-skill assess-skill--strong'
            : 'assess-skill'
      }
    >
      <div className="assess-skill__row">
        <p className="assess-skill__label">{skill.label}</p>
        <p className="assess-skill__score">{skill.score}</p>
      </div>
      <div className="assess-skill__track" aria-hidden="true">
        <div
          className="assess-skill__fill"
          style={{ width: `${Math.min(100, Math.max(0, skill.score))}%` }}
        />
      </div>
    </div>
  )
}

export function AssessmentResults({
  result,
  feedback,
  onFeedback,
  onSave,
  onRetake,
}: AssessmentResultsProps) {
  const accuracy = feedback?.profileAccuracy

  return (
    <section className="assess-results animate-in">
      <p className="assess-kicker">Your ShotPlan Profile</p>
      <p className="assess-overall-label">Quick Baseline</p>
      <p className="assess-overall">{result.overallScore}</p>
      <p className="assess-disclaimer">
        A 15 shot snapshot. Not a handicap.
      </p>

      <div className="assess-skills" aria-label="Five skill scores">
        {result.skills.map((skill) => (
          <SkillBar
            key={skill.testId}
            skill={skill}
            strongestId={result.strongest.testId}
            opportunityId={result.biggestOpportunity.testId}
          />
        ))}
      </div>

      <div className="assess-highlights">
        <article className="assess-highlight">
          <p className="assess-highlight__label">Strongest today</p>
          <p className="assess-highlight__value">
            {result.strongest.label} {result.strongest.score}
          </p>
        </article>
        <article className="assess-highlight assess-highlight--opportunity">
          <p className="assess-highlight__label">Biggest opportunity today</p>
          <p className="assess-highlight__value">
            {result.biggestOpportunity.label} {result.biggestOpportunity.score}
          </p>
        </article>
        {result.mostCommonMiss ? (
          <article className="assess-highlight">
            <p className="assess-highlight__label">What showed up</p>
            <p className="assess-highlight__value">
              {result.mostCommonMiss.label}
            </p>
          </article>
        ) : null}
      </div>

      <div className="assess-survey">
        <p className="assess-survey__title">Feel right?</p>
        <div className="assess-survey__row" role="group" aria-label="Feel right">
          {ACCURACY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                accuracy === option.value
                  ? 'assess-survey__btn assess-survey__btn--on'
                  : 'assess-survey__btn'
              }
              aria-pressed={accuracy === option.value}
              onClick={() => onFeedback({ profileAccuracy: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="assess-survey__title">Change practice?</p>
        <div
          className="assess-survey__row"
          role="group"
          aria-label="Change practice"
        >
          {PRACTICE_OPTIONS.map((option) => {
            const selected = feedback?.wouldChangePractice === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={
                  selected
                    ? 'assess-survey__btn assess-survey__btn--on'
                    : 'assess-survey__btn'
                }
                aria-pressed={selected}
                onClick={() => onFeedback({ wouldChangePractice: option.value })}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        {accuracy && feedback?.wouldChangePractice ? (
          <p className="assess-survey__thanks">Thanks. That helps.</p>
        ) : null}
      </div>

      <div className="assess-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onSave}>
          Done
        </Button>
        <Button variant="secondary" block onClick={onRetake}>
          Retake
        </Button>
      </div>
    </section>
  )
}
