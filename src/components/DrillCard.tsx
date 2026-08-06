import { getSymptom } from '../data/symptoms'
import type { Drill } from '../types'
import { DrillDiagram } from './DrillDiagram'
import { EquipmentIcons } from './EquipmentIcons'

interface DrillCardProps {
  drill: Drill
  index?: number
}

export function DrillCard({ drill, index }: DrillCardProps) {
  const symptomLabel = getSymptom(drill.symptomId)?.label ?? drill.symptomId

  return (
    <article className="drill-card">
      <header className="drill-card__header">
        {typeof index === 'number' && (
          <span className="drill-card__index">Drill {index}</span>
        )}
        <p className="drill-card__symptom">{symptomLabel}</p>
        <h2 className="drill-card__name">{drill.name}</h2>
      </header>

      <DrillDiagram drillId={drill.id} />

      <div className="drill-card__section">
        <h3 className="drill-card__label">Likely cause</h3>
        <p>{drill.likelyCause}</p>
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Steps</h3>
        <ol className="drill-card__steps">
          {drill.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="drill-card__cue-block">
        <h3 className="drill-card__label">Coaching cue</h3>
        <p className="drill-card__cue">{drill.cue}</p>
      </div>

      <div className="drill-card__section drill-card__why">
        <h3 className="drill-card__label">Why it works</h3>
        <p>{drill.whyItWorks}</p>
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Equipment</h3>
        <EquipmentIcons items={drill.equipment} />
      </div>
    </article>
  )
}
