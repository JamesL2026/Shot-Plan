import { AssessProgress } from './AssessProgress'
import { Button } from '../ui/Button'
import type { AssessmentTestDef } from '../../data/assessment'

interface AssessmentBriefProps {
  testNumber: number
  totalTests: number
  def: AssessmentTestDef
  isFirst: boolean
  onHitAll: () => void
}

export function AssessmentBrief({
  testNumber,
  totalTests,
  def,
  isFirst,
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
      <p className="assess-lead">{def.instruction}</p>

      <dl className="assess-setup">
        <div>
          <dt>Club</dt>
          <dd>{def.club}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{def.target}</dd>
        </div>
        <div>
          <dt>Shots</dt>
          <dd>3. Hit them all before you log</dd>
        </div>
      </dl>

      <p className="muted assess-hint">
        {isFirst
          ? 'Pocket your phone. Hit the 3 shots. Come back and tap I Hit All 3.'
          : def.hitDetail}
      </p>
      <div className="assess-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onHitAll}>
          I Hit All 3
        </Button>
      </div>
    </section>
  )
}
