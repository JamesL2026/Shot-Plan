import { Link } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Card } from '../components/ui/Card'

const v1Screens = [
  { label: 'Home', hint: 'Brand, Check In, Test Your Game' },
  { label: 'Check In', hint: 'Pick one or two misses' },
  { label: 'Coach Brief', hint: 'Focus, priority, swing thought' },
  { label: 'Practice Challenge', hint: 'Guided drill with setup and Coach Says' },
  { label: 'Round Ready', hint: "Coach's Wrap Up" },
]

const v2Screens = [
  { label: 'Quick Baseline Start', hint: 'How the 15 shot test works' },
  { label: 'Assessment', hint: 'Club, target, hit 3 first' },
  { label: 'Shot Logging', hint: 'Good / In play / Trouble' },
  { label: 'ShotPlan Profile', hint: 'Strongest and biggest opportunity' },
  { label: 'Save Baseline', hint: 'Done. Snapshot stored on device' },
]

const evolution = [
  {
    from: 'Practice Coach',
    believed: "Golfers don't know what to practice after a bad round.",
    built: 'Miss check in and a guided coaching session.',
    revealed:
      'Many golfers already know their obvious misses. Another drill is often not new value.',
    changed: 'Use V1 as information, then test an objective skill snapshot.',
  },
  {
    from: 'User Research',
    believed: 'The gap might be knowing which skill deserves practice.',
    built: 'Nothing yet. This step was listening, not a new screen.',
    revealed:
      'Focused practice, repeating patterns, and sticking to a plan came up more than drill search.',
    changed: 'Design Quick Baseline as the next experiment.',
  },
  {
    from: 'Quick Baseline',
    believed: 'Fifteen shots can show strongest vs opportunity.',
    built: 'Five tests and a ShotPlan Profile.',
    revealed:
      'A poor category score often restates what the golfer just felt over those shots.',
    changed: 'Measurement without a new insight may not be enough.',
  },
  {
    from: 'Self Testing',
    believed: 'If scores are not new enough, round mistakes might be.',
    built: 'Not built. V2 is being preserved first.',
    revealed:
      'Early qualitative themes point toward what repeats in real rounds.',
    changed: 'Next experiment: Round Review. Hypothesis not validated.',
  },
]

const researchThemes = [
  'One bad round often does not justify changing anything.',
  'Golfers look for recurring patterns.',
  'Many golfers already know their obvious weak areas.',
  'Some golfers struggle to stick to their intended plan.',
  'Focused practice matters more than simply hitting balls.',
  'Mental mistakes and decision making can matter alongside technique.',
  'Some golfers already create their own manual systems for recording mistakes.',
]

const feedbackSources = [
  'Reddit',
  'Twitter / X',
  'Friends',
  'Golf Team',
] as const

const roadmap = [
  { version: 'v1.0', focus: 'Practice Coach' },
  { version: 'v2.0', focus: 'Quick Baseline' },
  { version: 'v3 round review', focus: 'Active development (not started)' },
  { version: 'v3.0', focus: 'Round Review, only after it is built and tested' },
]

function FeedbackPlaceholderCard({ source }: { source: string }) {
  return (
    <Card padding="lg" className="case-feedback-card" tone="soft">
      <p className="case-feedback-card__source">{source}</p>
      <dl className="case-feedback-card__fields">
        <div>
          <dt>Golfer context / handicap if known</dt>
          <dd className="case-placeholder">[If known]</dd>
        </div>
        <div>
          <dt>Feedback</dt>
          <dd className="case-placeholder">
            [Paste a real comment. Do not invent quotes.]
          </dd>
        </div>
        <div>
          <dt>Underlying problem</dt>
          <dd className="case-placeholder">[What this points to]</dd>
        </div>
        <div>
          <dt>Product decision</dt>
          <dd className="case-placeholder">
            [What this changed, validated, or will test next]
          </dd>
        </div>
      </dl>
    </Card>
  )
}

function ScreenGrid({
  slots,
}: {
  slots: { label: string; hint: string }[]
}) {
  return (
    <div className="case-screens">
      {slots.map((slot) => (
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
  )
}

export function CaseStudy() {
  return (
    <article className="page case-study animate-in">
      <BackLink to="/">Home</BackLink>
      <header className="case-study__hero">
        <p className="case-study__kicker">Product case study</p>
        <h1 className="case-study__title">ShotPlan</h1>
        <p className="case-study__lede">
          Built as a sequence of experiments: Practice Coach, then Quick
          Baseline, then Round Review next. Each version produced information
          for the next decision.
        </p>
        <p className="case-study__meta muted">
          Milestone 2.0 · Same repository · Recoverable via <code>v1.0</code>{' '}
          and <code>v2.0</code>
        </p>
      </header>

      <section className="case-section" aria-labelledby="case-evolved">
        <h2 id="case-evolved">How ShotPlan Evolved</h2>
        <ol className="case-timeline" aria-label="Product evolution">
          {[
            'Practice Coach',
            'User Research',
            'Quick Baseline',
            'Self Testing',
            'Round Review',
          ].map((step, index, list) => (
            <li key={step} className="case-timeline__item">
              <span className="case-timeline__node" aria-hidden="true" />
              <div>
                <p className="case-timeline__label">{step}</p>
                {index < list.length - 1 && (
                  <p className="case-timeline__arrow" aria-hidden="true">
                    ↓
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="muted case-section__note">
          Round Review is the next experiment. It is not in the product yet.
        </p>
        <div className="case-evolution">
          {evolution.map((item) => (
            <Card key={item.from} padding="lg" className="case-evolution__card">
              <p className="case-callout__label">{item.from}</p>
              <dl className="case-evolution__fields">
                <div>
                  <dt>What I believed</dt>
                  <dd>{item.believed}</dd>
                </div>
                <div>
                  <dt>What I built</dt>
                  <dd>{item.built}</dd>
                </div>
                <div>
                  <dt>What users or testing revealed</dt>
                  <dd>{item.revealed}</dd>
                </div>
                <div>
                  <dt>What changed</dt>
                  <dd>{item.changed}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-v1">
        <h2 id="case-v1">Version 1. Practice Coach</h2>
        <p>
          Check in, coach brief, guided challenges, Round Ready. Diagrams,
          real-setup photos, and a calm coaching voice. No accounts. No video.
        </p>
        <ScreenGrid slots={v1Screens} />
      </section>

      <section className="case-section" aria-labelledby="case-v2">
        <h2 id="case-v2">Version 2. Quick Baseline</h2>
        <p>
          Fifteen shots across driver, iron, wedge, lag putting, and short
          putting. A ShotPlan Profile shows strongest area and biggest
          opportunity. The Version 1 practice loop stays in the same app.
        </p>
        <ScreenGrid slots={v2Screens} />
      </section>

      <section className="case-section" aria-labelledby="case-research">
        <h2 id="case-research">What Golfers Told Me</h2>
        <p className="muted case-section__note">
          Placeholders only. Paste real Reddit comments, X posts, and notes.
          Do not fabricate quotes.
        </p>
        <div className="case-feedback-grid">
          {feedbackSources.map((source) => (
            <FeedbackPlaceholderCard key={source} source={source} />
          ))}
        </div>
      </section>

      <section className="case-section" aria-labelledby="case-insights">
        <h2 id="case-insights">Themes from early qualitative research</h2>
        <p className="muted case-section__note">
          Observed in early conversations and community reading. Not universal
          truths, and not a large validated study.
        </p>
        <ul className="case-insights">
          {researchThemes.map((line) => (
            <li key={line}>
              <Card padding="md" className="case-insight">
                <p>{line}</p>
              </Card>
            </li>
          ))}
        </ul>
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

      <footer className="case-study__footer">
        <p>
          Version 1 and Version 2 remain recoverable through Git tags, not
          duplicate folders. Round Review has not been implemented.
        </p>
        <Link to="/" className="case-study__home">
          ← Back to ShotPlan
        </Link>
      </footer>
    </article>
  )
}
