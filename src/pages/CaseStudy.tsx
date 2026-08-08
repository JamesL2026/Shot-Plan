import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'

const insightSeeds = [
  'One bad round isn’t enough.',
  'Golfers think in patterns.',
  'Most golfers already know their weakness.',
  'Practice isn’t the problem. Transfer is.',
  'Mental game matters.',
  'Decision making matters.',
]

const feedbackCategories = [
  'Reddit',
  'Twitter / X',
  'Friends',
  'Golf Team',
] as const

const roadmap = [
  { version: 'Version 1', focus: 'Practice prescriptions' },
  { version: 'Version 2', focus: 'Round review' },
  { version: 'Version 3', focus: 'Pattern recognition' },
  { version: 'Version 4', focus: 'Personalized improvement engine' },
]

const productTimeline = [
  'Idea',
  'Version 1',
  'User Feedback',
  'Version 2',
  'Future Vision',
]

const screenshotSlots = [
  { label: 'Home', hint: 'Brand, Check In, library & journal entry points' },
  { label: 'Coach Brief', hint: 'Focus, today’s priority, swing thought' },
  { label: 'Practice Session', hint: 'Guided challenge with setup & Coach Says' },
  { label: 'Round Ready', hint: 'Coach’s Wrap-Up and reflection' },
]

function FeedbackPlaceholderCard({ source }: { source: string }) {
  return (
    <Card padding="lg" className="case-feedback-card" tone="soft">
      <p className="case-feedback-card__source">{source}</p>
      <dl className="case-feedback-card__fields">
        <div>
          <dt>Date</dt>
          <dd className="case-placeholder">[YYYY-MM-DD]</dd>
        </div>
        <div>
          <dt>Quote</dt>
          <dd className="case-placeholder">
            [Paste a real comment here. Do not invent quotes.]
          </dd>
        </div>
        <div>
          <dt>Design decision</dt>
          <dd className="case-placeholder">
            [What this feedback changed or validated]
          </dd>
        </div>
      </dl>
    </Card>
  )
}

export function CaseStudy() {
  return (
    <article className="page case-study animate-in">
      <header className="case-study__hero">
        <p className="case-study__kicker">Product case study</p>
        <h1 className="case-study__title">ShotPlan</h1>
        <p className="case-study__lede">
          Version 1 started as a practice prescription tool. The journey is about
          validating what golfers actually need — and evolving the product from
          real feedback, not assumptions alone.
        </p>
        <p className="case-study__meta muted">
          Milestone 1.0 · Same repository for Version 2 · Recoverable via{' '}
          <code>v1.0</code>
        </p>
      </header>

      <section className="case-section" aria-labelledby="case-problem">
        <h2 id="case-problem">Problem</h2>
        <p>
          What I originally thought existed: golfers leave a bad round frustrated,
          then waste range time because they do not know what to practice next.
          Tip overload replaces a clear plan.
        </p>
      </section>

      <section className="case-section" aria-labelledby="case-hypothesis">
        <h2 id="case-hypothesis">Hypothesis</h2>
        <Card padding="lg" tone="sand" className="case-callout">
          <p className="case-callout__label">Original hypothesis</p>
          <p className="case-callout__text">
            Golfers don&apos;t know what to practice after a bad round.
          </p>
        </Card>
        <p>
          If ShotPlan asks what went wrong and returns a short, coach-led session
          with one swing thought, golfers will practice with more focus and leave
          Round Ready.
        </p>
      </section>

      <section className="case-section" aria-labelledby="case-v1">
        <h2 id="case-v1">Version 1</h2>
        <p>
          Version 1 ships a complete loop: check in, coach brief, guided
          challenges, and Round Ready — with diagrams, real-setup photos, and a
          calm coaching voice. No accounts. No video analysis.
        </p>
        <div className="case-screens">
          {screenshotSlots.map((slot) => (
            <figure key={slot.label} className="case-screen">
              <div className="case-screen__frame" aria-hidden="true">
                <span>Screenshot</span>
              </div>
              <figcaption>
                <strong>{slot.label}</strong>
                <span className="muted">{slot.hint}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-research">
        <h2 id="case-research">What Golfers Told Me</h2>
        <p className="muted case-section__note">
          Placeholders only. Paste Reddit comments, X posts, and notes from
          friends or your golf team. Do not fabricate quotes.
        </p>
        <div className="case-feedback-grid">
          {feedbackCategories.map((source) => (
            <FeedbackPlaceholderCard key={source} source={source} />
          ))}
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-insights">
        <h2 id="case-insights">Key Insights</h2>
        <ul className="case-insights">
          {insightSeeds.map((line) => (
            <li key={line}>
              <Card padding="md" className="case-insight">
                <p>{line}</p>
                <p className="case-placeholder case-insight__note">
                  [Expand with your research notes]
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-section" aria-labelledby="case-changed">
        <h2 id="case-changed">How The Product Changed</h2>
        <ol className="case-timeline" aria-label="Product evolution">
          {productTimeline.map((step, index) => (
            <li key={step} className="case-timeline__item">
              <span className="case-timeline__node" aria-hidden="true" />
              <div>
                <p className="case-timeline__label">{step}</p>
                {index < productTimeline.length - 1 && (
                  <p className="case-timeline__arrow" aria-hidden="true">
                    ↓
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-section" aria-labelledby="case-community">
        <h2 id="case-community">Community Feedback</h2>
        <p className="muted case-section__note">
          Clean quote cards by source. Fill when real feedback arrives.
        </p>
        <div className="case-feedback-grid">
          {feedbackCategories.map((source) => (
            <FeedbackPlaceholderCard key={`wall-${source}`} source={source} />
          ))}
        </div>
        <Card padding="lg" tone="soft" className="case-example">
          <p className="case-callout__label">Example shape (replace)</p>
          <p className="case-example__quote">
            &ldquo;I already know what to practice.&rdquo;
          </p>
          <p className="muted">
            <strong>Decision:</strong> Move toward pattern recognition instead of
            drill recommendations alone.
          </p>
        </Card>
      </section>

      <section className="case-section" aria-labelledby="case-roadmap">
        <h2 id="case-roadmap">Roadmap</h2>
        <ol className="case-roadmap" aria-label="Product roadmap">
          {roadmap.map((item, index) => (
            <li key={item.version} className="case-roadmap__item">
              <div className="case-roadmap__card">
                <p className="case-roadmap__version">{item.version}</p>
                <p className="case-roadmap__focus">{item.focus}</p>
              </div>
              {index < roadmap.length - 1 && (
                <p className="case-roadmap__connector" aria-hidden="true">
                  ↓
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="case-section" aria-labelledby="case-reflection">
        <h2 id="case-reflection">Reflection</h2>
        <div className="case-reflection-grid">
          {[
            'What I learned about product design',
            'Importance of user research',
            'Importance of validating assumptions',
            'Importance of shipping quickly',
          ].map((title) => (
            <Card key={title} padding="lg" className="case-reflection">
              <h3>{title}</h3>
              <p className="case-placeholder">[Your personal notes]</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="case-study__footer">
        <p>
          Version 1 remains recoverable through Git tags — not duplicate folders.
          Continue Version 2 in this repository.
        </p>
        <Link to="/" className="case-study__home">
          ← Back to ShotPlan
        </Link>
      </footer>
    </article>
  )
}
