import { Button } from './ui/Button'

export function ConfirmSheet({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="feedback-overlay" role="presentation">
      <button
        type="button"
        className="feedback-overlay__backdrop"
        aria-label="Cancel"
        onClick={onCancel}
      />
      <div
        className="feedback-sheet feedback-sheet--compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="feedback-sheet__body">
          <h2 id="confirm-title">{title}</h2>
          <p className="muted">{body}</p>
          <div className="rr-actions">
            <Button variant="primary" block onClick={onConfirm}>
              {confirmLabel}
            </Button>
            <Button variant="secondary" block onClick={onCancel}>
              Keep it
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
