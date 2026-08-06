import type { DiagramView, Drill } from '../types'

const C = {
  ball: '#FFFFFF',
  ballStroke: '#1B4332',
  aid: '#1B4332',
  avoid: '#C45C4A',
  path: '#3B6EA5',
  target: '#1B4332',
  label: '#4A5560',
  ground: '#E8E4DC',
  body: '#1B4332',
}

interface DrillDiagramProps {
  drillId: Drill['id']
  view: DiagramView
}

export function DrillDiagram({ drillId, view }: DrillDiagramProps) {
  return (
    <div className="drill-diagram">
      <svg
        viewBox="0 0 320 200"
        role="img"
        aria-label={`${view === 'top' ? 'Top' : 'Side'} view setup for this drill`}
        className="drill-diagram__svg"
      >
        <rect width="320" height="200" rx="18" fill={C.ground} />
        <text
          x="14"
          y="22"
          fill={C.label}
          fontSize="11"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.06em"
        >
          {view === 'top' ? 'TOP VIEW' : 'SIDE VIEW'}
        </text>
        {renderDiagram(drillId)}
      </svg>
    </div>
  )
}

function Label({
  x,
  y,
  children,
  anchor = 'start',
}: {
  x: number
  y: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text
      x={x}
      y={y}
      fill={C.label}
      fontSize="10"
      fontFamily="system-ui, sans-serif"
      fontWeight="600"
      textAnchor={anchor}
    >
      {children}
    </text>
  )
}

function Ball({ cx, cy, r = 9 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={C.ball} stroke={C.ballStroke} strokeWidth="1.75" />
      <circle cx={cx - 2.5} cy={cy - 2.5} r="2" fill="#D7D7D7" />
    </>
  )
}

function FeetTop({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <ellipse cx={cx - 16} cy={cy} rx="9" ry="16" fill={C.body} opacity="0.35" />
      <ellipse cx={cx + 16} cy={cy} rx="9" ry="16" fill={C.body} opacity="0.35" />
      <Label x={cx} y={cy + 28} anchor="middle">
        Your feet
      </Label>
    </>
  )
}

function GolferSide({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy={48} r="10" fill={C.body} opacity="0.85" />
      <line x1={x} y1={58} x2={x} y2={100} stroke={C.body} strokeWidth="5" strokeLinecap="round" />
      <line x1={x} y1={70} x2={x + 28} y2={88} stroke={C.body} strokeWidth="4" strokeLinecap="round" />
      <line x1={x} y1={100} x2={x - 12} y2={138} stroke={C.body} strokeWidth="4" strokeLinecap="round" />
      <line x1={x} y1={100} x2={x + 10} y2={138} stroke={C.body} strokeWidth="4" strokeLinecap="round" />
      <Label x={x - 8} y={30}>You</Label>
    </g>
  )
}

function TargetTop({ x = 280 }: { x?: number }) {
  return (
    <g>
      <line
        x1={x}
        y1={50}
        x2={x}
        y2={150}
        stroke={C.target}
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <polygon
        points={`${x},40 ${x - 7},52 ${x + 7},52`}
        fill={C.target}
      />
      <Label x={x + 10} y={58}>Target</Label>
    </g>
  )
}

function TargetSide() {
  return (
    <g>
      <line x1={150} y1={150} x2={290} y2={150} stroke={C.target} strokeWidth="2" />
      <polygon points="300,150 286,144 286,156" fill={C.target} />
      <Label x={250} y={142}>Target →</Label>
    </g>
  )
}

function PathArc({
  d,
  label,
  lx,
  ly,
}: {
  d: string
  label: string
  lx: number
  ly: number
}) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={C.path}
        strokeWidth="2.25"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      <Label x={lx} y={ly}>
        {label}
      </Label>
    </>
  )
}

function Towel({ x, y, w = 40, h = 24 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="4"
      fill={C.aid}
      fillOpacity="0.15"
      stroke={C.aid}
      strokeWidth="2"
      strokeDasharray="4 2"
    />
  )
}

function Headcover({ cx, cy, avoid = false }: { cx: number; cy: number; avoid?: boolean }) {
  const color = avoid ? C.avoid : C.aid
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx="16"
      ry="12"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2"
    />
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
      stroke={C.aid}
      strokeWidth="5"
      strokeLinecap="round"
    />
  )
}

function renderDiagram(id: string) {
  switch (id) {
    case 'slice-alignment-stick':
      return (
        <>
          <TargetTop />
          <Stick x1={36} y1={70} x2={230} y2={70} />
          <Stick x1={36} y1={130} x2={200} y2={130} />
          <FeetTop cx={110} cy={130} />
          <Ball cx={150} cy={98} />
          <Label x={40} y={58}>Target-line stick</Label>
          <Label x={40} y={150}>Toe-line stick</Label>
          <Label x={162} y={102}>Ball</Label>
          <PathArc
            d="M95 115 Q130 95 148 100"
            label="Swing toward target"
            lx={70}
            ly={88}
          />
        </>
      )

    case 'slice-object-avoidance':
      return (
        <>
          <TargetTop />
          <FeetTop cx={95} cy={135} />
          <Ball cx={155} cy={105} />
          <Headcover cx={190} cy={78} avoid />
          <Label x={168} y={62}>Avoid (red)</Label>
          <Label x={168} y={110}>Ball</Label>
          <PathArc
            d="M70 120 Q120 70 152 102"
            label="Swing path (miss object)"
            lx={48}
            ly={72}
          />
        </>
      )

    case 'hook-grip-check':
      return (
        <>
          <rect
            x={70}
            y={55}
            width={180}
            height={100}
            rx="14"
            fill="#F7F6F2"
            stroke={C.aid}
            strokeWidth="2"
          />
          <Label x={100} y={80}>Lead hand</Label>
          <circle cx={115} cy={115} r="7" fill={C.aid} />
          <circle cx={135} cy={115} r="7" fill={C.aid} />
          <circle cx={155} cy={115} r="7" fill="#C9D0C8" stroke={C.label} />
          <Label x={105} y={145}>Two knuckles visible</Label>
          <Label x={175} y={145}>Quiet</Label>
          <Label x={14} y={190} anchor="start">
            Face square to target first
          </Label>
        </>
      )

    case 'hook-mirrored-path':
      return (
        <>
          <TargetTop />
          <FeetTop cx={95} cy={135} />
          <Ball cx={160} cy={105} />
          <Headcover cx={120} cy={78} avoid />
          <Label x={78} y={62}>Avoid (inside)</Label>
          <Label x={172} y={110}>Ball</Label>
          <PathArc
            d="M70 125 Q110 95 155 105"
            label="Swing path (miss inside)"
            lx={40}
            ly={90}
          />
        </>
      )

    case 'fat-towel-behind':
      return (
        <>
          <TargetSide />
          <GolferSide x={70} />
          <line x1={40} y1={150} x2={300} y2={150} stroke={C.label} strokeWidth="1.5" />
          <Towel x={118} y={128} />
          <Ball cx={185} cy={142} />
          <Label x={122} y={120}>Towel (behind)</Label>
          <Label x={195} y={138}>Ball</Label>
          <PathArc
            d="M100 95 Q150 130 200 145"
            label="Club path"
            lx={200}
            ly={120}
          />
          <Label x={14} y={190}>Miss towel · hit ball first</Label>
        </>
      )

    case 'fat-tee-in-front':
      return (
        <>
          <TargetSide />
          <GolferSide x={70} />
          <line x1={40} y1={150} x2={300} y2={150} stroke={C.label} strokeWidth="1.5" />
          <Ball cx={155} cy={142} />
          <circle cx={200} cy={148} r="7" fill={C.aid} stroke={C.aid} />
          <Label x={145} y={128}>Ball</Label>
          <Label x={188} y={138}>Marker</Label>
          <Label x={188} y={170}>(tee or coin)</Label>
          <PathArc
            d="M100 95 Q160 125 210 148"
            label="Swing through marker"
            lx={210}
            ly={118}
          />
        </>
      )

    case 'thin-tee-under':
      return (
        <>
          <TargetSide />
          <GolferSide x={75} />
          <line x1={40} y1={150} x2={300} y2={150} stroke={C.label} strokeWidth="1.5" />
          <line x1={168} y1={140} x2={168} y2={150} stroke={C.aid} strokeWidth="3" strokeLinecap="round" />
          <Ball cx={168} cy={132} r={8} />
          <Label x={178} y={128}>Low ball</Label>
          <PathArc
            d="M110 100 Q155 135 200 150"
            label="Stay down · brush after"
            lx={200}
            ly={125}
          />
          <Label x={14} y={190}>Do not scoop up</Label>
        </>
      )

    case 'thin-towel-low-point':
      return (
        <>
          <TargetSide />
          <GolferSide x={70} />
          <line x1={40} y1={150} x2={300} y2={150} stroke={C.label} strokeWidth="1.5" />
          <Ball cx={150} cy={142} />
          <Towel x={180} y={128} />
          <Label x={140} y={128}>Ball first</Label>
          <Label x={185} y={120}>Towel ahead</Label>
          <PathArc
            d="M100 95 Q145 130 175 145"
            label="Club path"
            lx={200}
            ly={110}
          />
        </>
      )

    case 'chip-club-ladder':
      return (
        <>
          <TargetTop x={270} />
          <FeetTop cx={80} cy={130} />
          <Ball cx={115} cy={105} />
          <circle
            cx={230}
            cy={90}
            r="22"
            fill="none"
            stroke={C.aid}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <Label x={210} y={70}>Landing spot</Label>
          <Label x={125} y={108}>Ball</Label>
          <Label x={40} y={55}>Same swing</Label>
          <Label x={40} y={70}>PW → 9 → 8</Label>
          <PathArc
            d="M125 105 Q175 70 220 88"
            label="Carry changes with loft"
            lx={150}
            ly={55}
          />
        </>
      )

    case 'chip-headcover':
      return (
        <>
          <TargetSide />
          <GolferSide x={90} />
          <Headcover cx={108} cy={72} />
          <Ball cx={175} cy={145} r={8} />
          <line x1={40} y1={150} x2={300} y2={150} stroke={C.label} strokeWidth="1.5" />
          <Label x={120} y={58}>Headcover under lead arm</Label>
          <Label x={185} y={140}>Ball</Label>
          <PathArc
            d="M120 95 Q150 130 175 145"
            label="Small chip motion"
            lx={190}
            ly={120}
          />
        </>
      )

    case 'putt-gate':
      return (
        <>
          <circle cx={270} cy={100} r="14" fill={C.aid} fillOpacity="0.2" stroke={C.aid} strokeWidth="2" />
          <Label x={255} y={80}>Hole</Label>
          <Ball cx={70} cy={100} />
          <Label x={55} y={80}>Ball</Label>
          <line x1={130} y1={78} x2={130} y2={95} stroke={C.aid} strokeWidth="3" strokeLinecap="round" />
          <line x1={130} y1={105} x2={130} y2={122} stroke={C.aid} strokeWidth="3" strokeLinecap="round" />
          <Label x={100} y={70}>Gate</Label>
          <Label x={100} y={140}>(tees or coins)</Label>
          <PathArc
            d="M80 100 L250 100"
            label="Roll straight through"
            lx={150}
            ly={60}
          />
          <Label x={14} y={190}>Do not touch either side</Label>
        </>
      )

    case 'putt-around-the-world':
      return (
        <>
          <circle cx={160} cy={105} r="12" fill={C.aid} fillOpacity="0.25" stroke={C.aid} strokeWidth="2" />
          <Label x={148} y={88}>Hole</Label>
          <circle
            cx={160}
            cy={105}
            r="48"
            fill="none"
            stroke={C.path}
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <Ball cx={160} cy={57} r={7} />
          <Ball cx={208} cy={105} r={7} />
          <Ball cx={160} cy={153} r={7} />
          <Ball cx={112} cy={105} r={7} />
          <Ball cx={194} cy={71} r={7} />
          <Ball cx={126} cy={71} r={7} />
          <Label x={200} y={55}>Balls</Label>
          <Label x={14} y={190}>Work around the circle · 3–5 feet</Label>
        </>
      )

    default:
      return (
        <>
          <TargetTop />
          <FeetTop cx={110} cy={130} />
          <Ball cx={160} cy={100} />
        </>
      )
  }
}
