import { Link } from 'react-router-dom'

const actions = [
  {
    to: '/check-in',
    title: 'Check in',
    description: 'Tell us what went wrong. Get a short practice plan.',
    primary: true,
  },
  {
    to: '/library',
    title: 'Drill library',
    description: 'Browse drills by symptom.',
    primary: false,
  },
  {
    to: '/sessions',
    title: 'Recent sessions',
    description: 'See what you’ve worked on.',
    primary: false,
  },
] as const

export function Home() {
  return (
    <section className="page home">
      <div className="home-intro">
        <h1>What should you work on next?</h1>
        <p className="muted">
          Tap what went wrong. Walk away with a clear plan for the range.
        </p>
      </div>

      <nav className="home-actions" aria-label="Main actions">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={
              action.primary ? 'action-card action-card--primary' : 'action-card'
            }
          >
            <span className="action-card__title">{action.title}</span>
            <span className="action-card__desc">{action.description}</span>
          </Link>
        ))}
      </nav>
    </section>
  )
}
