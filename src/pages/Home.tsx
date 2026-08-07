import { useState } from 'react'
import { BookOpen, Clock3, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BetaWelcomeModal } from '../components/BetaWelcomeModal'
import { useFeedback } from '../components/FeedbackContext'
import { HomeHero } from '../components/HomeHero'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function Home() {
  const { openFeedback } = useFeedback()
  const [betaOpen, setBetaOpen] = useState(false)

  return (
    <section className="page home animate-in">
      <aside className="beta-strip" aria-label="Early beta">
        <span className="beta-strip__badge">Early Beta</span>
        <button
          type="button"
          className="beta-strip__link"
          onClick={() => setBetaOpen(true)}
        >
          Built with golfer feedback · Learn more
        </button>
      </aside>

      <HomeHero />

      <div className="home-intro">
        <p className="home-intro__brand">ShotPlan</p>
        <h1>Your practice coach</h1>
        <p className="home-intro__lead">
          Tell us what went wrong. Get a focused coaching session in under a
          minute. No video. No guesswork.
        </p>
        <p className="home-intro__path muted" aria-hidden="true">
          Check in → Practice → Round Ready
        </p>
      </div>

      <nav className="home-actions" aria-label="Main actions">
        <Button to="/check-in" variant="primary" block className="home-primary">
          <span className="home-primary__inner">
            <Target size={22} strokeWidth={2.25} aria-hidden="true" />
            <span>
              <span className="home-primary__title">Check In</span>
              <span className="home-primary__desc">
                Start today&apos;s session · about 60 seconds
              </span>
            </span>
          </span>
        </Button>

        <div className="home-secondary">
          <Link to="/library" className="home-secondary-card">
            <Card padding="md" className="home-secondary-card__surface">
              <BookOpen size={20} strokeWidth={2} aria-hidden="true" />
              <span>
                <span className="home-secondary-card__title">Practice Library</span>
                <span className="home-secondary-card__desc muted">
                  Browse by miss
                </span>
              </span>
            </Card>
          </Link>

          <Link to="/sessions" className="home-secondary-card">
            <Card padding="md" className="home-secondary-card__surface">
              <Clock3 size={20} strokeWidth={2} aria-hidden="true" />
              <span>
                <span className="home-secondary-card__title">Practice Journal</span>
                <span className="home-secondary-card__desc muted">
                  Your past sessions
                </span>
              </span>
            </Card>
          </Link>
        </div>
      </nav>

      <p className="home-feedback-nudge">
        Something unclear? Tap{' '}
        <button
          type="button"
          className="home-feedback-nudge__btn"
          onClick={() => openFeedback()}
        >
          Help Improve
        </button>{' '}
        anytime. Your notes shape this beta.
      </p>

      <BetaWelcomeModal
        open={betaOpen}
        onClose={() => setBetaOpen(false)}
        onHelpImprove={() => openFeedback()}
      />
    </section>
  )
}
