import { useState } from 'react'
import { BookOpen, Clock3, Flag, Gauge, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BetaWelcomeModal } from '../components/BetaWelcomeModal'
import { useFeedback } from '../components/FeedbackContext'
import { HomeHero } from '../components/HomeHero'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  getAssessmentDraft,
  getLatestAssessment,
} from '../lib/assessmentStorage'
import { getRoundDraft } from '../lib/roundStorage'

export function Home() {
  const { openFeedback } = useFeedback()
  const [betaOpen, setBetaOpen] = useState(false)
  const [latestScore] = useState(
    () => getLatestAssessment()?.result?.overallScore,
  )
  const [hasDraft] = useState(() => Boolean(getAssessmentDraft()))
  const [hasRoundDraft] = useState(() => Boolean(getRoundDraft()))
  const assessCta = hasDraft
    ? 'Continue'
    : typeof latestScore === 'number'
      ? 'View Profile'
      : 'Start'
  const assessTo = '/assessment'
  const assessDesc = hasDraft
    ? 'Pick up where you left off'
    : typeof latestScore === 'number'
      ? 'Your 15-shot snapshot'
      : 'Range snapshot · 10 min'

  return (
    <section className="page home animate-in">
      <aside className="beta-strip" aria-label="Early beta">
        <span className="beta-strip__badge">Early Beta</span>
        <button
          type="button"
          className="beta-strip__link"
          onClick={() => setBetaOpen(true)}
        >
          Built with golfers · Learn more
        </button>
      </aside>

      <HomeHero />

      <div className="home-intro">
        <p className="home-intro__brand">ShotPlan</p>
        <h1>Your practice coach</h1>
        <p className="home-intro__lead">
          Check in. Get a focused session. No video.
        </p>
        <p className="home-intro__path muted" aria-hidden="true">
          Check in → Practice → Round Ready
        </p>
      </div>

      <nav className="home-actions" aria-label="Main actions">
        <div className="home-assess">
          <p className="home-assess__kicker">Round Review</p>
          <p className="home-assess__copy">
            Track the mistakes that mattered — without tracking every shot.
          </p>
          <Button to="/round" variant="primary" block className="home-primary">
            <span className="home-primary__inner">
              <Flag size={22} strokeWidth={2.25} aria-hidden="true" />
              <span>
                <span className="home-primary__title">
                  {hasRoundDraft ? 'Continue Round' : 'Start Round'}
                </span>
                <span className="home-primary__desc">18 holes · seconds per hole</span>
              </span>
            </span>
          </Button>
        </div>

        <div className="home-assess">
          <p className="home-assess__kicker">Test Your Game</p>
          {typeof latestScore === 'number' ? (
            <p className="home-assess__score">
              Latest: {latestScore}
            </p>
          ) : (
            <p className="home-assess__copy">
              A 15-shot snapshot at the range. See what&apos;s strong and what
              to practice.
            </p>
          )}
          <Button to={assessTo} variant="secondary" block className="home-primary">
            <span className="home-primary__inner">
              <Gauge size={22} strokeWidth={2.25} aria-hidden="true" />
              <span>
                <span className="home-primary__title">{assessCta}</span>
                <span className="home-primary__desc">{assessDesc}</span>
              </span>
            </span>
          </Button>
        </div>

        <Button to="/check-in" variant="secondary" block className="home-primary home-primary--practice">
          <span className="home-primary__inner">
            <Target size={22} strokeWidth={2.25} aria-hidden="true" />
            <span>
              <span className="home-primary__title">Check In</span>
                <span className="home-primary__desc">Today&apos;s session</span>
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
        <button
          type="button"
          className="home-feedback-nudge__btn"
          onClick={() => openFeedback()}
        >
          Help Improve
        </button>
        {' · two taps anytime'}
      </p>

      <p className="home-case-link">
        <Link to="/case-study">Product case study</Link>
        <span className="muted"> · How it evolved</span>
      </p>

      <BetaWelcomeModal
        open={betaOpen}
        onClose={() => setBetaOpen(false)}
        onHelpImprove={() => openFeedback()}
      />
    </section>
  )
}
