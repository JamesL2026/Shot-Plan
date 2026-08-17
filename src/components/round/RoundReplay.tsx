import { Button } from '../ui/Button'
import {
  categoryLabel,
  ROUND_FEEL_OPTIONS,
  subcategoryLabel,
} from '../../data/roundReview'
import type { Round, RoundFeel } from '../../types/round'

interface RoundReplayProps {
  round: Round
  onFeel: (feel: RoundFeel) => void
  onContinue: () => void
  continueLabel?: string
  showFeel?: boolean
}

export function RoundReplay({
  round,
  onFeel,
  onContinue,
  continueLabel = 'Round Journal',
  showFeel = true,
}: RoundReplayProps) {
  const summary = round.summary
  const score = summary?.totalScore ?? round.holes.reduce((sum, hole) => sum + hole.score, 0)
  const counts = summary?.mistakeCounts ?? []
  const subs = summary?.topSubcategories ?? []
  const top = counts[0]

  return (
    <section className="rr-replay animate-in">
      <p className="rr-kicker">Round Replay</p>
      <p className="rr-overall-label">Today&apos;s score</p>
      <p className="rr-overall">{score}</p>
      <p className="muted rr-hint">Mistakes logged — not strokes lost.</p>

      {counts.length === 0 ? (
        <p className="rr-empty">No mistakes logged this round.</p>
      ) : (
        <ul className="rr-counts">
          {counts.map((item) => (
            <li key={item.category} className="rr-count">
              <span>{categoryLabel(item.category)}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      )}

      {top && subs.length > 0 ? (
        <div className="rr-subs-summary">
          <p className="rr-subs__label">{categoryLabel(top.category)}</p>
          <ul>
            {subs.map((item) => (
              <li key={`${item.category}-${item.subcategory}`}>
                {subcategoryLabel(item.category, item.subcategory)} ×{item.count}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rr-insight">
        <p className="rr-insight__label">What actually showed up?</p>
        <p className="rr-insight__text">
          {summary?.insight ?? 'Patterns in today\'s round will show here.'}
        </p>
      </div>

      {showFeel ? (
        <>
          <p className="rr-prompt rr-prompt--quiet">How did the round feel?</p>
          <div className="rr-feel" role="group" aria-label="Round feel">
            {ROUND_FEEL_OPTIONS.map((item) => {
              const on = round.feel === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  className={on ? 'rr-chip rr-chip--on' : 'rr-chip'}
                  aria-pressed={on}
                  onClick={() => onFeel(item.value)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </>
      ) : round.feel ? (
        <p className="muted">Felt {ROUND_FEEL_OPTIONS.find((item) => item.value === round.feel)?.label}.</p>
      ) : null}

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </section>
  )
}
