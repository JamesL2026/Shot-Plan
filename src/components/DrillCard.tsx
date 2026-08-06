import { getSymptom } from '../data/symptoms'
import type { Drill, SurfaceType } from '../types'
import { DrillDiagram } from './DrillDiagram'
import { EquipmentIcons } from './EquipmentIcons'
import { Card } from './ui/Card'

interface DrillCardProps {
  drill: Drill
  index?: number
}

function surfaceLabel(worksOn: SurfaceType): string {
  switch (worksOn) {
    case 'mats':
      return 'Practice Mats'
    case 'grass':
      return 'Grass'
    case 'both':
      return 'Both'
  }
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

      <div className="drill-card__section">
        <h3 className="drill-card__label">Goal</h3>
        <p>{drill.goal}</p>
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Works on</h3>
        <p className="drill-card__surface">{surfaceLabel(drill.worksOn)}</p>
        {drill.matAdjustment && (
          <div className="mat-adjustment">
            <p className="mat-adjustment__title">Mat Adjustment</p>
            <p>{drill.matAdjustment}</p>
          </div>
        )}
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Equipment</h3>
        <EquipmentIcons items={drill.equipment} />
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Setup</h3>
        <p>{drill.setup}</p>
        <DrillDiagram drillId={drill.id} view={drill.view} />
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Practice</h3>
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

      <div className="drill-card__mistake">
        <h3 className="drill-card__label">Common mistake</h3>
        <p className="drill-card__mistake-bad">{drill.commonMistake.mistake}</p>
        <p className="drill-card__mistake-good">
          <span>Instead:</span> {drill.commonMistake.instead}
        </p>
      </div>

      <div className="drill-card__cue-block">
        <h3 className="drill-card__label">Coaching cue</h3>
        <p className="drill-card__cue">{drill.cue}</p>
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Why it works</h3>
        <p>{drill.whyItWorks}</p>
      </div>
    </Card>
  )
}
