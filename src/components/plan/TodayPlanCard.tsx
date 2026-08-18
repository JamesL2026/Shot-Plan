import { Button } from '../ui/Button'

interface TodayPlanCardProps {
  kicker: string
  title: string
  why: string
  lastLine?: string
  workedLine?: string
  notices?: string[]
  playTo: string
  playLabel: string
  practiceLabel: string
  showView?: boolean
}

export function TodayPlanCard({
  kicker,
  title,
  why,
  lastLine,
  workedLine,
  notices,
  playTo,
  playLabel,
  practiceLabel,
  showView,
}: TodayPlanCardProps) {
  return (
    <div className="sp-focus-card">
      <p className="rr-kicker">{kicker}</p>
      <p className="sp-focus-card__title">{title}</p>
      <p className="muted">{why}</p>
      {lastLine ? <p>{lastLine}</p> : null}
      {workedLine ? <p className="muted">{workedLine}</p> : null}
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
        <Button to="/practice" variant="primary" block>
          {practiceLabel}
        </Button>
        <Button to={playTo} variant="secondary" block>
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
