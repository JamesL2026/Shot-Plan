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
      <p className="drill-diagram__view-label">
        {view === 'top' ? 'Top view (right handed)' : 'Side view'}
      </p>
      <svg
        viewBox="0 0 340 220"
        role="img"
        aria-label={`${view === 'top' ? 'Top' : 'Side'} view setup diagram for ${drillId}${variant !== 'default' ? ` · ${variant}` : ''}`}
        className="drill-diagram__svg"
      >
        <rect width="340" height="220" rx="18" fill={C.ground} />
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

/** Number badge with label kept clear of the circle (no overlap). */
function LabeledCallout({
  n,
  x,
  y,
  label,
  side = 'right',
}: {
  n: number
  x: number
  y: number
  label: string
  /** Where the text sits relative to the badge */
  side?: 'right' | 'left' | 'below' | 'above'
}) {
  const gap = 16
  let lx = x + gap + 11
  let ly = y + 4
  let anchor: 'start' | 'middle' | 'end' = 'start'
  if (side === 'left') {
    lx = x - gap - 11
    anchor = 'end'
  } else if (side === 'below') {
    lx = x
    ly = y + 26
    anchor = 'middle'
  } else if (side === 'above') {
    lx = x
    ly = y - 18
    anchor = 'middle'
  }
  return (
    <g>
      <Callout n={n} x={x} y={y} />
      <L x={lx} y={ly} anchor={anchor}>
        {label}
      </L>
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

function ClubLabel({
  x = 322,
  y = 34,
  children,
  anchor = 'end',
}: {
  x?: number
  y?: number
  children: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <L x={x} y={y} weight={700} anchor={anchor}>
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

/** Side-view address: both arms to the grip, facing target (right). */
function PersonSide({
  x,
  leadHand,
  trailHand,
}: {
  x: number
  leadHand?: { x: number; y: number }
  trailHand?: { x: number; y: number }
}) {
  const lead = leadHand ?? { x: x + 46, y: 100 }
  const trail = trailHand ?? { x: x + 52, y: 112 }
  return (
    <g>
      <circle cx={x} cy={46} r="11" fill={C.body} opacity="0.95" />
      <line
        x1={x}
        y1={57}
        x2={x + 8}
        y2={102}
        stroke={C.body}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Lead arm */}
      <line
        x1={x + 2}
        y1={70}
        x2={lead.x}
        y2={lead.y}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Trail arm */}
      <line
        x1={x + 6}
        y1={78}
        x2={trail.x}
        y2={trail.y}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx={lead.x} cy={lead.y} r="7" fill={C.body} />
      <circle cx={trail.x} cy={trail.y} r="7" fill={C.body} opacity="0.9" />
      <line
        x1={x + 8}
        y1={102}
        x2={x - 12}
        y2={158}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1={x + 8}
        y1={102}
        x2={x + 24}
        y2={158}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  )
}

/** Finish pose: chest to target, both arms wrapping the club, trail foot up. */
function PersonFinish({ x }: { x: number }) {
  const chestX = x + 36
  const chestY = 88
  return (
    <g>
      <circle cx={x + 18} cy={42} r="12" fill={C.body} opacity="0.95" />
      <line
        x1={x + 18}
        y1={54}
        x2={chestX}
        y2={chestY}
        stroke={C.body}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Lead arm wrapping high */}
      <line
        x1={x + 24}
        y1={66}
        x2={x + 78}
        y2={58}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Trail arm wrapping under */}
      <line
        x1={x + 28}
        y1={74}
        x2={x + 72}
        y2={78}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx={x + 78} cy={58} r="6" fill={C.body} />
      <circle cx={x + 72} cy={78} r="6" fill={C.body} opacity="0.9" />
      {/* Club shaft over the shoulder */}
      <line
        x1={x + 75}
        y1={68}
        x2={x + 108}
        y2={42}
        stroke={C.aid}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect
        x={x + 104}
        y={34}
        width={14}
        height={8}
        rx="1.5"
        fill={C.aid}
        transform={`rotate(28 ${x + 108} 42)`}
      />
      {/* Lead leg planted */}
      <line
        x1={chestX}
        y1={chestY}
        x2={x + 58}
        y2={158}
        stroke={C.body}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Trail leg up on toe */}
      <line
        x1={chestX}
        y1={chestY}
        x2={x + 12}
        y2={140}
        stroke={C.body}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx={x + 8} cy={148} rx="11" ry="5" fill={C.body} opacity="0.45" />
    </g>
  )
}

/** Faded address silhouette for before/after (both arms). */
function PersonAddressFaded({ x }: { x: number }) {
  return (
    <g opacity="0.3">
      <PersonSide
        x={x}
        leadHand={{ x: x + 40, y: 98 }}
        trailHand={{ x: x + 46, y: 110 }}
      />
    </g>
  )
}

/** Top view: arrow only on the far left. No text (labels crowded the setup). */
function TargetLeft() {
  return (
    <g>
      <polygon points="18,100 38,88 38,112" fill={C.target} />
      <line x1={38} y1={100} x2={72} y2={100} stroke={C.target} strokeWidth="2.5" />
    </g>
  )
}

/** Side view: arrow only on the far right ground line. No text. */
function TargetArrowSide() {
  return (
    <g>
      <line x1={286} y1={168} x2={312} y2={168} stroke={C.target} strokeWidth="2.5" />
      <polygon points="326,168 310,158 310,178" fill={C.target} />
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

function Ground() {
  return (
    <line x1={30} y1={168} x2={320} y2={168} stroke={C.label} strokeWidth="2" />
  )
}

function FootNote({ children }: { children: string }) {
  return <L x={40} y={212}>{children}</L>
}

function renderDiagram(id: string, variant: DiagramVariant) {
  const isDriver = variant === 'driver'
  const kind = clubKindFor(id, variant)
  const tag = clubLabel(kind)
  const footSpread = isDriver ? 28 : kind === 'wedge' ? 16 : 20
  const ballShiftX = isDriver ? -28 : kind === 'wedge' ? 10 : 0
  const ballPosLabel = isDriver
    ? 'Ball by lead heel'
    : kind === 'wedge'
      ? 'Ball a little back'
      : 'Ball in middle'

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
          <LabeledCallout n={1} x={52} y={58} label="Stick A points at target" />
          <LabeledCallout
            n={2}
            x={100}
            y={198}
            label={isDriver ? 'Feet on Stick B (wider)' : 'Feet on Stick B'}
          />
          <LabeledCallout
            n={3}
            x={Math.min(ballX + 44, 268)}
            y={ballY + 4}
            label={ballPosLabel}
          />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>{`Stand on Stick B. Hit your ${tag.toLowerCase()} toward the target.`}</FootNote>
        </>
      )
    }

    case 'slice-object-avoidance': {
      const ballX = 200 + ballShiftX
      const ballY = isDriver ? 96 : 100
      const avoidX = ballX
      const avoidY = 56
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
            cx={avoidX}
            cy={avoidY}
            rx="20"
            ry="14"
            fill={C.avoid}
            fillOpacity="0.25"
            stroke={C.avoid}
            strokeWidth="3"
          />
          <LabeledCallout
            n={1}
            x={78}
            y={170}
            label={isDriver ? 'Wider stance' : 'Your feet'}
          />
          <LabeledCallout
            n={2}
            x={ballX + 52}
            y={ballY + 2}
            label={isDriver ? 'Ball on a tee' : 'Ball'}
          />
          <LabeledCallout
            n={3}
            x={avoidX - 52}
            y={avoidY}
            label="Miss this object"
            side="left"
          />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>{`Miss the red object. Then hit the ball with your ${tag.toLowerCase()}.`}</FootNote>
        </>
      )
    }

    case 'hook-finish-position':
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonAddressFaded x={58} />
          <L x={58} y={188} anchor="middle">
            Start
          </L>
          <PersonFinish x={148} />
          <L x={210} y={188} anchor="middle">
            Finish
          </L>
          <LabeledCallout n={1} x={168} y={28} label="Chest faces target" />
          <LabeledCallout n={2} x={278} y={64} label="Both hands wrap" side="left" />
          <LabeledCallout n={3} x={118} y={148} label="Trail foot up" side="left" />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>Swing to this finish. Hold it for one second.</FootNote>
        </>
      )

    case 'hook-split-hand': {
      const ballX = 215
      const ballY = 158
      const lead = { x: 138, y: 88 }
      const trail = { x: 168, y: 118 }
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonSide x={72} leadHand={lead} trailHand={trail} />
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} r={9} />
          <line
            x1={148}
            y1={98}
            x2={158}
            y2={110}
            stroke={C.path}
            strokeWidth="2.5"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
          <LabeledCallout
            n={1}
            x={lead.x}
            y={lead.y - 26}
            label="Lead hand higher"
            side="above"
          />
          <LabeledCallout
            n={2}
            x={trail.x + 40}
            y={trail.y + 4}
            label="Trail hand lower"
          />
          <LabeledCallout n={3} x={ballX + 36} y={ballY - 6} label="Ball" />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>Leave a 2-3 inch gap. Hit easy half swings.</FootNote>
        </>
      )
    }

    case 'fat-towel-behind': {
      const ballX = 205 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      const lead = { x: 120, y: 100 }
      const trail = { x: 128, y: 112 }
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonSide x={70} leadHand={lead} trailHand={trail} />
          <rect
            x={128}
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
          <LabeledCallout n={1} x={100} y={128} label="Towel behind ball" side="left" />
          <LabeledCallout n={2} x={ballX + 36} y={ballY - 8} label={ballPosLabel} />
          <LabeledCallout n={3} x={152} y={118} label="Do not hit towel" />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>{`Hit the ball with your ${tag.toLowerCase()}. Miss the towel.`}</FootNote>
        </>
      )
    }

    case 'fat-tee-in-front': {
      const ballX = 170 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      const lead = { x: 118, y: 100 }
      const trail = { x: 126, y: 112 }
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonSide x={70} leadHand={lead} trailHand={trail} />
          <ClubSide ballX={ballX} ballY={ballY} kind={kind} />
          <Ball cx={ballX} cy={ballY} />
          <circle cx={224} cy={164} r="9" fill={C.aid} />
          <LabeledCallout n={1} x={ballX - 8} y={138} label={ballPosLabel} side="left" />
          <LabeledCallout n={2} x={246} y={148} label="Coin in front" />
          <LabeledCallout n={3} x={100} y={48} label="Swing through" />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>Hit the ball. Then let the club pass over the coin.</FootNote>
        </>
      )
    }

    case 'thin-brush-line': {
      const ballX = 168 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      const lead = { x: 118, y: 100 }
      const trail = { x: 126, y: 112 }
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonSide x={70} leadHand={lead} trailHand={trail} />
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
          <LabeledCallout n={1} x={ballX - 10} y={138} label={ballPosLabel} side="left" />
          <LabeledCallout n={2} x={230} y={148} label="Brush this after" />
          <LabeledCallout n={3} x={100} y={48} label="Stay down" />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>Hit the ball first. Then brush the coin or line.</FootNote>
        </>
      )
    }

    case 'thin-towel-low-point': {
      const ballX = 165 + (kind === 'wedge' ? -8 : 0)
      const ballY = 158
      const lead = { x: 118, y: 100 }
      const trail = { x: 126, y: 112 }
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonSide x={70} leadHand={lead} trailHand={trail} />
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
          <LabeledCallout n={1} x={ballX - 8} y={138} label="Ball first" side="left" />
          <LabeledCallout n={2} x={268} y={148} label="Towel ahead" side="left" />
          <LabeledCallout n={3} x={100} y={48} label="Quiet wrists" />
          <ClubLabel>{tag}</ClubLabel>
          <FootNote>Hit the ball. Then miss the towel, or barely touch it.</FootNote>
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
          <LabeledCallout n={1} x={250} y={196} label="Same wedge" side="below" />
          <LabeledCallout n={2} x={190} y={78} label="Short" side="above" />
          <LabeledCallout n={3} x={130} y={70} label="Medium" side="above" />
          <L x={70} y={58} anchor="middle" weight={700}>
            Long
          </L>
          <ClubLabel>Wedge</ClubLabel>
          <FootNote>
            One wedge. Three swing lengths. Land short, then medium, then long.
          </FootNote>
        </>
      )

    case 'chip-headcover': {
      const lead = { x: 138, y: 100 }
      const trail = { x: 148, y: 112 }
      return (
        <>
          <Ground />
          <TargetArrowSide />
          <PersonSide x={90} leadHand={lead} trailHand={trail} />
          <ellipse
            cx={112}
            cy={74}
            rx="16"
            ry="12"
            fill={C.aid}
            fillOpacity="0.25"
            stroke={C.aid}
            strokeWidth="2.5"
          />
          <ClubSide ballX={195} ballY={160} kind="wedge" />
          <Ball cx={195} cy={160} r={9} />
          <LabeledCallout
            n={1}
            x={148}
            y={58}
            label="Headcover under lead arm"
          />
          <LabeledCallout n={2} x={220} y={148} label="Ball" />
          <LabeledCallout n={3} x={70} y={48} label="Both arms on club" />
          <ClubLabel>Wedge</ClubLabel>
          <FootNote>Chip soft. Do not drop the headcover.</FootNote>
        </>
      )
    }

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
          <L x={48} y={78} weight={700} anchor="middle">
            Hole
          </L>
          <ClubTop ballX={290} ballY={110} kind="putter" />
          <Ball cx={140} cy={110} r={8} />
          <Ball cx={210} cy={110} r={8} />
          <Ball cx={290} cy={110} r={8} />
          <LabeledCallout n={1} x={140} y={155} label="Short" side="below" />
          <LabeledCallout n={2} x={210} y={155} label="Medium" side="below" />
          <LabeledCallout n={3} x={290} y={155} label="Long" side="below" />
          <ClubLabel>Putter</ClubLabel>
          <Path d="M280 110 L70 110" />
          <FootNote>
            Putt from short, then medium, then long. Stop the ball near the hole.
          </FootNote>
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
          <L x={42} y={78} weight={700} anchor="middle">
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
          <LabeledCallout n={1} x={290} y={82} label="Ball" side="above" />
          <LabeledCallout
            n={2}
            x={180}
            y={68}
            label="Gate 2-3 feet ahead"
            side="above"
          />
          <LabeledCallout n={3} x={42} y={140} label="Hole" side="below" />
          <ClubLabel>Putter</ClubLabel>
          <Path d="M278 110 L60 110" />
          <FootNote>
            Roll the ball through the gate. Do not put the gate around the putter.
          </FootNote>
        </>
      )

    default:
      return (
        <>
          <TargetLeft />
          <Feet cx={200} cy={165} />
          <ClubTop ballX={200} ballY={100} kind={kind} />
          <Ball cx={200} cy={100} />
          <ClubLabel>{tag}</ClubLabel>
        </>
      )
  }
}
