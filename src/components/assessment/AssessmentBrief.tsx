import { AssessProgress } from './AssessProgress'
import { Button } from '../ui/Button'
import type { AssessmentTestDef } from '../../data/assessment'

interface AssessmentBriefProps {
  testNumber: number
  totalTests: number
  def: AssessmentTestDef
  onHitAll: () => void
}

export function AssessmentBrief({
  testNumber,
  totalTests,
  def,
  onHitAll,
}: AssessmentBriefProps) {
  return (
    <section className="assess-brief animate-in">
      <p className="assess-progress">
        Test {testNumber} of {totalTests}
      </p>
      <AssessProgress current={testNumber} total={totalTests} />
      <p className="assess-test-name">{def.title}</p>
      <h1>{def.hitHeadline}</h1>
      <p className="assess-lead">{def.hitDetail}</p>
      <p className="muted assess-hint">Hit 3. Then log them.</p>
      <div className="assess-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onHitAll}>
          I Hit All 3
        </Button>
      </div>
    </section>
  )
}
