interface FlowProgressProps {
  step: 1 | 2 | 3
}

const LABELS = ['Check in', 'Coach brief', 'Round Ready'] as const

export function FlowProgress({ step }: FlowProgressProps) {
  return (
    <div className="flow-progress" aria-label={`Step ${step} of 3`}>
      <p className="flow-progress__label">
        Step {step} of 3
        <span className="flow-progress__sep">·</span>
        {LABELS[step - 1]}
      </p>
      <div className="flow-progress__track" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={
              n <= step
                ? 'flow-progress__dot flow-progress__dot--active'
                : 'flow-progress__dot'
            }
          />
        ))}
      </div>
    </div>
  )
}
