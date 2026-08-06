import type { EquipmentId } from '../types'

const LABELS: Record<EquipmentId, string> = {
  towel: 'Towel',
  'alignment-stick': 'Alignment Stick',
  tee: 'Tee',
  headcover: 'Headcover',
  clubs: 'Clubs',
  ball: 'Golf Ball',
  coin: 'Coin',
}

interface EquipmentIconsProps {
  items: EquipmentId[]
}

export function EquipmentIcons({ items }: EquipmentIconsProps) {
  const unique = [...new Set(items)]

  return (
    <ul className="equipment-list" aria-label="Equipment needed">
      {unique.map((item) => (
        <li key={item} className="equipment-chip">
          <span className="equipment-chip__icon" aria-hidden="true">
            <EquipmentSvg id={item} />
          </span>
          <span>{LABELS[item]}</span>
        </li>
      ))}
    </ul>
  )
}

function EquipmentSvg({ id }: { id: EquipmentId }) {
  switch (id) {
    case 'towel':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <rect
            x="4"
            y="6"
            width="16"
            height="12"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeDasharray="3 2"
          />
        </svg>
      )
    case 'alignment-stick':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <line
            x1="4"
            y1="18"
            x2="20"
            y2="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'tee':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <line
            x1="12"
            y1="7"
            x2="12"
            y2="19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="6" r="3" fill="currentColor" />
        </svg>
      )
    case 'headcover':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
        </svg>
      )
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <line x1="8" y1="4" x2="8" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="12" y1="4" x2="12" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="16" y1="4" x2="16" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'ball':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      )
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.35" />
        </svg>
      )
  }
}
