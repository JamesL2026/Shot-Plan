import { useState } from 'react'
import {
  deriveSessionResult,
  updateSession,
} from '../lib/storage'
import type { Session } from '../types'

interface FollowUpProps {
  session: Session
  onUpdate: (session: Session) => void
}

export function FollowUp({ session, onUpdate }: FollowUpProps) {
  const [step, setStep] = useState<'tried' | 'helped' | 'done'>(() => {
    if (session.result !== null) return 'done'
    if (session.tried === true) return 'helped'
    return 'tried'
  })

  function applyPatch(
    patch: Partial<Pick<Session, 'tried' | 'helped' | 'result'>>,
  ) {
    const nextTried = patch.tried ?? session.tried
    const nextHelped = patch.helped ?? session.helped
    const result =
      patch.result !== undefined
        ? patch.result
        : deriveSessionResult(nextTried, nextHelped)

    const updated = updateSession(session.id, { ...patch, result })
    if (updated) onUpdate(updated)
  }

  function handleTried(tried: boolean) {
    if (!tried) {
      applyPatch({ tried: false, helped: null, result: 'not-tried' })
      setStep('done')
      return
    }
    applyPatch({ tried: true, helped: null, result: null })
    setStep('helped')
  }

  function handleHelped(helped: boolean) {
    applyPatch({
      tried: true,
      helped,
      result: helped ? 'helped' : 'did-not-help',
    })
    setStep('done')
  }

  if (step === 'done' && session.result !== null) {
    return (
      <aside className="follow-up follow-up--done" aria-live="polite">
        <p className="follow-up__title">Thanks for the check-in</p>
        <p className="muted follow-up__message">{resultMessage(session)}</p>
      </aside>
    )
  }

  if (step === 'helped') {
    return (
      <aside className="follow-up" aria-label="Did it help?">
        <p className="follow-up__title">Did it help?</p>
        <p className="muted">Be honest — it helps shape what you try next.</p>
        <div className="follow-up__actions">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => handleHelped(true)}
          >
            Yes, it helped
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={() => handleHelped(false)}
          >
            Not really
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="follow-up" aria-label="Follow up">
      <p className="follow-up__title">Did you try this plan?</p>
      <p className="muted">After your range session, come back and tap below.</p>
      <div className="follow-up__actions">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => handleTried(true)}
        >
          Yes, I tried it
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--block"
          onClick={() => handleTried(false)}
        >
          Not yet
        </button>
      </div>
    </aside>
  )
}

function resultMessage(session: Session): string {
  switch (session.result) {
    case 'helped':
      return 'Glad it helped. Keep that cue next time you practice.'
    case 'did-not-help':
      return 'That’s useful to know. Try the other drill next session, or check in again.'
    case 'not-tried':
      return 'No rush. Your plan is saved under Recent sessions when you’re ready.'
    default:
      return 'Your session is saved.'
  }
}
