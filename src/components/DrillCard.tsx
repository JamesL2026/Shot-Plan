import { useState } from 'react'
import { Check, Image as ImageIcon, LayoutGrid } from 'lucide-react'
import { getDrillPhoto } from '../data/drillPhotos'
import { getSymptom } from '../data/symptoms'
import type { AdaptedDrill, Drill, SurfaceType } from '../types'
import { DrillDiagram } from './DrillDiagram'
import { EquipmentIcons } from './EquipmentIcons'
import { Card } from './ui/Card'

interface DrillCardProps {
  drill: Drill | AdaptedDrill
  index?: number
  /** Guided session: only coach-useful sections. Library keeps fuller detail. */
  mode?: 'guided' | 'library'
}

function isAdapted(drill: Drill | AdaptedDrill): drill is AdaptedDrill {
  return 'diagramVariant' in drill
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

export function DrillCard({
  drill,
  index,
  mode = 'library',
}: DrillCardProps) {
  const guided = mode === 'guided'
  const symptomLabel = getSymptom(drill.symptomId)?.label ?? drill.symptomId
  const photo = getDrillPhoto(drill.id)
  const [setupView, setSetupView] = useState<SetupView>('diagram')
  const clubLabel = isAdapted(drill) ? drill.clubLabel : null
  const diagramVariant = isAdapted(drill) ? drill.diagramVariant : 'default'
  const successCondition = isAdapted(drill) ? drill.successCondition : undefined
  const reflection = isAdapted(drill) ? drill.reflection : undefined

  const photoCaption = (() => {
    if (!photo) return null
    if (!clubLabel) return photo.caption
    const chosen = clubLabel.toLowerCase()
    const shown = photo.photoClub
    const mismatch =
      (chosen.includes('iron') && shown === 'driver') ||
      (chosen.includes('driver') && (shown === 'iron' || shown === 'wedge')) ||
      (chosen.includes('wedge') && shown === 'driver')
    if (mismatch) {
      return `${photo.caption} Your session is set for ${clubLabel} — trust the diagram for stance and ball position.`
    }
    return photo.caption
  })()

  return (
    <Card className="drill-card" padding="lg">
      <header className="drill-card__header">
        {!guided && (
          <div className="drill-card__topline">
            {typeof index === 'number' && (
              <span className="drill-card__index">Challenge {index}</span>
            )}
            <span className="drill-card__badge">{symptomLabel}</span>
          </div>
        )}
        <h2 className="drill-card__name">{drill.name}</h2>
        <p className="drill-card__focus-tag">{drill.bodyFocus}</p>
        {clubLabel && (
          <p className="drill-card__club-note">Setup for {clubLabel}</p>
        )}
      </header>

      <div className="drill-card__section">
        <h3 className="drill-card__label">
          {guided ? "Today's Focus" : "Today's Focus"}
        </h3>
        <p>{drill.goal}</p>
      </div>

      {!guided && (
        <div className="drill-card__section">
          <h3 className="drill-card__label">Works On</h3>
          <SurfaceChecks worksOn={drill.worksOn} />
          {drill.matAdjustment && (
            <div className="mat-adjustment">
              <p className="mat-adjustment__title">Mat Adjustment</p>
              <p>{drill.matAdjustment}</p>
            </div>
          )}
        </div>
      )}

      <div className="drill-card__section">
        <h3 className="drill-card__label">Equipment</h3>
        <EquipmentIcons items={drill.equipment} />
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Setup</h3>
        <p className="drill-card__setup">{drill.setup}</p>
        {guided && drill.matAdjustment && (
          <div className="mat-adjustment">
            <p className="mat-adjustment__title">On mats</p>
            <p>{drill.matAdjustment}</p>
          </div>
        )}

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
          {photo && (
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
          )}
        </div>

        {setupView === 'diagram' || !photo ? (
          <>
            <DrillDiagram
              drillId={drill.id}
              view={drill.view}
              variant={diagramVariant}
            />
            <p className="drill-card__diagram-hint muted">
              {clubLabel
                ? `Diagram is drawn for ${clubLabel}. Match this club, ball position, and stance.`
                : guided
                  ? 'Match the numbered pieces on the ground. No video needed.'
                  : 'Numbers match the setup. Glance once, then set it up.'}
            </p>
            {guided && drill.view === 'top' && (
              <p className="drill-card__orient muted">
                Top view: for a right-handed golfer, the target is to your left.
              </p>
            )}
            {!photo && (
              <p className="drill-card__orient muted">
                Use the diagram for this drill. A matching real-setup photo is not available yet.
              </p>
            )}
          </>
        ) : (
          <>
            <figure className="drill-photo">
              <img
                src={photo.src}
                alt={`Real-life setup for ${drill.name}`}
                className="drill-photo__img"
                loading="lazy"
                width={1200}
                height={800}
              />
            </figure>
            <p className="drill-card__diagram-hint muted">{photoCaption}</p>
          </>
        )}
      </div>

      <div className="drill-card__section">
        <h3 className="drill-card__label">Coach&apos;s Challenge</h3>
        <ol className="drill-card__steps">
          {drill.steps.map((step, stepIndex) => (
            <li key={`${stepIndex}-${step}`}>
              <span className="drill-card__step-num" aria-hidden="true">
                {stepIndex + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {guided && (
        <div className="drill-card__watch">
          <h3 className="drill-card__label">Watch Out For</h3>
          <p>{drill.commonMistake.instead}</p>
        </div>
      )}

      {successCondition && (
        <div className="drill-card__success">
          <h3 className="drill-card__label">
            {guided ? "How You'll Know It Worked" : 'Success Condition'}
          </h3>
          <p>{successCondition}</p>
        </div>
      )}

      {!guided && (
        <>
          <div className="drill-card__mistake">
            <h3 className="drill-card__label">Common Mistake</h3>
            <p className="drill-card__mistake-bad">{drill.commonMistake.mistake}</p>
            <p className="drill-card__mistake-good">
              <span>Instead:</span> {drill.commonMistake.instead}
            </p>
          </div>

          <div className="drill-card__cue-block">
            <h3 className="drill-card__label">Coaching Cue</h3>
            <p className="drill-card__cue">{drill.cue}</p>
          </div>
        </>
      )}

      <div className="drill-card__section">
        <h3 className="drill-card__label">What I Want You To Feel</h3>
        <p>{drill.whyItWorks}</p>
      </div>

      {reflection && (
        <div className="drill-card__section">
          <h3 className="drill-card__label">Reflection</h3>
          <p>{reflection}</p>
        </div>
      )}
    </Card>
  )
}
