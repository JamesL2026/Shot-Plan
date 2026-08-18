import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '../../lib/track'
import {
  micErrorMessage,
  speechSupported,
  startVoiceCapture,
  type VoiceSession,
} from '../../lib/voiceCapture'

interface VoiceNoteButtonProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function VoiceNoteButton({
  value,
  onChange,
  label = 'Speak',
}: VoiceNoteButtonProps) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')
  const sessionRef = useRef<VoiceSession | null>(null)
  const baseRef = useRef(value)
  const supported = speechSupported()

  useEffect(() => {
    return () => {
      sessionRef.current?.stop()
    }
  }, [])

  if (!supported) {
    return (
      <p className="muted rr-hint">
        Type it. Voice works in Chrome or Safari on this phone.
      </p>
    )
  }

  async function toggle() {
    if (listening) {
      sessionRef.current?.stop()
      sessionRef.current = null
      setListening(false)
      return
    }
    setError('')
    baseRef.current = value.trim()
    setListening(true)
    trackEvent('voice_started')
    try {
      sessionRef.current = await startVoiceCapture({
        onError: (message) => {
          setError(message)
          sessionRef.current?.stop()
          sessionRef.current = null
          setListening(false)
        },
        onResult: (text, isFinal) => {
          const prefix = baseRef.current
          const next = prefix ? `${prefix} ${text}` : text
          onChange(next)
          if (isFinal) baseRef.current = next
        },
      })
    } catch (err) {
      setListening(false)
      setError(micErrorMessage(err))
    }
  }

  return (
    <>
      <button
        type="button"
        className={listening ? 'sp-voice sp-voice--on' : 'sp-voice'}
        onClick={() => void toggle()}
        aria-pressed={listening}
      >
        {listening ? 'Stop' : label}
      </button>
      {error ? <p className="sp-talk__error">{error}</p> : null}
    </>
  )
}
