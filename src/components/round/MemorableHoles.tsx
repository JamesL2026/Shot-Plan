import { Button } from '../ui/Button'
import { MEMORABLE_REASONS } from '../../data/roundReview'
import type { HoleReview, MemorableReason } from '../../types/round'

interface MemorableHolesProps {
  hole: HoleReview
  remaining: number
  onReason: (reason: MemorableReason) => void
  onNote: (note: string) => void
  onContinue: () => void
}

export function MemorableHoles({
  hole,
  remaining,
  onReason,
  onNote,
  onContinue,
}: MemorableHolesProps) {
  return (
    <section className="rr-memorable animate-in">
      <p className="rr-kicker">Hole {hole.holeNumber}</p>
      <h1>What made this hole memorable?</h1>
      {remaining > 0 ? (
        <p className="muted">{remaining} more after this.</p>
      ) : null}

      <div className="rr-cats rr-cats--stack" role="group" aria-label="Why memorable">
        {MEMORABLE_REASONS.map((item) => {
          const on = hole.memorableReason === item.value
          return (
            <button
              key={item.value}
              type="button"
              className={on ? 'rr-cat rr-cat--on' : 'rr-cat'}
              aria-pressed={on}
              onClick={() => onReason(item.value)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <label className="rr-note-label" htmlFor="memorable-note">
        What happened? Optional.
      </label>
      <textarea
        id="memorable-note"
        className="rr-note"
        rows={3}
        maxLength={160}
        placeholder="One short note"
        value={hole.memorableNote ?? ''}
        onChange={(event) => onNote(event.target.value)}
      />

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </section>
  )
}
