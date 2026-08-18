import { X } from 'lucide-react'
import { subLabel, typeLabel } from '../../data/moments'
import type { Moment } from '../../types/memory'

interface MomentListProps {
  moments: Moment[]
  selectedId?: string
  selectable?: boolean
  onSelect?: (moment: Moment) => void
  onRemove?: (id: string) => void
}

export function MomentList({
  moments,
  selectedId,
  selectable = false,
  onSelect,
  onRemove,
}: MomentListProps) {
  if (moments.length === 0) return null

  return (
    <ul className="sp-memory-list">
      {moments.map((moment) => {
        const selected = selectedId === moment.id
        const label = momentLine(moment)
        return (
          <li key={moment.id}>
            <div
              className={
                selected ? 'sp-memory-item sp-memory-item--on' : 'sp-memory-item'
              }
            >
              {selectable && onSelect ? (
                <button
                  type="button"
                  className="sp-memory-item__main"
                  onClick={() => onSelect(moment)}
                >
                  <span className="sp-memory-item__title">{label}</span>
                  <span className="sp-memory-item__kind">
                    {selected
                      ? 'Watch this next round'
                      : `${typeLabel(moment.type)} · tap to carry forward`}
                  </span>
                </button>
              ) : (
                <div className="sp-memory-item__main">
                  <span className="sp-memory-item__title">{label}</span>
                  <span className="sp-memory-item__kind">
                    {typeLabel(moment.type)}
                  </span>
                </div>
              )}
              {onRemove ? (
                <button
                  type="button"
                  className="sp-memory-item__remove"
                  aria-label={`Remove ${label}`}
                  onClick={() => onRemove(moment.id)}
                >
                  <X size={18} strokeWidth={2.25} />
                </button>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function momentLine(moment: Moment): string {
  const what = subLabel(moment.type, moment.subcategory)
  if (moment.holeNumber) return `Hole ${moment.holeNumber} · ${what}`
  return what
}
