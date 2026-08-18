import { useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { MOMENT_TYPES, SUBS_BY_TYPE } from '../../data/moments'
import type { MomentSubcategory, MomentType } from '../../types/memory'
import { VoiceNoteButton } from '../capture/VoiceNoteButton'
import { Button } from '../ui/Button'

const HOLES = Array.from({ length: 18 }, (_, index) => index + 1)

const SUB_PROMPT: Record<MomentType, string> = {
  shot: 'What kind of miss?',
  decision: 'What was the decision?',
  mental: 'What happened in your head?',
  good: 'What was good?',
}

interface MomentChooserProps {
  open: boolean
  maxHole?: number
  lastHole?: number
  onClose: () => void
  onSave: (input: {
    type: MomentType
    subcategory: MomentSubcategory
    note?: string
    holeNumber?: number
  }) => void
}

export function MomentChooser({
  open,
  maxHole = 18,
  lastHole,
  onClose,
  onSave,
}: MomentChooserProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [type, setType] = useState<MomentType | null>(null)
  const [hole, setHole] = useState<number | undefined>(lastHole)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!open) return
    setType(null)
    setHole(lastHole && lastHole <= maxHole ? lastHole : undefined)
    setNoteOpen(false)
    setNote('')
    panelRef.current?.focus()
  }, [open, lastHole, maxHole])

  if (!open) return null

  function finish(nextType: MomentType, subcategory: MomentSubcategory) {
    const trimmed = note.trim()
    onSave({
      type: nextType,
      subcategory,
      ...(trimmed ? { note: trimmed } : {}),
      ...(hole ? { holeNumber: hole } : {}),
    })
  }

  return (
    <div className="feedback-overlay" role="presentation">
      <button
        type="button"
        className="feedback-overlay__backdrop"
        aria-label="Close"
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
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.25} />
          </button>
        </div>
        <div className="feedback-sheet__body">
          <h2 id={titleId}>{type ? SUB_PROMPT[type] : 'What stood out?'}</h2>
          <p className="muted">
            Only this moment. You do not log every shot.
          </p>

          <p className="rr-note-label" id="hole-label">
            Hole (optional)
          </p>
          <div className="sp-holes" role="group" aria-labelledby="hole-label">
            {HOLES.filter((number) => number <= maxHole).map((number) => (
              <button
                key={number}
                type="button"
                className={
                  hole === number ? 'sp-hole sp-hole--on' : 'sp-hole'
                }
                onClick={() =>
                  setHole((current) => (current === number ? undefined : number))
                }
              >
                {number}
              </button>
            ))}
          </div>

          {!type ? (
            <div className="rr-cats rr-cats--stack">
              {MOMENT_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="sp-type"
                  onClick={() => setType(item.value)}
                >
                  <span className="sp-type__label">{item.label}</span>
                  <span className="sp-type__hint">{item.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              {noteOpen ? (
                <div className="sp-plan-block">
                  <p className="sp-subhead">What do you want to remember?</p>
                  <div className="sp-note-row">
                    <label className="rr-note-label" htmlFor="moment-note">
                      Type
                    </label>
                    <VoiceNoteButton
                      value={note}
                      onChange={setNote}
                      label="Talk to ShotPlan"
                    />
                  </div>
                  <textarea
                    id="moment-note"
                    className="rr-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Optional"
                  />
                  <button
                    type="button"
                    className="rr-text-link"
                    onClick={() => {
                      setNote('')
                      setNoteOpen(false)
                    }}
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <div className="sp-add-note">
                  <p className="muted">
                    Optional. Add anything you want to remember about this
                    moment.
                  </p>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => setNoteOpen(true)}
                  >
                    Add a note
                  </Button>
                </div>
              )}
              <div className="rr-cats">
                {SUBS_BY_TYPE[type].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className="rr-cat"
                    onClick={() => finish(type, item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rr-text-link"
                onClick={() => setType(null)}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
