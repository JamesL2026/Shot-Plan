import type { DiagramView, Drill } from '../types'

const C = {
  ball: '#FFFFFF',
  ballStroke: '#1B4332',
  aid: '#1B4332',
  avoid: '#C45C4A',
  path: '#3B6EA5',
  target: '#1B4332',
  label: '#3D4650',
  ground: '#E9E5DC',
  body: '#1B4332',
}

interface DrillDiagramProps {
  drillId: Drill['id']
  view: DiagramView
}

/**
 * TOP VIEW convention (right-handed):
 * Target is to the LEFT. Feet at the bottom. Ball between feet and target line.
 * SIDE VIEW: Target is ahead (to the RIGHT).
 */
export function DrillDiagram({ drillId, view }: DrillDiagramProps) {
  return (
    <div className="drill-diagram">
      <svg
        viewBox="0 0 340 220"
        role="img"
        aria-label={`${view === 'top' ? 'Top' : 'Side'} view: how to set up this drill`}
        className="drill-diagram__svg"
      >
        <rect width="340" height="220" rx="18" fill={C.ground} />
        <rect x="10" y="10" width={view === 'top' ? 118 : 88} height="22" rx="6" fill={C.aid} />
        <text
          x={view === 'top' ? 69 : 54}
          y="25"
          fill="#F7F6F2"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          textAnchor="middle"
          letterSpacing="0.04em"
        >
          {view === 'top' ? 'TOP VIEW · RH' : 'SIDE VIEW'}
        </text>
        {renderDiagram(drillId)}
      </svg>
    </div>
  )
}

function L({
  x,
  y,
  children,
  anchor = 'start',
  weight = 600,
}: {
  x: number
  y: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
  weight?: number
}) {
  return (
    <text
      x={x}
      y={y}
      fill={C.label}
      fontSize="11"
      fontFamily="system-ui, sans-serif"
      fontWeight={weight}
      textAnchor={anchor}
    >
      {children}
    </text>
  )
}

function Callout({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill={C.aid} />
      <text
        x={x}
        y={y + 4}
        fill="#F7F6F2"
        fontSize="12"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        textAnchor="middle"
      >
        {n}
      </text>
    </g>
  )
}

function Ball({ cx, cy, r = 10 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={C.ball} stroke={C.ballStroke} strokeWidth="2" />
      <circle cx={cx - 3} cy={cy - 3} r="2.2" fill="#D0D0D0" />
    </>
  )
}

/** Feet side-by-side along a horizontal toe line (toes face up toward the ball). */
function Feet({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <ellipse cx={cx - 20} cy={cy} rx="11" ry="17" fill={C.body} opacity="0.4" />
      <ellipse cx={cx + 20} cy={cy} rx="11" ry="17" fill={C.body} opacity="0.4" />
    </>
  )
}

function PersonSide({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy={52} r="11" fill={C.body} opacity="0.9" />
      <line x1={x} y1={63} x2={x} y2={108} stroke={C.body} strokeWidth="6" strokeLinecap="round" />
      <line x1={x} y1={78} x2={x + 32} y2={98} stroke={C.body} strokeWidth="5" strokeLinecap="round" />
      <line x1={x} y1={108} x2={x - 14} y2={150} stroke={C.body} strokeWidth="5" strokeLinecap="round" />
      <line x1={x} y1={108} x2={x + 12} y2={150} stroke={C.body} strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

/** Target to the LEFT — correct for RH top view. */
function TargetLeft() {
  return (
    <g>
      <line x1={55} y1={100} x2={55} y2={100} />
      <polygon points="28,100 48,90 48,110" fill={C.target} />
      <line x1={48} y1={100} x2={120} y2={100} stroke={C.target} strokeWidth="2.5" />
      <L x={28} y={82} weight={700}>
        ← Target
      </L>
    </g>
  )
}

function TargetArrowSide() {
  return (
    <g>
      <line x1={140} y1={168} x2={300} y2={168} stroke={C.target} strokeWidth="2.5" />
      <polygon points="312,168 296,160 296,176" fill={C.target} />
      <L x={220} y={158} weight={700}>
        Target →
      </L>
    </g>
  )
}

function Path({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={C.path}
      strokeWidth="2.5"
      strokeDasharray="7 5"
      strokeLinecap="round"
    />
  )
}

function renderDiagram(id: string) {
  switch (id) {
    case 'slice-alignment-stick':
      // Target LEFT. Stick A = target line (horizontal). Stick B = toe line. Feet below.
      return (
        <>
          <TargetLeft />
          <line x1={55} y1={100} x2={300} y2={100} stroke={C.aid} strokeWidth="5" strokeLinecap="round" />
          <line x1={100} y1={165} x2={280} y2={165} stroke={C.aid} strokeWidth="5" strokeLinecap="round" />
          <Feet cx={190} cy={165} />
          <Ball cx={190} cy={100} />
          <Callout n={1} x={70} y={78} />
          <L x={86} y={82}>Stick A (at target)</L>
          <Callout n={2} x={115} y={185} />
          <L x={131} y={189}>Stick B (your toes)</L>
          <Callout n={3} x={210} y={82} />
          <L x={226} y={86}>Ball</L>
          <Callout n={4} x={190} y={200} />
          <L x={206} y={204} anchor="start">
            Stand here
          </L>
          <Path d="M230 120 Q210 105 160 100" />
          <L x={40} y={215}>Swing toward ← target (left of your feet)</L>
        </>
      )

    case 'slice-object-avoidance':
      // Outside = away from body = above ball in this view (farther from feet)
      return (
        <>
          <TargetLeft />
          <line x1={55} y1={100} x2={300} y2={100} stroke={C.target} strokeWidth="1.5" strokeDasharray="4 3" />
          <Feet cx={200} cy={170} />
          <Ball cx={200} cy={100} />
          <ellipse
            cx={200}
            cy={62}
            rx="20"
            ry="14"
            fill={C.avoid}
            fillOpacity="0.25"
            stroke={C.avoid}
            strokeWidth="3"
          />
          <Callout n={1} x={200} y={195} />
          <L x={216} y={199}>Your feet</L>
          <Callout n={2} x={220} y={100} />
          <L x={236} y={104}>Ball</L>
          <Callout n={3} x={200} y={42} />
          <L x={216} y={46}>AVOID (outside)</L>
          <Path d="M240 145 Q220 115 160 100" />
          <L x={40} y={215}>Miss red object · swing toward ← target</L>
        </>
      )

    case 'hook-grip-check':
      return (
        <>
          <rect x={60} y={50} width={220} height={130} rx="16" fill="#F7F6F2" stroke={C.aid} strokeWidth="2.5" />
          <L x={90} y={78} weight={700}>
            Lead hand (top of grip)
          </L>
          <circle cx={120} cy={120} r="9" fill={C.aid} />
          <circle cx={145} cy={120} r="9" fill={C.aid} />
          <circle cx={170} cy={120} r="9" fill="#C5CCC4" stroke={C.label} strokeWidth="1.5" />
          <Callout n={1} x={120} y={100} />
          <Callout n={2} x={145} y={100} />
          <L x={100} y={155}>See knuckle 1 and 2</L>
          <L x={100} y={172}>Hide knuckle 3</L>
          <L x={40} y={210}>Face the club at the target before setting hands</L>
        </>
      )

    case 'hook-mirrored-path':
      // Inside = toward body = between feet and ball
      return (
        <>
          <TargetLeft />
          <line x1={55} y1={100} x2={300} y2={100} stroke={C.target} strokeWidth="1.5" strokeDasharray="4 3" />
          <Feet cx={200} cy={170} />
          <Ball cx={200} cy={100} />
          <ellipse
            cx={200}
            cy={132}
            rx="18"
            ry="12"
            fill={C.avoid}
            fillOpacity="0.25"
            stroke={C.avoid}
            strokeWidth="3"
          />
          <Callout n={1} x={200} y={195} />
          <L x={216} y={199}>Your feet</L>
          <Callout n={2} x={220} y={100} />
          <L x={236} y={104}>Ball</L>
          <Callout n={3} x={200} y={132} />
          <L x={222} y={136}>AVOID (inside)</L>
          <Path d="M240 155 Q220 120 160 100" />
          <L x={40} y={215}>Miss red object on the inside · toward ← target</L>
        </>
      )

    case 'fat-towel-behind':
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={75} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <rect
            x={125}
            y={142}
            width={48}
            height={26}
            rx="4"
            fill={C.aid}
            fillOpacity="0.18"
            stroke={C.aid}
            strokeWidth="2.5"
            strokeDasharray="5 3"
          />
          <Ball cx={205} cy={158} />
          <Callout n={1} x={75} y={40} />
          <L x={90} y={44}>You</L>
          <Callout n={2} x={149} y={130} />
          <L x={70} y={134}>Towel (behind ball)</L>
          <Callout n={3} x={205} y={140} />
          <L x={220} y={144}>Ball</L>
          <Path d="M110 105 Q165 145 215 160" />
          <L x={40} y={210}>Hit ball · miss towel · brush after ball</L>
        </>
      )

    case 'fat-tee-in-front':
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={75} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <Ball cx={170} cy={158} />
          <circle cx={220} cy={164} r="9" fill={C.aid} />
          <Callout n={1} x={75} y={40} />
          <L x={90} y={44}>You</L>
          <Callout n={2} x={170} y={140} />
          <L x={184} y={144}>Ball</L>
          <Callout n={3} x={220} y={145} />
          <L x={235} y={149}>Coin / marker</L>
          <Path d="M110 105 Q175 140 230 164" />
          <L x={40} y={210}>Swing through so club passes the coin after the ball</L>
        </>
      )

    case 'thin-tee-under':
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={80} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <Ball cx={185} cy={150} r={9} />
          <Callout n={1} x={80} y={40} />
          <L x={95} y={44}>You</L>
          <Callout n={2} x={185} y={130} />
          <L x={200} y={134}>Low ball on mat</L>
          <Path d="M115 110 Q170 145 230 168" />
          <L x={40} y={195}>Stay down</L>
          <L x={40} y={210}>Brush mat AFTER the ball — do not scoop up</L>
        </>
      )

    case 'thin-towel-low-point':
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={75} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <Ball cx={165} cy={158} />
          <rect
            x={200}
            y={142}
            width={48}
            height={26}
            rx="4"
            fill={C.aid}
            fillOpacity="0.18"
            stroke={C.aid}
            strokeWidth="2.5"
            strokeDasharray="5 3"
          />
          <Callout n={1} x={165} y={140} />
          <L x={100} y={144}>Ball first</L>
          <Callout n={2} x={224} y={130} />
          <L x={240} y={134}>Towel ahead</L>
          <Path d="M110 105 Q155 145 175 158" />
          <L x={40} y={210}>Ball → then towel (or miss towel)</L>
        </>
      )

    case 'chip-club-ladder':
      // Target LEFT. Landing spot between ball and target.
      return (
        <>
          <TargetLeft />
          <Feet cx={230} cy={170} />
          <Ball cx={230} cy={115} />
          <circle
            cx={130}
            cy={100}
            r="28"
            fill="none"
            stroke={C.aid}
            strokeWidth="3"
            strokeDasharray="5 4"
          />
          <Callout n={1} x={230} y={195} />
          <L x={246} y={199}>Stand here</L>
          <Callout n={2} x={250} y={115} />
          <L x={266} y={119}>Ball</L>
          <Callout n={3} x={130} y={72} />
          <L x={100} y={60}>Landing spot</L>
          <Path d="M220 115 Q175 95 145 100" />
          <L x={40} y={215}>Chip toward ← target · PW → 9 → 8</L>
        </>
      )

    case 'chip-headcover':
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={95} />
          <ellipse
            cx={115}
            cy={78}
            rx="16"
            ry="12"
            fill={C.aid}
            fillOpacity="0.25"
            stroke={C.aid}
            strokeWidth="2.5"
          />
          <Ball cx={195} cy={160} r={9} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <Callout n={1} x={95} y={40} />
          <L x={110} y={44}>You</L>
          <Callout n={2} x={115} y={60} />
          <L x={135} y={64}>Headcover under lead arm</L>
          <Callout n={3} x={195} y={142} />
          <L x={210} y={146}>Ball</L>
          <Path d="M130 105 Q165 140 195 160" />
          <L x={40} y={210}>Chip without dropping the headcover</L>
        </>
      )

    case 'putt-gate':
      // Target/hole to the LEFT
      return (
        <>
          <circle
            cx={50}
            cy={110}
            r="16"
            fill={C.aid}
            fillOpacity="0.2"
            stroke={C.aid}
            strokeWidth="2.5"
          />
          <L x={28} y={88} weight={700}>
            ← Hole
          </L>
          <Ball cx={280} cy={110} />
          <line x1={200} y1={86} x2={200} y2={102} stroke={C.aid} strokeWidth="4" strokeLinecap="round" />
          <line x1={200} y1={118} x2={200} y2={134} stroke={C.aid} strokeWidth="4" strokeLinecap="round" />
          <Callout n={1} x={280} y={88} />
          <L x={250} y={75}>Ball</L>
          <Callout n={2} x={200} y={70} />
          <L x={120} y={74}>Gate (tees/coins)</L>
          <Path d="M268 110 L70 110" />
          <L x={40} y={195}>Roll through the gate toward the hole</L>
          <L x={40} y={210}>Do not touch either side</L>
        </>
      )

    case 'putt-around-the-world':
      return (
        <>
          <circle
            cx={170}
            cy={115}
            r="14"
            fill={C.aid}
            fillOpacity="0.25"
            stroke={C.aid}
            strokeWidth="2.5"
          />
          <L x={155} y={95} weight={700}>
            Hole
          </L>
          <circle
            cx={170}
            cy={115}
            r="52"
            fill="none"
            stroke={C.path}
            strokeWidth="2.5"
            strokeDasharray="6 5"
          />
          <Ball cx={170} cy={63} r={8} />
          <Ball cx={222} cy={115} r={8} />
          <Ball cx={170} cy={167} r={8} />
          <Ball cx={118} cy={115} r={8} />
          <Ball cx={208} cy={78} r={8} />
          <Ball cx={132} cy={78} r={8} />
          <Callout n={1} x={170} y={48} />
          <L x={186} y={52}>Balls in a circle</L>
          <L x={40} y={210}>Putt around · 3–5 feet · redo any miss</L>
        </>
      )

    default:
      return (
        <>
          <TargetLeft />
          <Feet cx={200} cy={165} />
          <Ball cx={200} cy={100} />
        </>
      )
  }
}
