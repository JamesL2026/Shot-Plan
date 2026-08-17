import { useEffect, useId, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import { useAgainChoices, usefulnessChoices } from '../data/feedbackQuestions'
import { submitFeedback } from '../lib/feedback'
import type { FeedbackAnswers, PlanUsefulness, UseAgainIntent } from '../types/feedback'
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
  const sessionRef = useRef({ id: '', createdAt: '' })
  const [answers, setAnswers] = useState<FeedbackAnswers>({})
  const [done, setDone] = useState(false)
  const [openedFrom, setOpenedFrom] = useState('/')

  useEffect(() => {
    if (!open) return
    sessionRef.current = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const seed = initialAnswers ?? {}
    setAnswers(seed)
    setDone(Boolean(seed.planUsefulness && seed.useAgain))
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
  }, [open, done])

  if (!open) return null

  function send(next: FeedbackAnswers) {
    void submitFeedback({
      id: `help-${sessionRef.current.id}`,
      createdAt: sessionRef.current.createdAt,
      openedFrom,
      answers: { ...next, kind: 'help-improve' },
    })
  }

  function pick(patch: FeedbackAnswers) {
    const next = { ...answers, ...patch }
    setAnswers(next)
    send(next)
    if (next.planUsefulness && next.useAgain) setDone(true)
  }

  function handleReturnHome() {
    onClose()
    if (location.pathname !== '/') {
      navigate('/')
    }
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
        className="feedback-sheet feedback-sheet--compact"
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
        </div>

        <div className="feedback-sheet__body animate-in">
          {done ? (
            <>
              <div className="feedback-thanks-icon" aria-hidden="true">
                <MessageCircle size={28} strokeWidth={2} />
              </div>
              <h2 id={titleId}>Got it. Thank you.</h2>
              <p className="muted">Every answer is read.</p>
            </>
          ) : (
            <>
              <h2 id={titleId}>Two taps</h2>
              <p className="muted feedback-sheet__lead">
                Helps us improve ShotPlan.
              </p>

              <div className="assess-survey assess-survey--plain">
                <p className="assess-survey__title">Useful today?</p>
                <div
                  className="assess-survey__row"
                  role="group"
                  aria-label="Useful today"
                >
                  {usefulnessChoices.map((choice) => {
                    const selected = answers.planUsefulness === choice.value
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        className={
                          selected
                            ? 'assess-survey__btn assess-survey__btn--on'
                            : 'assess-survey__btn'
                        }
                        aria-pressed={selected}
                        onClick={() =>
                          pick({ planUsefulness: choice.value as PlanUsefulness })
                        }
                      >
                        {choice.label}
                      </button>
                    )
                  })}
                </div>

                <p className="assess-survey__title">Use it again?</p>
                <div
                  className="assess-survey__row"
                  role="group"
                  aria-label="Use it again"
                >
                  {useAgainChoices.map((choice) => {
                    const selected = answers.useAgain === choice.value
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        className={
                          selected
                            ? 'assess-survey__btn assess-survey__btn--on'
                            : 'assess-survey__btn'
                        }
                        aria-pressed={selected}
                        onClick={() =>
                          pick({ useAgain: choice.value as UseAgainIntent })
                        }
                      >
                        {choice.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="feedback-sheet__actions">
          {done ? (
            <Button variant="primary" block onClick={handleReturnHome}>
              Done
            </Button>
          ) : (
            <button
              type="button"
              className="feedback-text-btn feedback-text-btn--center"
              onClick={onClose}
            >
              Not now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
