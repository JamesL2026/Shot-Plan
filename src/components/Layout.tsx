import { ChartNoAxesColumn, Flag, House, Target } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FeedbackProvider, useFeedback } from './FeedbackContext'

const NAV = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/play', label: 'Play', icon: Flag, end: false },
  { to: '/practice', label: 'Practice', icon: Target, end: false },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesColumn, end: false },
]

function MainNav() {
  return (
    <nav className="sp-nav" aria-label="Main">
      {NAV.map((item) => (
        <NavLink
          to={item.to}
          end={item.end}
          key={item.to}
          className={({ isActive }) =>
            isActive ? 'sp-nav__item sp-nav__item--on' : 'sp-nav__item'
          }
        >
          <item.icon size={20} strokeWidth={2.25} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function LayoutChrome() {
  const { openFeedback } = useFeedback()

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          ShotPlan
        </Link>
        <button
          type="button"
          className="header-feedback header-feedback--btn"
          onClick={() => openFeedback()}
          aria-label="Help improve ShotPlan. Leave feedback."
        >
          Help Improve
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <MainNav />
    </div>
  )
}

export function Layout() {
  return (
    <FeedbackProvider>
      <LayoutChrome />
    </FeedbackProvider>
  )
}
