import { useState } from 'react'
import type { Drill } from '../types'
import { DrillCard } from './DrillCard'
import { Button } from './ui/Button'

interface DrillFocusProps {
  drills: Drill[]
  index: number
  onIndexChange: (index: number) => void
  onExit: () => void
  onFinishedAll: () => void
}

export function DrillFocus({
  drills,
  index,
  onIndexChange,
  onExit,
  onFinishedAll,
}: DrillFocusProps) {
  const [showHelp, setShowHelp] = useState(false)
  const drill = drills[index]
  const isLast = index >= drills.length - 1
  const total = drills.length

  if (!drill) return null

  function handleContinue() {
    setShowHelp(false)
    if (isLast) {
      onFinishedAll()
      return
    }
    onIndexChange(index + 1)
  }

  return (
    <section className="drill-focus animate-in">
      <div className="drill-focus__progress">
        <p className="drill-focus__count">
          Drill {index + 1} of {total}
        </p>
        <div className="drill-focus__dots" aria-hidden="true">
          {drills.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={
                i === index
                  ? 'drill-focus__dot drill-focus__dot--active'
                  : i < index
                    ? 'drill-focus__dot drill-focus__dot--done'
                    : 'drill-focus__dot'
              }
              aria-label={`Go to drill ${i + 1}`}
              onClick={() => {
                setShowHelp(false)
                onIndexChange(i)
              }}
            />
          ))}
        </div>
      </div>

      <DrillCard drill={drill} index={index + 1} />

      {showHelp && (
        <aside className="clarify-panel" aria-live="polite">
          <p className="clarify-panel__title">Quick clarification</p>
          <p>
            <strong>Setup in one line:</strong> {drill.setup}
          </p>
          <p>
            <strong>Don’t:</strong> {drill.commonMistake.mistake}
          </p>
          <p>
            <strong>Do:</strong> {drill.commonMistake.instead}
          </p>
          <p>
            <strong>Remember:</strong> {drill.cue}
          </p>
          {drill.matAdjustment && (
            <p>
              <strong>On mats:</strong> {drill.matAdjustment}
            </p>
          )}
          {drill.view === 'top' && (
            <p className="clarify-panel__orient muted">
              Top view tip: for a right-handed golfer, the target is to your left —
              not in front of your toes.
            </p>
          )}
        </aside>
      )}

      <div className="drill-focus__actions">
        <Button variant="primary" block onClick={handleContinue}>
          {isLast ? 'Done with drills — practice checklist' : 'Continue to next drill'}
        </Button>
        <Button
          variant="secondary"
          block
          onClick={() => setShowHelp((open) => !open)}
        >
          {showHelp ? 'Hide clarification' : 'Ask for clarification'}
        </Button>
        <Button variant="secondary" block onClick={onExit}>
          Exit to plan
        </Button>
      </div>
    </section>
  )
}
