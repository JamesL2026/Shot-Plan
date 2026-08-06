import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FlowProgress } from '../components/FlowProgress'
import { getDrillsForSymptoms } from '../data/drills'
import { symptoms } from '../data/symptoms'
import { createSession } from '../lib/storage'
import type { SymptomId } from '../types'

const MAX_SELECTIONS = 2

export function CheckIn() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<SymptomId[]>([])

  const canContinue = selected.length > 0
  const atLimit = selected.length >= MAX_SELECTIONS

  function toggleSymptom(id: SymptomId) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev
      }
      return [...prev, id]
    })
  }

  function handleContinue() {
    if (selected.length === 0) return
    const drills = getDrillsForSymptoms(selected)
    const session = createSession({
      symptomIds: selected,
      drillIds: drills.map((drill) => drill.id),
    })
    navigate(`/results?session=${session.id}`)
  }

  const hint = useMemo(() => {
    if (selected.length === 0) return 'Select at least one symptom.'
    if (selected.length === 1) return '1 selected — you can add one more.'
    return '2 selected — ready for your plan.'
  }, [selected.length])

  return (
    <section className="page check-in">
      <Link to="/" className="back-link">
        ← Home
      </Link>

      <FlowProgress step={1} />

      <div className="page-intro">
        <h1>What went wrong?</h1>
        <p className="muted">
          Pick one or two. We’ll write a short practice prescription for the range.
        </p>
      </div>

      <div className="symptom-grid" role="group" aria-label="Symptoms">
        {symptoms.map((symptom) => {
          const isSelected = selected.includes(symptom.id)
          const isDisabled = atLimit && !isSelected

          return (
            <button
              key={symptom.id}
              type="button"
              className={
                isSelected
                  ? 'symptom-card symptom-card--selected'
                  : 'symptom-card'
              }
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => toggleSymptom(symptom.id)}
            >
              <span className="symptom-card__label">{symptom.label}</span>
              <span className="symptom-card__desc">{symptom.description}</span>
            </button>
          )
        })}
      </div>

      <p className="selection-hint muted" aria-live="polite">
        {hint}
      </p>

      <div className="sticky-footer">
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue to plan
        </button>
      </div>
    </section>
  )
}
