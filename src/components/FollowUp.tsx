import { useState } from 'react'
import { Button } from './ui/Button'
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
      <aside className="completion-card" aria-live="polite">
        <p className="completion-card__title">Nice work.</p>
        <p className="completion-card__text">
          You now have a clear plan for your next range session.
        </p>
        <p className="completion-card__note muted">{resultMessage(session)}</p>
        <Button to="/" variant="primary" block>
          Return Home
        </Button>
      </aside>
    )
  }

  if (step === 'helped') {
    return (
      <aside className="follow-up" aria-label="Did it help?">
        <p className="follow-up__title">Did it help?</p>
        <p className="muted">Be honest. It helps shape what you try next.</p>
        <div className="follow-up__actions">
          <Button variant="primary" block onClick={() => handleHelped(true)}>
            Yes, it helped
          </Button>
          <Button variant="secondary" block onClick={() => handleHelped(false)}>
            Not really
          </Button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="follow-up" aria-label="Follow up">
      <p className="follow-up__title">Did you try this plan?</p>
      <p className="muted">After your range session, come back and tap below.</p>
      <div className="follow-up__actions">
        <Button variant="primary" block onClick={() => handleTried(true)}>
          Yes, I tried it
        </Button>
        <Button variant="secondary" block onClick={() => handleTried(false)}>
          Not yet
        </Button>
      </div>
    </aside>
  )
}

function resultMessage(session: Session): string {
  switch (session.result) {
    case 'helped':
      return 'Glad it helped. Keep that swing thought next time you practice.'
    case 'did-not-help':
      return 'Useful feedback. Try the other drill next session, or check in again.'
    case 'not-tried':
      return 'No rush. Your plan is saved under Recent Sessions when you’re ready.'
    default:
      return 'Your session is saved on this device.'
  }
}
