import { AssessProgress } from './AssessProgress'
import { Button } from '../ui/Button'
import type { AssessmentTestDef, MissOption, ResultOption } from '../../data/assessment'
import { showsOptionalMiss } from '../../data/assessment'
import type { MissType, ShotResult, ShotScore } from '../../types/assessment'

export interface LogEntry {
  result: ShotResult
  score: ShotScore
  missType?: MissType
}

interface AssessmentLogSetProps {
  testNumber: number
  totalTests: number
  def: AssessmentTestDef
  entries: Array<LogEntry | null>
  continueLabel: string
  onSelectResult: (shotIndex: number, option: ResultOption) => void
  onSelectMiss: (shotIndex: number, miss: MissType) => void
  onContinue: () => void
}

export function AssessmentLogSet({
  testNumber,
  totalTests,
  def,
  entries,
  continueLabel,
  onSelectResult,
  onSelectMiss,
  onContinue,
}: AssessmentLogSetProps) {
  const ready = entries.every((entry) => entry !== null)

  return (
    <section className="assess-log animate-in">
      <p className="assess-progress">
        Test {testNumber} of {totalTests}
      </p>
      <AssessProgress current={testNumber} total={totalTests} />
      <p className="assess-test-name">{def.title}</p>
      <h1>{def.logPrompt}</h1>

      <div className="assess-log-list">
        {entries.map((entry, index) => (
          <ShotLogRow
            key={index}
            shotNumber={index + 1}
            options={def.resultOptions}
            missOptions={def.missOptions}
            entry={entry}
            onSelectResult={(option) => onSelectResult(index, option)}
            onSelectMiss={(miss) => onSelectMiss(index, miss)}
          />
        ))}
      </div>

      <div className="assess-actions">
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          disabled={!ready}
          onClick={onContinue}
        >
          {continueLabel}
        </Button>
      </div>
    </section>
  )
}

function ShotLogRow({
  shotNumber,
  options,
  missOptions,
  entry,
  onSelectResult,
  onSelectMiss,
}: {
  shotNumber: number
  options: ResultOption[]
  missOptions?: MissOption[]
  entry: LogEntry | null
  onSelectResult: (option: ResultOption) => void
  onSelectMiss: (miss: MissType) => void
}) {
  const showMiss =
    Boolean(missOptions?.length) &&
    entry !== null &&
    showsOptionalMiss(entry.result)

  return (
    <div className="assess-log-shot">
      <p className="assess-log-shot__label">Shot {shotNumber}</p>
      <div
        className="assess-log-row"
        role="group"
        aria-label={`Shot ${shotNumber}`}
      >
        {options.map((option) => {
          const selected = entry?.result === option.result
          return (
            <button
              key={option.result}
              type="button"
              className={
                selected
                  ? 'assess-log-opt assess-log-opt--on'
                  : 'assess-log-opt'
              }
              aria-pressed={selected}
              onClick={() => onSelectResult(option)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {showMiss && missOptions ? (
        <div
          className="assess-log-miss"
          role="group"
          aria-label={`Shot ${shotNumber} miss detail, optional`}
        >
          {missOptions.map((option) => {
            const selected = entry?.missType === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={
                  selected
                    ? 'assess-log-miss-opt assess-log-miss-opt--on'
                    : 'assess-log-miss-opt'
                }
                aria-pressed={selected}
                onClick={() => onSelectMiss(option.value)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
