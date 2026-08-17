import { Button } from '../ui/Button'
import {
  COMMON_SCORES,
  MISTAKE_CATEGORIES,
  POSITIVE_CHOICES,
  SUBS_BY_CATEGORY,
} from '../../data/roundReview'
import type {
  MistakeCategory,
  MistakeSubcategory,
  PositiveCategory,
} from '../../types/round'

export interface HoleDraft {
  score: number | null
  categories: MistakeCategory[]
  subs: Partial<Record<MistakeCategory, MistakeSubcategory>>
  positives: PositiveCategory[]
  rememberThisHole: boolean
}

interface HoleReviewProps {
  holeNumber: number
  draft: HoleDraft
  onChange: (next: HoleDraft) => void
  onNothing: () => void
  onNext: () => void
  onBackHole?: () => void
}

export function HoleReviewScreen({
  holeNumber,
  draft,
  onChange,
  onNothing,
  onNext,
  onBackHole,
}: HoleReviewProps) {
  const canNext = typeof draft.score === 'number'

  function setScore(score: number) {
    onChange({ ...draft, score })
  }

  function toggleCategory(category: MistakeCategory) {
    const selected = draft.categories.includes(category)
    const categories = selected
      ? draft.categories.filter((item) => item !== category)
      : [...draft.categories, category]
    const subs = { ...draft.subs }
    if (selected) delete subs[category]
    onChange({ ...draft, categories, subs })
  }

  function setSub(category: MistakeCategory, subcategory: MistakeSubcategory) {
    onChange({
      ...draft,
      categories: draft.categories.includes(category)
        ? draft.categories
        : [...draft.categories, category],
      subs: { ...draft.subs, [category]: subcategory },
    })
  }

  function togglePositive(category: PositiveCategory) {
    const selected = draft.positives.includes(category)
    onChange({
      ...draft,
      positives: selected
        ? draft.positives.filter((item) => item !== category)
        : [...draft.positives, category],
    })
  }

  return (
    <section className="rr-hole animate-in">
      <p className="rr-kicker">Hole {holeNumber}</p>
      <h1>Score</h1>

      <div className="rr-scores" role="group" aria-label="Hole score">
        {COMMON_SCORES.map((score) => (
          <button
            key={score}
            type="button"
            className={
              draft.score === score ? 'rr-score rr-score--on' : 'rr-score'
            }
            aria-pressed={draft.score === score}
            onClick={() => setScore(score)}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="rr-score-step">
        <button
          type="button"
          className="rr-score-nudge"
          disabled={!canNext || (draft.score ?? 0) <= 1}
          onClick={() => canNext && setScore(Math.max(1, (draft.score ?? 1) - 1))}
        >
          −
        </button>
        <p className="rr-score-current">
          {canNext ? `Score: ${draft.score}` : 'Tap a score'}
        </p>
        <button
          type="button"
          className="rr-score-nudge"
          disabled={!canNext || (draft.score ?? 0) >= 15}
          onClick={() => canNext && setScore(Math.min(15, (draft.score ?? 1) + 1))}
        >
          +
        </button>
      </div>

      <p className="rr-prompt">Anything worth remembering?</p>

      <button
        type="button"
        className="rr-nothing"
        disabled={!canNext}
        onClick={onNothing}
      >
        Nothing
      </button>

      <div className="rr-cats" role="group" aria-label="Mistake categories">
        {MISTAKE_CATEGORIES.map((item) => {
          const on = draft.categories.includes(item.value)
          return (
            <button
              key={item.value}
              type="button"
              className={on ? 'rr-cat rr-cat--on' : 'rr-cat'}
              aria-pressed={on}
              onClick={() => toggleCategory(item.value)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {draft.categories.map((category) => (
        <div key={category} className="rr-subs">
          <p className="rr-subs__label">
            {MISTAKE_CATEGORIES.find((item) => item.value === category)?.label}
          </p>
          <div role="group" aria-label={`${category} detail`}>
            {SUBS_BY_CATEGORY[category].map((sub) => {
              const on = draft.subs[category] === sub.value
              return (
                <button
                  key={sub.value}
                  type="button"
                  className={on ? 'rr-chip rr-chip--on' : 'rr-chip'}
                  aria-pressed={on}
                  onClick={() => setSub(category, sub.value)}
                >
                  {sub.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <p className="rr-prompt rr-prompt--quiet">Anything great?</p>
      <div className="rr-positives" role="group" aria-label="Great shots">
        {POSITIVE_CHOICES.map((item) => {
          const on = draft.positives.includes(item.value)
          return (
            <button
              key={item.value}
              type="button"
              className={on ? 'rr-chip rr-chip--on' : 'rr-chip'}
              aria-pressed={on}
              onClick={() => togglePositive(item.value)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className={
          draft.rememberThisHole ? 'rr-remember rr-remember--on' : 'rr-remember'
        }
        aria-pressed={draft.rememberThisHole}
        onClick={() =>
          onChange({ ...draft, rememberThisHole: !draft.rememberThisHole })
        }
      >
        Remember This Hole
      </button>

      <div className="rr-actions rr-actions--hole">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          disabled={!canNext}
          onClick={onNext}
        >
          {holeNumber >= 18 ? 'See Round Replay' : 'Next Hole'}
        </Button>
        {onBackHole ? (
          <button type="button" className="rr-text-link" onClick={onBackHole}>
            Previous hole
          </button>
        ) : null}
      </div>
    </section>
  )
}
