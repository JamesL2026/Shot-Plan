interface AssessProgressProps {
  current: number
  total: number
}

export function AssessProgress({ current, total }: AssessProgressProps) {
  return (
    <div
      className="assess-dots"
      aria-label={`Test ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={
            index < current
              ? 'assess-dots__item assess-dots__item--on'
              : 'assess-dots__item'
          }
        />
      ))}
    </div>
  )
}
