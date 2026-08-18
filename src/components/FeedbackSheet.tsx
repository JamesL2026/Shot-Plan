import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import {
  mostUsefulChoices,
  mostWorkChoices,
  remindedChoices,
  useAgainChoices,
  usefulnessChoices,
  type FeedbackChoice,
} from '../data/feedbackQuestions'
import { collectFeedbackUsage, submitFeedback } from '../lib/feedback'
import type {
  FeedbackAnswers,
  MostUsefulPart,
  MostWorkPart,
  PlanUsefulness,
  RemindedAnswer,
  UseAgainIntent,
} from '../types/feedback'
import { Button } from './ui/Button'

interface FeedbackSheetProps {
  open: boolean
  onClose: () => void
  /** Optional answers to prefill when the sheet opens. */
  initialAnswers?: FeedbackAnswers
}

function ChoiceGroup<T extends string | number>({
  label,
  value,
  choices,
  stacked,
  onChange,
}: {
  label: string
  value?: T
  choices: FeedbackChoice<T>[]
  stacked?: boolean
  onChange: (value: T) => void
}) {
  return (
    <>
      <p className="assess-survey__title">{label}</p>
      <div
        className={stacked ? 'assess-survey__reasons' : 'assess-survey__row'}
        role="group"
        aria-label={label}
      >
        {choices.map((choice) => {
          const selected = value === choice.value
          const base = stacked ? 'assess-survey__chip' : 'assess-survey__btn'
          return (
            <button
              key={String(choice.value)}
              type="button"
              className={selected ? `${base} ${base}--on` : base}
              aria-pressed={selected}
              onClick={() => onChange(choice.value)}
            >
              {choice.label}
            </button>
          )
        })}
      </div>
    </>
  )
}

export function FeedbackSheet({
  open,
  onClose,
  initialAnswers,
}: FeedbackSheetProps) {
  const location = useLocation()
  const titleId = useId()
  const ideaId = useId()
  const changeId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef({ id: '', createdAt: '' })
  const [answers, setAnswers] = useState<FeedbackAnswers>({})
  const [done, setDone] = useState(false)
  const [openedFrom, setOpenedFrom] = useState('/')
  const [moreOpen, setMoreOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const canSend = Boolean(answers.planUsefulness && answers.useAgain)

  useEffect(() => {
    if (!open) return
    sessionRef.current = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setAnswers(initialAnswers ?? {})
    setDone(false)
    setMoreOpen(false)
    setSending(false)
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

  useEffect(() => {
    if (!open || !done) return
    const timer = window.setTimeout(() => onClose(), 1800)
    return () => window.clearTimeout(timer)
  }, [open, done, onClose])

  if (!open) return null

  function patch(next: FeedbackAnswers) {
    setAnswers((current) => ({ ...current, ...next }))
  }

  function handleSend() {
    if (!canSend || sending) return
    setSending(true)
    void submitFeedback({
      id: `help-${sessionRef.current.id}`,
      createdAt: sessionRef.current.createdAt,
      openedFrom,
      usage: collectFeedbackUsage(),
      answers: { ...answers, kind: 'help-improve' },
    })
    setDone(true)
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
              <h2 id={titleId}>Thanks.</h2>
              <p className="muted">
                This helps shape what ShotPlan becomes.
              </p>
            </>
          ) : (
            <>
              <h2 id={titleId}>Help improve ShotPlan</h2>
              <p className="muted feedback-sheet__lead">
                Two quick questions. More detail is optional.
              </p>

              <div className="assess-survey assess-survey--plain">
                <ChoiceGroup
                  label="1. Did ShotPlan help you decide what to work on?"
                  value={answers.planUsefulness}
                  choices={usefulnessChoices}
                  onChange={(planUsefulness: PlanUsefulness) =>
                    patch({ planUsefulness })
                  }
                />
                <ChoiceGroup
                  label="2. Would you use ShotPlan again for another round or practice?"
                  value={answers.useAgain}
                  choices={useAgainChoices}
                  onChange={(useAgain: UseAgainIntent) => patch({ useAgain })}
                />

                <label className="assess-survey__title" htmlFor={ideaId}>
                  Anything you wish it did differently?
                  <span className="feedback-optional"> Optional</span>
                </label>
                <textarea
                  id={ideaId}
                  className="feedback-textarea feedback-textarea--short"
                  value={answers.improvementIdea ?? ''}
                  placeholder="What was confusing, missing, or not useful?"
                  onChange={(event) =>
                    patch({ improvementIdea: event.target.value })
                  }
                />

                <details
                  className="feedback-more"
                  open={moreOpen}
                  onToggle={(event) =>
                    setMoreOpen((event.target as HTMLDetailsElement).open)
                  }
                >
                  <summary className="feedback-more__summary">
                    Answer a little more
                  </summary>
                  <div className="feedback-more__body">
                    <ChoiceGroup
                      label="Did ShotPlan remind you of something you might have forgotten?"
                      value={answers.remindedOfForgotten}
                      choices={remindedChoices}
                      onChange={(remindedOfForgotten: RemindedAnswer) =>
                        patch({ remindedOfForgotten })
                      }
                    />
                    <ChoiceGroup
                      label="What part was most useful?"
                      value={answers.mostUseful}
                      choices={mostUsefulChoices}
                      stacked
                      onChange={(mostUseful: MostUsefulPart) =>
                        patch({ mostUseful })
                      }
                    />
                    <ChoiceGroup
                      label="What part felt like the most work?"
                      value={answers.mostWork}
                      choices={mostWorkChoices}
                      stacked
                      onChange={(mostWork: MostWorkPart) => patch({ mostWork })}
                    />
                    <label className="assess-survey__title" htmlFor={changeId}>
                      If you could change one thing about ShotPlan, what would it
                      be?
                      <span className="feedback-optional"> Optional</span>
                    </label>
                    <textarea
                      id={changeId}
                      className="feedback-textarea feedback-textarea--short"
                      value={answers.oneChange ?? ''}
                      onChange={(event) =>
                        patch({ oneChange: event.target.value })
                      }
                    />
                  </div>
                </details>
              </div>
            </>
          )}
        </div>

        {done ? null : (
          <div className="feedback-sheet__actions">
            <Button
              variant="primary"
              block
              disabled={!canSend || sending}
              onClick={() => handleSend()}
            >
              Send feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
