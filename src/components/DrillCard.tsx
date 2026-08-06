import { getSymptom } from '../data/symptoms'
import type { Drill } from '../types'
import { DrillDiagram } from './DrillDiagram'
import { EquipmentIcons } from './EquipmentIcons'
import { Card } from './ui/Card'

interface DrillCardProps {
  drill: Drill
  index?: number
}

export function DrillCard({ drill, index }: DrillCardProps) {
  const symptomLabel = getSymptom(drill.symptomId)?.label ?? drill.symptomId

  return (
    <Card className="drill-card" padding="lg">
      <header className="drill-card__header">
        <div className="drill-card__topline">
          {typeof index === 'number' && (
            <span className="drill-card__index">Drill {index}</span>
          )}
          <span className="drill-card__badge">{symptomLabel}</span>
        </div>
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
          {drill.steps.map((step, stepIndex) => (
            <li key={step}>
              <span className="drill-card__step-num" aria-hidden="true">
                {stepIndex + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="drill-card__cue-block">
        <h3 className="drill-card__label">Coaching cue</h3>
        <p className="drill-card__cue">{drill.cue}</p>
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Why it works</h3>
        <p>{drill.whyItWorks}</p>
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Equipment</h3>
        <EquipmentIcons items={drill.equipment} />
      </div>
    </Card>
  )
}
