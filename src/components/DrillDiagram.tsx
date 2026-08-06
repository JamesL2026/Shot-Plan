import type { Drill } from '../types'

interface DrillDiagramProps {
  drillId: Drill['id']
  className?: string
}

/** Clean top-down setup diagrams — communicate layout at a glance. */
export function DrillDiagram({ drillId, className }: DrillDiagramProps) {
  return (
    <div className={className ? `drill-diagram ${className}` : 'drill-diagram'}>
      <svg
        viewBox="0 0 280 140"
        role="img"
        aria-label={diagramLabel(drillId)}
        className="drill-diagram__svg"
      >
        <rect width="280" height="140" rx="16" fill="#e4efe6" />
        <text
          x="14"
          y="22"
          fill="#5a6b5e"
          fontSize="10"
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
        >
          TOP VIEW
        </text>
        {renderDiagram(drillId)}
      </svg>
    </div>
  )
}

function diagramLabel(id: string): string {
  return `Setup diagram for ${id.replace(/-/g, ' ')}`
}

function Ball({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="8" fill="#f7faf6" stroke="#1a2e1f" strokeWidth="1.5" />
      <circle cx={cx - 2} cy={cy - 2} r="2" fill="#c9d6c8" />
    </>
  )
}

function Stick({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#2f6b45"
      strokeWidth="4"
      strokeLinecap="round"
    />
  )
}

function Towel({ x, y, w = 36, h = 22 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="4"
      fill="#f0e6d8"
      stroke="#8a7355"
      strokeWidth="1.5"
      strokeDasharray="3 2"
    />
  )
}

function Headcover({ cx, cy }: { cx: number; cy: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx="14"
      ry="10"
      fill="#2f6b45"
      stroke="#1a2e1f"
      strokeWidth="1.25"
      opacity="0.9"
    />
  )
}

function Tee({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 6} stroke="#c4a35a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy - 9} r="3.5" fill="#c4a35a" />
    </>
  )
}

function Feet({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <ellipse cx={cx - 18} cy={cy} rx="8" ry="14" fill="#1a2e1f" opacity="0.35" />
      <ellipse cx={cx + 18} cy={cy} rx="8" ry="14" fill="#1a2e1f" opacity="0.35" />
    </>
  )
}

function TargetArrow({ x }: { x: number }) {
  return (
    <>
      <line x1={x} y1="40" x2={x} y2="118" stroke="#5a6b5e" strokeWidth="1.25" strokeDasharray="4 3" />
      <polygon points={`${x},34 ${x - 5},44 ${x + 5},44`} fill="#5a6b5e" />
      <text x={x + 8} y="48" fill="#5a6b5e" fontSize="9" fontFamily="system-ui, sans-serif">
        target
      </text>
    </>
  )
}

function renderDiagram(id: string) {
  switch (id) {
    case 'slice-alignment-stick':
      return (
        <>
          <TargetArrow x={210} />
          <Stick x1={40} y1={48} x2={190} y2={48} />
          <Stick x1={40} y1={100} x2={160} y2={100} />
          <Feet cx={100} cy={100} />
          <Ball cx={130} cy={70} />
          <text x="44" y="40" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            target line
          </text>
          <text x="44" y="124" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            toe line
          </text>
        </>
      )

    case 'slice-object-avoidance':
      return (
        <>
          <TargetArrow x={220} />
          <Feet cx={90} cy={105} />
          <Ball cx={140} cy={78} />
          <Headcover cx={168} cy={58} />
          <path
            d="M70 95 Q120 50 150 78"
            fill="none"
            stroke="#2f6b45"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <text x="150" y="48" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            miss this
          </text>
        </>
      )

    case 'hook-grip-check':
      return (
        <>
          <rect x="70" y="42" width="140" height="70" rx="12" fill="#f7faf6" stroke="#2f6b45" strokeWidth="2" />
          <text x="96" y="78" fill="#1a2e1f" fontSize="13" fontFamily="system-ui, sans-serif" fontWeight="600">
            2 knuckles
          </text>
          <circle cx="95" cy="92" r="5" fill="#2f6b45" />
          <circle cx="110" cy="92" r="5" fill="#2f6b45" />
          <circle cx="125" cy="92" r="5" fill="#c9d6c8" stroke="#5a6b5e" />
          <text x="88" y="128" fill="#5a6b5e" fontSize="9" fontFamily="system-ui, sans-serif">
            lead hand — neutral
          </text>
        </>
      )

    case 'hook-mirrored-path':
      return (
        <>
          <TargetArrow x={220} />
          <Feet cx={90} cy={105} />
          <Ball cx={140} cy={78} />
          <Headcover cx={112} cy={58} />
          <path
            d="M70 95 Q100 70 138 78"
            fill="none"
            stroke="#2f6b45"
            strokeWidth="2"
            strokeDasharray="5 3"
          />
          <text x="70" y="48" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            miss inside
          </text>
        </>
      )

    case 'fat-towel-behind':
      return (
        <>
          <TargetArrow x={220} />
          <Feet cx={85} cy={105} />
          <Towel x={95} y={68} />
          <Ball cx={160} cy={78} />
          <text x="98" y="62" fill="#8a7355" fontSize="9" fontFamily="system-ui, sans-serif">
            towel
          </text>
          <text x="148" y="102" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            ball first
          </text>
        </>
      )

    case 'fat-tee-in-front':
      return (
        <>
          <TargetArrow x={230} />
          <Feet cx={80} cy={105} />
          <Ball cx={130} cy={78} />
          <Tee cx={168} cy={78} />
          <text x="154" y="102" fill="#8a7355" fontSize="9" fontFamily="system-ui, sans-serif">
            clip tee
          </text>
        </>
      )

    case 'thin-tee-under':
      return (
        <>
          <TargetArrow x={220} />
          <Feet cx={85} cy={105} />
          <Tee cx={140} cy={86} />
          <Ball cx={140} cy={72} />
          <path
            d="M120 90 L160 90"
            stroke="#2f6b45"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
          <text x="118" y="112" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            brush ahead
          </text>
        </>
      )

    case 'thin-towel-low-point':
      return (
        <>
          <TargetArrow x={230} />
          <Feet cx={80} cy={105} />
          <Ball cx={125} cy={78} />
          <Towel x={155} y={68} />
          <text x="158" y="62" fill="#8a7355" fontSize="9" fontFamily="system-ui, sans-serif">
            towel ahead
          </text>
        </>
      )

    case 'chip-club-ladder':
      return (
        <>
          <circle cx={210} cy={70} r="16" fill="none" stroke="#2f6b45" strokeWidth="2" strokeDasharray="3 2" />
          <text x="196" y="74" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            land
          </text>
          <Feet cx={70} cy={100} />
          <Ball cx={100} cy={78} />
          <text x="40" y="48" fill="#1a2e1f" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">
            PW → 9 → 8
          </text>
          <path d="M110 78 Q160 50 200 70" fill="none" stroke="#2f6b45" strokeWidth="1.5" />
        </>
      )

    case 'chip-headcover':
      return (
        <>
          <ellipse cx={100} cy={70} rx="22" ry="36" fill="#1a2e1f" opacity="0.2" />
          <Headcover cx={118} cy={58} />
          <Ball cx={150} cy={100} />
          <text x="150" y="58" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            under lead arm
          </text>
          <text x="40" y="124" fill="#5a6b5e" fontSize="9" fontFamily="system-ui, sans-serif">
            connected arms
          </text>
        </>
      )

    case 'putt-gate':
      return (
        <>
          <circle cx={220} cy={70} r="12" fill="#2f6b45" opacity="0.25" stroke="#2f6b45" />
          <Ball cx={80} cy={70} />
          <Tee cx={140} cy={52} />
          <Tee cx={140} cy={88} />
          <line x1={90} y1={70} x2={200} y2={70} stroke="#2f6b45" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="124" y="118" fill="#2f6b45" fontSize="9" fontFamily="system-ui, sans-serif">
            gate
          </text>
        </>
      )

    case 'putt-around-the-world':
      return (
        <>
          <circle cx={140} cy={72} r="10" fill="#2f6b45" opacity="0.3" stroke="#2f6b45" />
          <circle cx={140} cy={72} r="38" fill="none" stroke="#2f6b45" strokeWidth="1.5" strokeDasharray="3 3" />
          <Ball cx={140} cy={34} />
          <Ball cx={178} cy={72} />
          <Ball cx={140} cy={110} />
          <Ball cx={102} cy={72} />
          <Ball cx={168} cy={48} />
          <Ball cx={112} cy={48} />
          <text x="108" y="130" fill="#5a6b5e" fontSize="9" fontFamily="system-ui, sans-serif">
            circle the hole
          </text>
        </>
      )

    default:
      return (
        <>
          <Feet cx={100} cy={100} />
          <Ball cx={150} cy={70} />
        </>
      )
  }
}
