import { Link, useParams } from 'react-router-dom'
import { DrillCard } from '../components/DrillCard'
import { getDrillById } from '../data/drills'
import { getSymptom } from '../data/symptoms'

export function DrillDetail() {
  const { drillId } = useParams()
  const drill = drillId ? getDrillById(drillId) : undefined

  if (!drill) {
    return (
      <section className="page">
        <Link to="/library" className="back-link">
          ← Library
        </Link>
        <h1>Drill not found</h1>
        <p className="muted">That drill isn’t in the library.</p>
        <Link to="/library" className="btn btn--primary btn--block">
          Back to library
        </Link>
      </section>
    )
  }

  const symptom = getSymptom(drill.symptomId)

  return (
    <section className="page drill-detail">
      <Link to="/library" className="back-link">
        ← Library
      </Link>

      {symptom && (
        <p className="drill-detail__context muted">
          Part of fixing {symptom.label.toLowerCase()}
        </p>
      )}

      <DrillCard drill={drill} />

      <Link to="/check-in" className="btn btn--primary btn--block">
        Check in for a full plan
      </Link>
    </section>
  )
}
