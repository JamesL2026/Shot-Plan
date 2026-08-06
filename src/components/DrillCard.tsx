import { useId, useState } from 'react'
import { getSymptom } from '../data/symptoms'
import type { Drill } from '../types'

interface DrillCardProps {
  drill: Drill
}

export function DrillCard({ drill }: DrillCardProps) {
  const [whyOpen, setWhyOpen] = useState(false)
  const whyId = useId()
  const symptomLabel = getSymptom(drill.symptomId)?.label ?? drill.symptomId

  return (
    <article className="drill-card">
      <p className="drill-card__symptom">{symptomLabel}</p>
      <h2 className="drill-card__name">{drill.name}</h2>

      <dl className="drill-card__meta">
        <div>
          <dt>Likely cause</dt>
          <dd>{drill.likelyCause}</dd>
        </div>
        <div>
          <dt>What to do</dt>
          <dd>{drill.howTo}</dd>
        </div>
        <div>
          <dt>Cue</dt>
          <dd className="drill-card__cue">{drill.cue}</dd>
        </div>
      </dl>

      <button
        type="button"
        className="why-toggle"
        aria-expanded={whyOpen}
        aria-controls={whyId}
        onClick={() => setWhyOpen((open) => !open)}
      >
        {whyOpen ? 'Hide explanation' : 'Why does this happen?'}
      </button>

      {whyOpen && (
        <div id={whyId} className="why-panel" role="region" aria-label="Why this happens">
          <p>{drill.whyExplanation}</p>
        </div>
      )}
    </article>
  )
}
