import { EXPERIMENT_HELP } from '../../data/moments'
import type { ExperimentHelp } from '../../types/memory'

export function HelpButtons({
  prompt,
  value,
  onChange,
  options = EXPERIMENT_HELP,
}: {
  prompt: string
  value?: ExperimentHelp
  onChange: (value: ExperimentHelp) => void
  options?: { value: ExperimentHelp; label: string }[]
}) {
  return (
    <div className="sp-help">
      <p className="rr-prompt">{prompt}</p>
      <div className="rr-cats rr-cats--stack">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            className={value === item.value ? 'rr-cat rr-cat--on' : 'rr-cat'}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
