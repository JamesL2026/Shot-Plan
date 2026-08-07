import { useEffect, useId, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, MessageCircle, X } from 'lucide-react'
import {
  feedbackQuestionSteps,
  feedbackSteps,
  frustrationChoices,
  golferTypeChoices,
  playFrequencyChoices,
  practiceFrequencyChoices,
  recommendChoices,
  starsForUsefulness,
  struggleChoices,
  useAgainChoices,
  usefulnessChoices,
} from '../data/feedbackQuestions'
import { submitFeedback } from '../lib/feedback'
import type { FeedbackAnswers, StrugglePattern } from '../types/feedback'
import { Button } from './ui/Button'

interface FeedbackSheetProps {
  open: boolean
  onClose: () => void
  /** Optional answers to prefill when the sheet opens. */
  initialAnswers?: FeedbackAnswers
}

export function FeedbackSheet({
  open,
  onClose,
  initialAnswers,
}: FeedbackSheetProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<FeedbackAnswers>({})
  const [submitting, setSubmitting] = useState(false)
  const [openedFrom, setOpenedFrom] = useState('/')

  const step = feedbackSteps[stepIndex] ?? 'intro'
  const questionIndex = feedbackQuestionSteps.indexOf(step)
  const questionTotal = feedbackQuestionSteps.length
  const isThanks = step === 'thanks'
  const isIntro = step === 'intro'

  useEffect(() => {
    if (!open) return
    setStepIndex(0)
    setAnswers(initialAnswers ?? {})
    setSubmitting(false)
    setOpenedFrom(`${location.pathname}${location.search}`)
  }, [open, location.pathname, location.search, initialAnswers])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open, stepIndex])

  if (!open) return null

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, feedbackSteps.length - 1))
  }

  function goBack() {
    if (stepIndex <= 0) {
      onClose()
      return
    }
    setStepIndex((i) => i - 1)
  }

  function skip() {
    if (step === 'recommend') {
      void finishAndSubmit()
      return
    }
    goNext()
  }

  async function finishAndSubmit() {
    if (submitting) return
    setSubmitting(true)
    try {
      await submitFeedback({ answers, openedFrom })
      setStepIndex(feedbackSteps.indexOf('thanks'))
    } finally {
      setSubmitting(false)
    }
  }

  function handleReturnHome() {
    onClose()
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  function patchAnswers(patch: FeedbackAnswers) {
    setAnswers((prev) => ({ ...prev, ...patch }))
  }

  function toggleStruggle(value: StrugglePattern) {
    setAnswers((prev) => {
      const current = prev.struggles ?? []
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      return { ...prev, struggles: next }
    })
  }

  const primaryLabel = isIntro
    ? 'Start'
    : step === 'recommend'
      ? submitting
        ? 'Sending…'
        : 'Submit feedback'
      : 'Continue'

  async function handlePrimary() {
    if (isIntro) {
      goNext()
      return
    }
    if (step === 'recommend') {
      await finishAndSubmit()
      return
    }
    goNext()
  }

  return (
    <div className="feedback-overlay" role="presentation">
      <button
        type="button"
        className="feedback-overlay__backdrop"
        aria-label="Close feedback"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="feedback-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="feedback-sheet__chrome">
          <button
            type="button"
            className="feedback-sheet__close"
            onClick={onClose}
            aria-label="Close feedback"
          >
            <X size={20} strokeWidth={2.25} />
          </button>
          {!isIntro && !isThanks && questionIndex >= 0 && (
            <div
              className="feedback-progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={questionTotal}
              aria-valuenow={questionIndex + 1}
              aria-label={`Question ${questionIndex + 1} of ${questionTotal}`}
            >
              <div className="feedback-progress__track">
                <div
                  className="feedback-progress__fill"
                  style={{
                    width: `${((questionIndex + 1) / questionTotal) * 100}%`,
                  }}
                />
              </div>
              <p className="feedback-progress__label muted">
                {questionIndex + 1} of {questionTotal}
              </p>
            </div>
          )}
        </div>

        <div key={step} className="feedback-sheet__body animate-in">
          {isIntro && (
            <>
              <p className="feedback-sheet__kicker">Built with golfers</p>
              <h2 id={titleId}>Help Shape ShotPlan</h2>
              <p className="muted feedback-sheet__lead">
                We&apos;re building ShotPlan with real golfer feedback.
              </p>
              <p className="muted">
                This takes less than 30 seconds.
                <br />
                Every answer helps improve the app.
              </p>
            </>
          )}

          {step === 'golferType' && (
            <ChoiceStep
              titleId={titleId}
              title="How would you describe yourself?"
              choices={golferTypeChoices}
              selected={answers.golferType}
              onSelect={(value) => {
                patchAnswers({ golferType: value })
              }}
            />
          )}

          {step === 'playFrequency' && (
            <ChoiceStep
              titleId={titleId}
              title="How often do you play?"
              choices={playFrequencyChoices}
              selected={answers.playFrequency}
              onSelect={(value) => patchAnswers({ playFrequency: value })}
            />
          )}

          {step === 'practiceFrequency' && (
            <ChoiceStep
              titleId={titleId}
              title="How often do you practice?"
              choices={practiceFrequencyChoices}
              selected={answers.practiceFrequency}
              onSelect={(value) => patchAnswers({ practiceFrequency: value })}
            />
          )}

          {step === 'frustration' && (
            <ChoiceStep
              titleId={titleId}
              title="What part of your game frustrates you the most?"
              choices={frustrationChoices}
              selected={answers.frustration}
              onSelect={(value) => patchAnswers({ frustration: value })}
            />
          )}

          {step === 'struggles' && (
            <>
              <h2 id={titleId}>When you struggle, what usually happens?</h2>
              <p className="muted feedback-sheet__hint">Pick any that apply.</p>
              <div className="feedback-choices feedback-choices--multi">
                {struggleChoices.map((choice) => {
                  const selected = answers.struggles?.includes(choice.value)
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      className={
                        selected
                          ? 'feedback-choice feedback-choice--selected'
                          : 'feedback-choice'
                      }
                      aria-pressed={selected}
                      onClick={() => toggleStruggle(choice.value)}
                    >
                      <span>{choice.label}</span>
                      {selected && (
                        <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 'planUsefulness' && (
            <>
              <h2 id={titleId}>How useful was today&apos;s practice plan?</h2>
              <div className="feedback-choices">
                {usefulnessChoices.map((choice) => {
                  const selected = answers.planUsefulness === choice.value
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      className={
                        selected
                          ? 'feedback-choice feedback-choice--selected'
                          : 'feedback-choice'
                      }
                      aria-pressed={selected}
                      onClick={() =>
                        patchAnswers({ planUsefulness: choice.value })
                      }
                    >
                      <span className="feedback-choice__stars" aria-hidden="true">
                        {starsForUsefulness(choice.value)}
                      </span>
                      <span>{choice.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 'improvementIdea' && (
            <>
              <h2 id={titleId}>
                If ShotPlan could do ONE thing better, what would it be?
              </h2>
              <label className="feedback-textarea-label" htmlFor="feedback-idea">
                Optional
              </label>
              <textarea
                id="feedback-idea"
                className="feedback-textarea"
                rows={5}
                placeholder="If you could change one thing, what would it be?"
                value={answers.improvementIdea ?? ''}
                onChange={(e) =>
                  patchAnswers({ improvementIdea: e.target.value })
                }
              />
            </>
          )}

          {step === 'useAgain' && (
            <ChoiceStep
              titleId={titleId}
              title="Would you use ShotPlan after your next bad round?"
              choices={useAgainChoices}
              selected={answers.useAgain}
              onSelect={(value) => patchAnswers({ useAgain: value })}
            />
          )}

          {step === 'recommend' && (
            <ChoiceStep
              titleId={titleId}
              title="Would you recommend ShotPlan to another golfer?"
              choices={recommendChoices}
              selected={answers.recommend}
              onSelect={(value) => patchAnswers({ recommend: value })}
            />
          )}

          {isThanks && (
            <>
              <div className="feedback-thanks-icon" aria-hidden="true">
                <MessageCircle size={28} strokeWidth={2} />
              </div>
              <h2 id={titleId}>Thanks for helping improve ShotPlan.</h2>
              <p className="muted">Every piece of feedback is read.</p>
            </>
          )}
        </div>

        <div className="feedback-sheet__actions">
          {isThanks ? (
            <Button variant="primary" block onClick={handleReturnHome}>
              Return Home
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                block
                disabled={submitting}
                onClick={() => void handlePrimary()}
              >
                {primaryLabel}
              </Button>
              {!isIntro && (
                <div className="feedback-sheet__secondary">
                  <button
                    type="button"
                    className="feedback-text-btn"
                    onClick={skip}
                    disabled={submitting}
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    className="feedback-text-btn"
                    onClick={goBack}
                    disabled={submitting}
                  >
                    Back
                  </button>
                </div>
              )}
              {isIntro && (
                <button
                  type="button"
                  className="feedback-text-btn feedback-text-btn--center"
                  onClick={onClose}
                >
                  Not now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ChoiceStep<T extends string>({
  titleId,
  title,
  choices,
  selected,
  onSelect,
}: {
  titleId: string
  title: string
  choices: { value: T; label: string }[]
  selected: T | undefined
  onSelect: (value: T) => void
}) {
  return (
    <>
      <h2 id={titleId}>{title}</h2>
      <div className="feedback-choices">
        {choices.map((choice) => {
          const isSelected = selected === choice.value
          return (
            <button
              key={choice.value}
              type="button"
              className={
                isSelected
                  ? 'feedback-choice feedback-choice--selected'
                  : 'feedback-choice'
              }
              aria-pressed={isSelected}
              onClick={() => onSelect(choice.value)}
            >
              <span>{choice.label}</span>
              {isSelected && (
                <Check size={16} strokeWidth={2.5} aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}

export function FeedbackFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="feedback-fab"
      onClick={onClick}
      aria-label="Help Improve ShotPlan"
    >
      <span className="feedback-fab__emoji" aria-hidden="true">
        💬
      </span>
      <span className="feedback-fab__label">Help Improve ShotPlan</span>
    </button>
  )
}
