import type { ReactNode } from 'react'
import type { DiagramVariant, DiagramView, Drill } from '../types'

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
  variant?: DiagramVariant
}

/**
 * TOP VIEW convention (right-handed):
 * Target is to the LEFT. Feet at the bottom. Ball between feet and target line.
 * SIDE VIEW: Target is ahead (to the RIGHT).
 */
export function DrillDiagram({
  drillId,
  view,
  variant = 'default',
}: DrillDiagramProps) {
  return (
    <div className="drill-diagram">
      <svg
        viewBox="0 0 340 220"
        role="img"
        aria-label={`${view === 'top' ? 'Top' : 'Side'} view setup diagram for ${drillId}${variant !== 'default' ? ` · ${variant}` : ''}`}
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
        {renderDiagram(drillId, variant)}
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
  children: ReactNode
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
function Feet({
  cx,
  cy,
  spread = 20,
}: {
  cx: number
  cy: number
  /** Half-gap between feet - larger = wider stance. */
  spread?: number
}) {
  return (
    <>
      <ellipse cx={cx - spread} cy={cy} rx="11" ry="17" fill={C.body} opacity="0.4" />
      <ellipse cx={cx + spread} cy={cy} rx="11" ry="17" fill={C.body} opacity="0.4" />
    </>
  )
}

function Tee({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <line x1={cx} y1={cy + 2} x2={cx} y2={cy + 14} stroke={C.aid} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx={cx} cy={cy + 14} rx="5" ry="2.5" fill={C.aid} opacity="0.35" />
    </g>
  )
}

function ClubLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <L x={x} y={y} weight={700}>
      {children}
    </L>
  )
}

type ClubKind = 'driver' | 'iron' | 'wedge' | 'putter'

function clubKindFor(id: string, variant: DiagramVariant): ClubKind {
  if (id.startsWith('putt-')) return 'putter'
  if (id.startsWith('chip-')) return 'wedge'
  if (variant === 'driver') return 'driver'
  if (variant === 'wedges') return 'wedge'
  if (variant === 'irons') return 'iron'
  // Default when golfer picks "Both" or no follow-up
  if (id.startsWith('fat-') || id.startsWith('thin-')) return 'iron'
  return 'iron'
}

function clubLabel(kind: ClubKind): string {
  switch (kind) {
    case 'driver':
      return 'Driver'
    case 'wedge':
      return 'Wedge'
    case 'putter':
      return 'Putter'
    default:
      return 'Iron'
  }
}

/** Top view: clubhead at the ball, face toward target (left). */
function ClubTop({
  ballX,
  ballY,
  kind,
}: {
  ballX: number
  ballY: number
  kind: ClubKind
}) {
  if (kind === 'putter') {
    return (
      <g>
        <rect
          x={ballX - 2}
          y={ballY + 8}
          width={18}
          height={8}
          rx="2"
          fill={C.aid}
          transform={`rotate(-8 ${ballX + 7} ${ballY + 12})`}
        />
        <line
          x1={ballX + 14}
          y1={ballY + 14}
          x2={ballX + 55}
          y2={ballY + 55}
          stroke={C.aid}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    )
  }

  if (kind === 'driver') {
    return (
      <g>
        <ellipse
          cx={ballX + 4}
          cy={ballY + 16}
          rx="16"
          ry="11"
          fill={C.aid}
          opacity="0.92"
        />
        <line
          x1={ballX + 14}
          y1={ballY + 20}
          x2={ballX + 58}
          y2={ballY + 62}
          stroke={C.aid}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    )
  }

  // Iron or wedge - blade head; wedge is shorter / more lofted look
  const headW = kind === 'wedge' ? 14 : 16
  const headH = kind === 'wedge' ? 7 : 6
  const shaftLen = kind === 'wedge' ? 48 : 54
  return (
    <g>
      <rect
        x={ballX - 1}
        y={ballY + 9}
        width={headW}
        height={headH}
        rx="1.5"
        fill={C.aid}
        transform={`rotate(${kind === 'wedge' ? -18 : -8} ${ballX + 6} ${ballY + 12})`}
      />
      <line
        x1={ballX + headW - 2}
        y1={ballY + 12}
        x2={ballX + shaftLen}
        y2={ballY + 12 + shaftLen * 0.7}
        stroke={C.aid}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  )
}

/** Side view: club at address behind the ball. Target is to the right. */
function ClubSide({
  ballX,
  ballY,
  kind,
}: {
  ballX: number
  ballY: number
  kind: ClubKind
}) {
  if (kind === 'putter') {
    return (
      <g>
        <rect x={ballX - 18} y={ballY - 4} width={14} height={7} rx="1.5" fill={C.aid} />
        <line
          x1={ballX - 12}
          y1={ballY - 2}
          x2={ballX - 48}
          y2={ballY - 70}
          stroke={C.aid}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    )
  }

  if (kind === 'driver') {
    return (
      <g>
        <ellipse cx={ballX - 14} cy={ballY - 2} rx="14" ry="10" fill={C.aid} opacity="0.95" />
        <line
          x1={ballX - 8}
          y1={ballY - 6}
          x2={ballX - 55}
          y2={ballY - 78}
          stroke={C.aid}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    )
  }

  // Iron: flatter face. Wedge: more loft (tilted sole).
  const loft = kind === 'wedge' ? -32 : -12
  const headW = kind === 'wedge' ? 18 : 16
  const headH = kind === 'wedge' ? 9 : 7
  return (
    <g>
      <rect
        x={ballX - headW - 2}
        y={ballY - headH / 2}
        width={headW}
        height={headH}
        rx="1.5"
        fill={C.aid}
        transform={`rotate(${loft} ${ballX - 8} ${ballY})`}
      />
      <line
        x1={ballX - 10}
        y1={ballY - 4}
        x2={ballX - (kind === 'wedge' ? 42 : 50)}
        y2={ballY - (kind === 'wedge' ? 62 : 72)}
        stroke={C.aid}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
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

/** Clear finish pose: chest to target, trail foot up, club wrapping. */
function PersonFinish({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x + 8} cy={48} r="12" fill={C.body} opacity="0.95" />
      {/* torso angled toward target */}
      <line
        x1={x + 8}
        y1={60}
        x2={x + 42}
        y2={100}
        stroke={C.body}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* lead leg planted */}
      <line
        x1={x + 42}
        y1={100}
        x2={x + 48}
        y2={158}
        stroke={C.body}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* trail leg up on toe */}
      <line
        x1={x + 42}
        y1={100}
        x2={x + 18}
        y2={148}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx={x + 14} cy={152} rx="10" ry="5" fill={C.body} opacity="0.45" />
      {/* arms wrapping club around body toward target */}
      <path
        d={`M${x + 28} 78 Q${x + 70} 58 ${x + 95} 78`}
        fill="none"
        stroke={C.path}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M${x + 95} 78 Q${x + 110} 95 ${x + 88} 112`}
        fill="none"
        stroke={C.path}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  )
}

/** Faded address silhouette for before/after. */
function PersonAddressFaded({ x }: { x: number }) {
  return (
    <g opacity="0.28">
      <circle cx={x} cy={58} r="9" fill={C.body} />
      <line x1={x} y1={67} x2={x} y2={105} stroke={C.body} strokeWidth="5" strokeLinecap="round" />
      <line x1={x} y1={80} x2={x + 28} y2={100} stroke={C.body} strokeWidth="4" strokeLinecap="round" />
      <line x1={x} y1={105} x2={x - 12} y2={150} stroke={C.body} strokeWidth="4" strokeLinecap="round" />
      <line x1={x} y1={105} x2={x + 10} y2={150} stroke={C.body} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

/** Target to the LEFT - correct for RH top view. */
function TargetLeft() {
  return (
    <g>
      <line x1={55} y1={100} x2={55} y2={100} />
      <polygon points="28,100 48,90 48,110" fill={C.target} />
      <line x1={48} y1={100} x2={120} y2={100} stroke={C.target} strokeWidth="2.5" />
      <L x={28} y={82} weight={700}>
        {'← Target'}
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
        {'Target →'}
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

function renderDiagram(id: string, variant: DiagramVariant) {
  const isDriver = variant === 'driver'
  const isWedge = variant === 'wedges'
  const kind = clubKindFor(id, variant)
  const tag = clubLabel(kind)
  const footSpread = isDriver ? 28 : isWedge || kind === 'wedge' ? 16 : 20
  const ballShiftX = isDriver ? -28 : isWedge || kind === 'wedge' ? 10 : 0

  switch (id) {
    case 'slice-alignment-stick': {
      const ballX = 190 + ballShiftX
      const ballY = isDriver ? 96 : 100
      return (
        <>
          <TargetLeft />
          <line x1={55} y1={100} x2={300} y2={100} stroke={C.aid} strokeWidth="5" strokeLinecap="round" />
          <line x1={100} y1={165} x2={280} y2={165} stroke={C.aid} strokeWidth="5" strokeLinecap="round" />
          <Feet cx={190} cy={165} spread={footSpread} />
          {isDriver && <Tee cx={ballX} cy={100} />}
          <ClubTop ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
          <Callout n={1} x={70} y={78} />
          <L x={86} y={82}>{'Stick A → target'}</L>
          <Callout n={2} x={115} y={185} />
          <L x={131} y={189}>
            {isDriver ? 'Stick B - wider stance' : 'Stick B - stand here'}
          </L>
          <Callout n={3} x={ballX + 20} y={78} />
          <L x={ballX + 36} y={82}>
            {isDriver
              ? 'Ball - lead heel'
              : kind === 'wedge'
                ? 'Ball - back a touch'
                : 'Ball - mid-stance'}
          </L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <Path d={`M${ballX + 40} 120 Q${ballX + 20} 105 ${ballX - 30} 100`} />
          <L x={40} y={215}>{`Use your ${tag.toLowerCase()} · swing toward ← target`}</L>
        </>
      )
    }

    case 'slice-object-avoidance': {
      const ballX = 200 + ballShiftX
      const ballY = isDriver ? 96 : 100
      return (
        <>
          <TargetLeft />
          <line
            x1={55}
            y1={100}
            x2={300}
            y2={100}
            stroke={C.target}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <Feet cx={200} cy={170} spread={footSpread} />
          {isDriver && <Tee cx={ballX} cy={100} />}
          <ClubTop ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
          <ellipse
            cx={ballX}
            cy={62}
            rx="20"
            ry="14"
            fill={C.avoid}
            fillOpacity="0.25"
            stroke={C.avoid}
            strokeWidth="3"
          />
          <Callout n={1} x={200} y={195} />
          <L x={216} y={199}>{isDriver ? 'Wider stance' : 'Your feet'}</L>
          <Callout n={2} x={ballX + 20} y={100} />
          <L x={ballX + 36} y={104}>{isDriver ? 'Ball - teed' : 'Ball'}</L>
          <Callout n={3} x={ballX} y={42} />
          <L x={ballX + 16} y={46}>AVOID (outside)</L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <Path d={`M${ballX + 40} 145 Q${ballX + 20} 115 ${ballX - 40} 100`} />
          <L x={40} y={215}>{`Miss red with your ${tag.toLowerCase()} · toward ← target`}</L>
        </>
      )
    }

    case 'hook-finish-position':
      return (
        <>
          <TargetArrowSide />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <PersonAddressFaded x={70} />
          <L x={52} y={190}>Start</L>
          <PersonFinish x={150} />
          <Callout n={1} x={198} y={42} />
          <L x={214} y={46}>{'Chest → target'}</L>
          <Callout n={2} x={250} y={88} />
          <L x={265} y={92}>Club wraps</L>
          <Callout n={3} x={162} y={148} />
          <L x={70} y={152}>Trail foot up</L>
          <L x={200} y={190}>Finish - hold it</L>
          <ClubLabel x={268} y={48}>{tag}</ClubLabel>
          <L x={40} y={212}>{`Hold a tall finish for one second · ${tag.toLowerCase()}`}</L>
        </>
      )

    case 'hook-split-hand': {
      const ballX = 198
      const ballY = 158
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={90} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <circle cx={138} cy={102} r="9" fill={C.body} />
          <circle cx={162} cy={124} r="9" fill={C.path} />
          <Ball cx={ballX} cy={ballY} r={9} />
          <Callout n={1} x={138} y={82} />
          <L x={154} y={86}>Lead hand</L>
          <Callout n={2} x={162} y={140} />
          <L x={178} y={144}>Trail hand (lower)</L>
          <Callout n={3} x={ballX} y={140} />
          <L x={ballX + 16} y={144}>{`Ball · ${tag}`}</L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <L x={40} y={195}>Gap between hands - about 2-3 inches</L>
          <L x={40} y={210}>Half swings - quiet face through the ball</L>
        </>
      )
    }

    case 'fat-towel-behind': {
      const ballX = 205 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
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
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
          <Callout n={1} x={75} y={40} />
          <L x={90} y={44}>You</L>
          <Callout n={2} x={149} y={130} />
          <L x={70} y={134}>Towel (behind ball)</L>
          <Callout n={3} x={ballX} y={140} />
          <L x={ballX + 16} y={144}>
            {kind === 'wedge' ? 'Ball - back a touch' : 'Ball'}
          </L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <Path d="M110 105 Q165 145 215 160" />
          <L x={40} y={210}>{`Hit with ${tag.toLowerCase()} · miss towel · brush after`}</L>
        </>
      )
    }

    case 'fat-tee-in-front': {
      const ballX = 170 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={75} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
          <circle cx={220} cy={164} r="9" fill={C.aid} />
          <Callout n={1} x={75} y={40} />
          <L x={90} y={44}>You</L>
          <Callout n={2} x={ballX} y={140} />
          <L x={ballX + 14} y={144}>
            {kind === 'wedge' ? 'Ball - back a touch' : 'Ball'}
          </L>
          <Callout n={3} x={220} y={145} />
          <L x={235} y={149}>Coin / marker</L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <Path d="M110 105 Q175 140 230 164" />
          <L x={40} y={210}>{`${tag} passes the coin after the ball`}</L>
        </>
      )
    }

    case 'thin-brush-line': {
      const ballX = 168 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={75} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
          <line
            x1={198}
            y1={156}
            x2={198}
            y2={178}
            stroke={C.aid}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={198} cy={168} r="8" fill={C.aid} />
          <Callout n={1} x={ballX} y={140} />
          <L x={100} y={144}>
            {kind === 'wedge' ? 'Ball - back a touch' : 'Ball'}
          </L>
          <Callout n={2} x={198} y={140} />
          <L x={214} y={144}>Brush line</L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <Path d="M110 105 Q160 145 205 168" />
          <L x={40} y={195}>{`Ball first with ${tag.toLowerCase()}`}</L>
          <L x={40} y={210}>Then brush the coin / line - mats or grass</L>
        </>
      )
    }

    case 'thin-towel-low-point': {
      const ballX = 165 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      return (
        <>
          <TargetArrowSide />
          <PersonSide x={75} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
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
          <Callout n={1} x={ballX} y={140} />
          <L x={100} y={144}>
            {kind === 'wedge' ? 'Ball - back a touch' : 'Ball first'}
          </L>
          <Callout n={2} x={224} y={130} />
          <L x={240} y={134}>Towel ahead</L>
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
          <Path d="M110 105 Q155 145 175 158" />
          <L x={40} y={210}>
            {`Quiet wrists · ${tag.toLowerCase()} · ball → then towel`}
          </L>
        </>
      )
    }

    case 'chip-wedge-ladder':
      return (
        <>
          <TargetLeft />
          <Feet cx={250} cy={170} spread={16} />
          <ClubTop ballX={250} ballY={120} kind="wedge" />
          <Ball cx={250} cy={120} />
          <circle
            cx={190}
            cy={105}
            r="18"
            fill="none"
            stroke={C.aid}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <circle
            cx={130}
            cy={100}
            r="22"
            fill="none"
            stroke={C.path}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <circle
            cx={70}
            cy={95}
            r="26"
            fill="none"
            stroke={C.target}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <Callout n={1} x={250} y={195} />
          <L x={200} y={199}>Same wedge</L>
          <Callout n={2} x={190} y={80} />
          <L x={170} y={68}>Short</L>
          <Callout n={3} x={130} y={72} />
          <L x={108} y={58}>Medium</L>
          <L x={48} y={58}>Long</L>
          <ClubLabel x={268} y={48}>Wedge</ClubLabel>
          <Path d="M240 118 Q200 100 185 105" />
          <L x={40} y={215}>{'One wedge · three swing lengths · toward ← target'}</L>
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
          <ClubSide ballX={195} ballY={160} kind="wedge" />
          <Ball cx={195} cy={160} r={9} />
          <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
          <Callout n={1} x={95} y={40} />
          <L x={110} y={44}>You</L>
          <Callout n={2} x={115} y={60} />
          <L x={135} y={64}>Headcover under lead arm</L>
          <Callout n={3} x={195} y={142} />
          <L x={210} y={146}>Ball - wedge</L>
          <ClubLabel x={250} y={48}>Wedge</ClubLabel>
          <Path d="M130 105 Q165 140 195 160" />
          <L x={40} y={210}>Chip without dropping the headcover</L>
        </>
      )

    case 'putt-lag-ladder':
      return (
        <>
          <circle
            cx={48}
            cy={110}
            r="14"
            fill={C.aid}
            fillOpacity="0.25"
            stroke={C.aid}
            strokeWidth="2.5"
          />
          <L x={28} y={78} weight={700}>
            Hole
          </L>
          <ClubTop ballX={290} ballY={110} kind="putter" />
          <Ball cx={140} cy={110} r={8} />
          <Ball cx={210} cy={110} r={8} />
          <Ball cx={290} cy={110} r={8} />
          <line x1={140} y1={128} x2={140} y2={140} stroke={C.label} strokeWidth="2" />
          <line x1={210} y1={128} x2={210} y2={140} stroke={C.label} strokeWidth="2" />
          <line x1={290} y1={128} x2={290} y2={140} stroke={C.label} strokeWidth="2" />
          <Callout n={1} x={140} y={155} />
          <L x={118} y={175}>Short</L>
          <Callout n={2} x={210} y={155} />
          <L x={186} y={175}>Medium</L>
          <Callout n={3} x={290} y={155} />
          <L x={272} y={175}>Long</L>
          <ClubLabel x={250} y={48}>Putter</ClubLabel>
          <Path d="M280 110 L70 110" />
          <L x={40} y={200}>Same target - three distances</L>
          <L x={40} y={214}>Die the ball near the hole - speed first</L>
        </>
      )

    case 'putt-start-line-gate':
      return (
        <>
          <circle
            cx={42}
            cy={110}
            r="14"
            fill={C.aid}
            fillOpacity="0.2"
            stroke={C.aid}
            strokeWidth="2.5"
          />
          <L x={24} y={78} weight={700}>
            Hole
          </L>
          <ClubTop ballX={290} ballY={110} kind="putter" />
          <Ball cx={290} cy={110} />
          <line
            x1={180}
            y1={86}
            x2={180}
            y2={100}
            stroke={C.aid}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={180}
            y1={120}
            x2={180}
            y2={134}
            stroke={C.aid}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Callout n={1} x={290} y={88} />
          <L x={260} y={74}>Ball - putter</L>
          <Callout n={2} x={180} y={70} />
          <L x={120} y={74}>Gate (2-3 ft ahead)</L>
          <Callout n={3} x={42} y={70} />
          <L x={58} y={74}>Hole</L>
          <ClubLabel x={250} y={48}>Putter</ClubLabel>
          <Path d="M278 110 L60 110" />
          <L x={40} y={195}>Gate ahead of the ball - not around the putter</L>
          <L x={40} y={210}>Roll through clean - start line feedback</L>
        </>
      )

    default:
      return (
        <>
          <TargetLeft />
          <Feet cx={200} cy={165} />
          <ClubTop ballX={200} ballY={100} kind={kind} />
          <Ball cx={200} cy={100} />
          <ClubLabel x={250} y={48}>{tag}</ClubLabel>
        </>
      )
  }
}
