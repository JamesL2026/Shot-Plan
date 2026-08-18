import { Button } from '../ui/Button'
import { groupHelpful } from '../../data/practiceStarts'
import { storage } from '../../lib/memoryStorage'
import type { Adjustment } from '../../types/memory'

function helpfulLine(count: number) {
  if (count === 1) return 'Helpful once'
  return `Helpful in ${count} practice sessions`
}

export function PreviousHelpful({
  title,
  adjustments,
  onPick,
  onBack,
}: {
  title: string
  adjustments: Adjustment[]
  onPick: (whatITried: string) => void
  onBack: () => void
}) {
  const grouped = groupHelpful(adjustments)
  const helpful = grouped.filter((item) => item.helpful > 0)
  const triedOnly = grouped.filter((item) => item.helpful === 0)
  const courseWorked = adjustments.some((item) =>
    storage
      .getCourseObservations(item.focusId)
      .some((row) => row.result === 'worked'),
  )
  const oneHelpful = helpful.length === 1

  return (
    <section className="page rr-page">
      <p className="rr-kicker">{title}</p>
      <h1>Previously reported helpful</h1>
      {helpful.length === 0 && triedOnly.length === 0 ? (
        <p className="muted">Nothing saved here yet.</p>
      ) : null}

      {helpful.map((item) => (
        <div key={item.label} className="sp-plan-block">
          <p className="sp-subhead">{item.label}</p>
          <p className="muted">{helpfulLine(item.helpful)}</p>
          <p className="muted">
            {courseWorked && oneHelpful
              ? 'Appears to be holding up on the course'
              : 'Course transfer not confirmed'}
          </p>
          <Button variant="primary" block onClick={() => onPick(item.label)}>
            Retest
          </Button>
        </div>
      ))}

      {triedOnly.length > 0 ? (
        <>
          <p className="rr-kicker">Needs more evidence</p>
          {triedOnly.map((item) => (
            <div key={item.label} className="sp-plan-block">
              <p className="sp-subhead">{item.label}</p>
              <p className="muted">Tried before. Needs more evidence.</p>
              <Button variant="secondary" block onClick={() => onPick(item.label)}>
                Retest
              </Button>
            </div>
          ))}
        </>
      ) : null}

      <button type="button" className="rr-text-link" onClick={onBack}>
        Back
      </button>
    </section>
  )
}
