import { Link, Outlet } from 'react-router-dom'
import { FeedbackProvider, useFeedback } from './FeedbackContext'

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
        >
          {'\u{1F4AC}'} Help Improve
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
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

export { useFeedback }
