import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/Button'

interface BetaWelcomeModalProps {
  open: boolean
  onClose: () => void
  onHelpImprove: () => void
}

export function BetaWelcomeModal({
  open,
  onClose,
  onHelpImprove,
}: BetaWelcomeModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
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

  if (!open) return null

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
        className="beta-welcome"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          type="button"
          className="feedback-sheet__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} strokeWidth={2.25} />
        </button>

        <p className="beta-welcome__badge" aria-hidden="true">
          {'\u{1F6A7}'} Early Beta
        </p>
        <h2 id={titleId}>ShotPlan beta</h2>
        <div className="beta-welcome__body muted">
          <p>Early build. Two taps in Help Improve shape what we make next.</p>
        </div>

        <div className="beta-welcome__actions">
          <Button variant="primary" block onClick={onClose}>
            Got it
          </Button>
          <Button
            variant="secondary"
            block
            onClick={() => {
              onClose()
              onHelpImprove()
            }}
          >
            Help Improve
          </Button>
        </div>
      </div>
    </div>
  )
}
