import { BookOpen, Clock3, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HomeHero } from '../components/HomeHero'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function Home() {
  return (
    <section className="page home animate-in">
      <HomeHero />

      <div className="home-intro">
        <h1>Practice with Purpose</h1>
        <p className="muted">
          Tell ShotPlan what happened today and get a focused practice plan in
          seconds.
        </p>
      </div>

      <nav className="home-actions" aria-label="Main actions">
        <Button to="/check-in" variant="primary" block className="home-primary">
          <span className="home-primary__inner">
            <Target size={22} strokeWidth={2.25} aria-hidden="true" />
            <span>
              <span className="home-primary__title">Check In</span>
              <span className="home-primary__desc">
                Build today’s practice prescription
              </span>
            </span>
          </span>
        </Button>

        <div className="home-secondary">
          <Link to="/library" className="home-secondary-card">
            <Card padding="md" className="home-secondary-card__surface">
              <BookOpen size={20} strokeWidth={2} aria-hidden="true" />
              <span>
                <span className="home-secondary-card__title">Drill Library</span>
                <span className="home-secondary-card__desc muted">
                  Browse by symptom
                </span>
              </span>
            </Card>
          </Link>

          <Link to="/sessions" className="home-secondary-card">
            <Card padding="md" className="home-secondary-card__surface">
              <Clock3 size={20} strokeWidth={2} aria-hidden="true" />
              <span>
                <span className="home-secondary-card__title">Recent Sessions</span>
                <span className="home-secondary-card__desc muted">
                  Your past plans
                </span>
              </span>
            </Card>
          </Link>
        </div>
      </nav>
    </section>
  )
}
