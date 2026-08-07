import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { DrillCard } from '../components/DrillCard'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { getDrillById } from '../data/drills'
import { getSymptom } from '../data/symptoms'
import { applyChallenge, pickChallenge } from '../lib/sessionPractice'

export function DrillDetail() {
  const { drillId } = useParams()
  const base = drillId ? getDrillById(drillId) : undefined
  const drill = useMemo(() => {
    if (!base) return undefined
    return applyChallenge(base, pickChallenge(base.id, 'library', 0))
  }, [base])

  if (!drill) {
    return (
      <section className="page animate-in">
        <BackLink to="/library">Practice Library</BackLink>
        <h1>Challenge not found</h1>
        <p className="muted">That challenge is not in the library.</p>
        <Button to="/library" variant="primary" block>
          Back to Practice Library
        </Button>
      </section>
    )
  }

  const symptom = getSymptom(drill.symptomId)

  return (
    <section className="page drill-detail animate-in">
      <BackLink to="/library">Practice Library</BackLink>

      {symptom && (
        <p className="drill-detail__context muted">
          Part of fixing {symptom.label.toLowerCase()}
        </p>
      )}

      <DrillCard drill={drill} mode="library" />

      <Button to="/check-in" variant="primary" block>
        Check in for a coaching session
      </Button>
    </section>
  )
}
