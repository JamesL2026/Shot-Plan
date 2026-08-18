import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { BackLink } from '../components/ui/BackLink'
import { clubFocusQueue } from '../data/clubFocus'
import { getDrillsForSymptoms } from '../data/drills'
import { getSymptom, symptoms } from '../data/symptoms'
import { createSession } from '../lib/storage'
import type { ClubFocus, ClubFocusBySymptom, SymptomId } from '../types'

const MAX_SELECTIONS = 2

type Step = 'symptoms' | 'club'

export function CheckIn() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('symptoms')
  const [selected, setSelected] = useState<SymptomId[]>([])
  const [clubFocus, setClubFocus] = useState<ClubFocusBySymptom>({})
  const [clubQueueIndex, setClubQueueIndex] = useState(0)

  const queue = useMemo(() => clubFocusQueue(selected), [selected])
  const currentQuestion = step === 'club' ? queue[clubQueueIndex] : undefined

  const canContinueSymptoms = selected.length > 0
  const atLimit = selected.length >= MAX_SELECTIONS

  function toggleSymptom(id: SymptomId) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev
      }
      return [...prev, id]
    })
  }

  function finishSession(focusMap: ClubFocusBySymptom) {
    const drills = getDrillsForSymptoms(selected)
    const cleaned =
      Object.keys(focusMap).length > 0 ? focusMap : undefined
    const session = createSession({
      symptomIds: selected,
      drillIds: drills.map((drill) => drill.id),
      clubFocus: cleaned,
    })
    navigate(`/results?session=${session.id}`)
  }

  function handleSymptomsContinue() {
    if (selected.length === 0) return
    const nextQueue = clubFocusQueue(selected)
    if (nextQueue.length === 0) {
      finishSession({})
      return
    }
    setClubFocus({})
    setClubQueueIndex(0)
    setStep('club')
  }

  function handleClubBack() {
    if (clubQueueIndex > 0) {
      setClubQueueIndex((i) => i - 1)
      return
    }
    setStep('symptoms')
  }

  const symptomHint = useMemo(() => {
    if (selected.length === 0) return 'Pick at least one.'
    if (selected.length === 1) return '1 selected. Add one more if you want.'
    return '2 selected.'
  }, [selected.length])

  if (step === 'club' && currentQuestion) {
    const symptomLabel =
      getSymptom(currentQuestion.symptomId)?.label ?? currentQuestion.symptomId

    return (
      <section className="page check-in animate-in">
        <button type="button" className="back-link" onClick={handleClubBack}>
          <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
          <span>Back</span>
        </button>

        <div className="page-intro">
          <p className="page-intro__kicker">Almost there</p>
          <p className="club-focus__eyebrow muted">{symptomLabel}</p>
          <h1>{currentQuestion.prompt}</h1>
        </div>

        <div className="symptom-grid" role="radiogroup" aria-label={currentQuestion.prompt}>
          {currentQuestion.options.map((option) => {
            const isSelected =
              clubFocus[currentQuestion.symptomId] === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                className={
                  isSelected
                    ? 'symptom-card symptom-card--selected'
                    : 'symptom-card'
                }
                aria-checked={isSelected}
                onClick={() => {
                  const nextFocus = {
                    ...clubFocus,
                    [currentQuestion.symptomId]: option.value as ClubFocus,
                  }
                  const nextIndex = clubQueueIndex + 1
                  if (nextIndex >= queue.length) {
                    finishSession(nextFocus)
                    return
                  }
                  setClubFocus(nextFocus)
                  setClubQueueIndex(nextIndex)
                }}
              >
                <span className="symptom-card__copy">
                  <span className="symptom-card__label">{option.label}</span>
                </span>
                <span
                  className={
                    isSelected
                      ? 'symptom-card__check symptom-card__check--on'
                      : 'symptom-card__check'
                  }
                  aria-hidden="true"
                >
                  {isSelected && <Check size={16} strokeWidth={2.5} />}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section className="page check-in animate-in">
      <BackLink to="/">Home</BackLink>

      <div className="page-intro">
        <p className="page-intro__kicker">Check in</p>
        <h1>What do you want to fix?</h1>
        <p className="muted">Pick one or two.</p>
      </div>

      <div className="symptom-grid" role="group" aria-label="Trouble areas">
        {symptoms.map((symptom) => {
          const isSelected = selected.includes(symptom.id)
          const isDisabled = atLimit && !isSelected

          return (
            <button
              key={symptom.id}
              type="button"
              className={
                isSelected
                  ? 'symptom-card symptom-card--selected'
                  : 'symptom-card'
              }
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => toggleSymptom(symptom.id)}
            >
              <span className="symptom-card__copy">
                <span className="symptom-card__label">{symptom.label}</span>
                <span className="symptom-card__desc">{symptom.description}</span>
              </span>
              <span
                className={
                  isSelected
                    ? 'symptom-card__check symptom-card__check--on'
                    : 'symptom-card__check'
                }
                aria-hidden="true"
              >
                {isSelected && <Check size={16} strokeWidth={2.5} />}
              </span>
            </button>
          )
        })}
      </div>

      <p className="selection-hint muted" aria-live="polite">
        {symptomHint}
      </p>

      <div className="sticky-footer">
        <Button
          variant="primary"
          block
          disabled={!canContinueSymptoms}
          onClick={handleSymptomsContinue}
        >
          Get my practice plan
        </Button>
      </div>
    </section>
  )
}
