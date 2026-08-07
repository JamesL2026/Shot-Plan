import { useState } from 'react'
import { Check, Image as ImageIcon, LayoutGrid } from 'lucide-react'
import { getSymptom } from '../data/symptoms'
import type { Drill, SurfaceType } from '../types'
import { DrillDiagram } from './DrillDiagram'
import { EquipmentIcons } from './EquipmentIcons'
import { Card } from './ui/Card'

interface DrillCardProps {
  drill: Drill
  index?: number
}

function SurfaceChecks({ worksOn }: { worksOn: SurfaceType }) {
  const mats = worksOn === 'mats' || worksOn === 'both'
  const grass = worksOn === 'grass' || worksOn === 'both'

  return (
    <ul className="surface-checks">
      {mats && (
        <li>
          <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          Practice Mats
        </li>
      )}
      {grass && (
        <li>
          <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          Grass
        </li>
      )}
    </ul>
  )
}

type SetupView = 'diagram' | 'photo'

export function DrillCard({ drill, index }: DrillCardProps) {
  const symptomLabel = getSymptom(drill.symptomId)?.label ?? drill.symptomId
  const [setupView, setSetupView] = useState<SetupView>('diagram')
  const photoSrc = `/drills/${drill.id}.jpg`

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
        <SurfaceChecks worksOn={drill.worksOn} />
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
        <p className="drill-card__setup">{drill.setup}</p>

        <div className="setup-view-toggle" role="group" aria-label="Setup view">
          <button
            type="button"
            className={
              setupView === 'diagram'
                ? 'setup-view-toggle__btn setup-view-toggle__btn--active'
                : 'setup-view-toggle__btn'
            }
            onClick={() => setSetupView('diagram')}
            aria-pressed={setupView === 'diagram'}
          >
            <LayoutGrid size={16} strokeWidth={2.25} aria-hidden="true" />
            Diagram
          </button>
          <button
            type="button"
            className={
              setupView === 'photo'
                ? 'setup-view-toggle__btn setup-view-toggle__btn--active'
                : 'setup-view-toggle__btn'
            }
            onClick={() => setSetupView('photo')}
            aria-pressed={setupView === 'photo'}
          >
            <ImageIcon size={16} strokeWidth={2.25} aria-hidden="true" />
            See real setup
          </button>
        </div>

        {setupView === 'diagram' ? (
          <>
            <DrillDiagram drillId={drill.id} view={drill.view} />
            <p className="drill-card__diagram-hint muted">
              Numbers match the setup pieces above. Glance once, then set it up.
            </p>
          </>
        ) : (
          <>
            <figure className="drill-photo">
              <img
                src={photoSrc}
                alt={`Real-life setup for ${drill.name}`}
                className="drill-photo__img"
                loading="lazy"
                width={1200}
                height={800}
              />
            </figure>
            <p className="drill-card__diagram-hint muted">
              Photo of how this drill looks in real life. Match this layout on your mat.
            </p>
          </>
        )}
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
