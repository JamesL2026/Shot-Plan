import { Button } from '../ui/Button'
import { JOURNAL_CATEGORIES } from '../../data/roundReview'
import type { JournalCategory, RoundJournal } from '../../types/round'

interface RoundJournalProps {
  journal: RoundJournal
  onChange: (next: RoundJournal) => void
  onSave: () => void
}

export function RoundJournalScreen({
  journal,
  onChange,
  onSave,
}: RoundJournalProps) {
  function toggleWorked(category: JournalCategory) {
    const selected = journal.workedWell.includes(category)
    if (selected) {
      onChange({
        ...journal,
        workedWell: journal.workedWell.filter((item) => item !== category),
      })
      return
    }
    if (journal.workedWell.length >= 2) return
    onChange({ ...journal, workedWell: [...journal.workedWell, category] })
  }

  return (
    <section className="rr-journal animate-in">
      <p className="rr-kicker">Round Journal</p>
      <h1>What do you want to remember from today?</h1>

      <label className="rr-note-label" htmlFor="journal-remember">
        Optional
      </label>
      <textarea
        id="journal-remember"
        className="rr-note"
        rows={3}
        maxLength={200}
        placeholder="One thing I want to remember..."
        value={journal.remember ?? ''}
        onChange={(event) => onChange({ ...journal, remember: event.target.value })}
      />

      <p className="rr-prompt">What worked well today?</p>
      <p className="muted rr-hint">Up to two.</p>
      <div className="rr-cats" role="group" aria-label="What worked">
        {JOURNAL_CATEGORIES.map((item) => {
          const on = journal.workedWell.includes(item.value)
          return (
            <button
              key={item.value}
              type="button"
              className={on ? 'rr-cat rr-cat--on' : 'rr-cat'}
              aria-pressed={on}
              disabled={!on && journal.workedWell.length >= 2}
              onClick={() => toggleWorked(item.value)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <p className="rr-prompt">What needs attention next?</p>
      <p className="muted rr-hint">Pick one.</p>
      <div className="rr-cats" role="group" aria-label="Needs attention">
        {JOURNAL_CATEGORIES.map((item) => {
          const on = journal.needsAttention === item.value
          return (
            <button
              key={item.value}
              type="button"
              className={on ? 'rr-cat rr-cat--on' : 'rr-cat'}
              aria-pressed={on}
              onClick={() =>
                onChange({
                  ...journal,
                  needsAttention: on ? undefined : item.value,
                })
              }
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onSave}>
          Save Round
        </Button>
      </div>
    </section>
  )
}
