import { Button } from '../ui/Button'

interface TodayPlanCardProps {
  kicker: string
  title: string
  why: string
  lastLine?: string
  workedLine?: string
  todayTest?: string
  notices?: string[]
  playTo: string
  playLabel: string
  practiceLabel: string
  showView?: boolean
  onPractice?: () => void
  onPlay?: () => void
}

export function TodayPlanCard({
  kicker,
  title,
  why,
  lastLine,
  workedLine,
  todayTest,
  notices,
  playTo,
  playLabel,
  practiceLabel,
  showView,
  onPractice,
  onPlay,
}: TodayPlanCardProps) {
  return (
    <div className="sp-focus-card">
      <p className="rr-kicker">{kicker}</p>
      <p className="sp-focus-card__title">{title}</p>

      <div className="sp-plan-block">
        <p className="rr-kicker">Why this</p>
        <p>{why}</p>
      </div>

      {workedLine ? (
        <div className="sp-plan-block">
          <p className="rr-kicker">Previously reported helpful</p>
          <p>{workedLine}</p>
        </div>
      ) : null}

      {lastLine ? (
        <div className="sp-plan-block">
          <p className="rr-kicker">Remember</p>
          <p>{lastLine}</p>
        </div>
      ) : null}

      {todayTest ? (
        <div className="sp-plan-block">
          <p className="rr-kicker">Today's test</p>
          <p>{todayTest}</p>
        </div>
      ) : null}

      {notices && notices.length > 0 ? (
        <ul className="rr-counts">
          {notices.map((line) => (
            <li key={line} className="rr-count">
              {line}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="sp-focus-card__actions">
        <Button to="/practice" variant="primary" block onClick={onPractice}>
          {practiceLabel}
        </Button>
        <Button to={playTo} variant="secondary" block onClick={onPlay}>
          {playLabel}
        </Button>
        {showView ? (
          <Button to="/progress" variant="secondary" block>
            History
          </Button>
        ) : null}
      </div>
    </div>
  )
}
