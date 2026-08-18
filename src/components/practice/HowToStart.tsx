type StartPath = 'basic' | 'mine' | 'previous'

const PATHS: { value: StartPath; title: string; desc: string }[] = [
  {
    value: 'basic',
    title: 'Start with a basic test',
    desc: "You don't need to know what to change yet. Establish a baseline first.",
  },
  {
    value: 'mine',
    title: 'I already have something to try',
    desc: 'Test a feel, tip, drill, or adjustment you already have.',
  },
  {
    value: 'previous',
    title: 'Use something that worked before',
    desc: 'Retest something you previously reported as helpful.',
  },
]

export function HowToStart({
  title,
  hasHistory,
  onChoose,
  onBack,
}: {
  title: string
  hasHistory: boolean
  onChoose: (path: StartPath) => void
  onBack: () => void
}) {
  return (
    <section className="page rr-page">
      <p className="rr-kicker">{title}</p>
      <h1>How do you want to start?</h1>
      <p className="muted">
        ShotPlan does not tell you how to swing. Pick a simple way to begin.
      </p>
      <div className="sp-start">
        {PATHS.map((item) => {
          const disabled = item.value === 'previous' && !hasHistory
          return (
            <button
              key={item.value}
              type="button"
              className="sp-start__btn"
              disabled={disabled}
              onClick={() => {
                if (disabled) return
                onChoose(item.value)
              }}
            >
              <span className="sp-start__title">{item.title}</span>
              <span className="sp-start__desc">
                {disabled
                  ? 'Nothing saved here yet.'
                  : item.desc}
              </span>
            </button>
          )
        })}
      </div>
      <button type="button" className="rr-text-link" onClick={onBack}>
        Work on something else
      </button>
    </section>
  )
}

export type { StartPath }
