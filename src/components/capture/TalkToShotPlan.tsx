import { useEffect, useRef, useState } from 'react'
import {
  isLikelyJunkTranscript,
  parseDebrief,
  stripJunkPhrases,
} from '../../lib/debriefParse'
import {
  micErrorMessage,
  speechSupported,
  startVoiceCapture,
  type VoiceSession,
} from '../../lib/voiceCapture'
import { trackEvent } from '../../lib/track'
import { type DebriefFields } from '../../types/debrief'
import { Button } from '../ui/Button'

const MAX_MS = 60_000

interface TalkToShotPlanProps {
  transcript: string
  fields: DebriefFields
  onTranscript: (value: string) => void
  onFields: (value: DebriefFields) => void
  hideFields?: boolean
}

export function TalkToShotPlan({
  transcript,
  fields,
  onTranscript,
  onFields,
  hideFields = false,
}: TalkToShotPlanProps) {
  const [listening, setListening] = useState(false)
  const [starting, setStarting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [level, setLevel] = useState(0)
  const sessionRef = useRef<VoiceSession | null>(null)
  const finalsRef = useRef('')
  const displayRef = useRef('')
  const timerRef = useRef<number | null>(null)
  const fieldsRef = useRef(fields)
  const supported = speechSupported()

  fieldsRef.current = fields

  useEffect(() => {
    return () => {
      sessionRef.current?.stop()
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  async function finish(text: string) {
    setBusy(true)
    try {
      const parsed = await parseDebrief(text)
      const current = fieldsRef.current
      onFields({
        workingOn: parsed.workingOn || current.workingOn,
        tried: parsed.tried || current.tried,
        worked: parsed.worked || current.worked,
        didNotWork: parsed.didNotWork || current.didNotWork,
        remember: parsed.remember || current.remember,
      })
      trackEvent('voice_saved')
    } finally {
      setBusy(false)
    }
  }

  function stop() {
    sessionRef.current?.stop()
    sessionRef.current = null
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setListening(false)
    setStarting(false)
    setLevel(0)
    window.setTimeout(() => {
      const raw = (finalsRef.current || displayRef.current).trim()
      const text = stripJunkPhrases(raw)
      if (text && !isLikelyJunkTranscript(raw)) {
        finalsRef.current = text
        onTranscript(text)
        void finish(text)
        return
      }
      onTranscript('')
      setError(
        raw && isLikelyJunkTranscript(raw)
          ? 'That did not sound like you. Pause any video, hold the phone closer, and try again. Or type above.'
          : 'Nothing was captured. Allow the microphone if asked, then talk for a few seconds.',
      )
    }, 250)
  }

  async function start() {
    if (!supported) return
    setError('')
    finalsRef.current = ''
    displayRef.current = ''
    onTranscript('')
    trackEvent('voice_started')
    setStarting(true)
    setListening(true)
    setLevel(0)
    try {
      sessionRef.current = await startVoiceCapture({
        onAudioLevel: setLevel,
        onError: (message) => {
          setError(message)
          sessionRef.current?.stop()
          sessionRef.current = null
          if (timerRef.current) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
          }
          setListening(false)
          setStarting(false)
          setLevel(0)
        },
        onResult: (chunk, isFinal) => {
          if (isFinal) {
            finalsRef.current = [finalsRef.current, chunk]
              .filter(Boolean)
              .join(' ')
            displayRef.current = finalsRef.current
            onTranscript(finalsRef.current)
            return
          }
          const preview = [finalsRef.current, chunk].filter(Boolean).join(' ')
          displayRef.current = preview
          onTranscript(preview)
        },
      })
      timerRef.current = window.setTimeout(stop, MAX_MS)
      setStarting(false)
    } catch (err) {
      setListening(false)
      setStarting(false)
      setLevel(0)
      setError(micErrorMessage(err))
    }
  }

  function updateField(key: keyof DebriefFields, value: string) {
    onFields({ ...fields, [key]: value })
  }

  const hasAnyField = Object.values(fields).some((item) => item.trim())

  return (
    <div className="sp-talk">
      {supported ? (
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={() => (listening ? stop() : void start())}
        >
          {listening ? 'Stop' : 'Talk to ShotPlan'}
        </Button>
      ) : (
        <p className="muted">
          Voice works in Chrome or Safari on this phone. You can type the fields
          below.
        </p>
      )}

      {starting ? (
        <p className="muted">Allow the microphone if your phone asks.</p>
      ) : null}
      {listening ? (
        <div className="sp-talk__live" aria-live="polite">
          <p className="sp-talk__status">Listening. Speak now.</p>
          <p className="muted">
            Talk for 20 to 60 seconds. Tap Stop when you are done.
          </p>
          <div className="sp-talk__meter" aria-hidden="true">
            <span
              className="sp-talk__meter-fill"
              style={{ transform: `scaleX(${0.08 + level * 0.92})` }}
            />
          </div>
        </div>
      ) : null}

      {error ? <p className="sp-talk__error">{error}</p> : null}
      {busy ? <p className="muted">Reading it back.</p> : null}

      {transcript ? (
        <>
          <label className="rr-note-label" htmlFor="talk-transcript">
            What you said
          </label>
          <textarea
            id="talk-transcript"
            className="rr-note"
            value={transcript}
            onChange={(event) => onTranscript(event.target.value)}
          />
        </>
      ) : null}

      {!hideFields && (hasAnyField || transcript) ? (
        <div className="sp-confirm">
          <p className="rr-kicker">What I heard</p>
          <p className="muted">
            ShotPlan only fills a line when the words are obvious. Blank means it
            was not sure. Edit before you save.
          </p>
          <Field
            id="talk-working"
            label="Focus"
            value={fields.workingOn}
            onChange={(value) => updateField('workingOn', value)}
          />
          <Field
            id="talk-tried"
            label="What you tried"
            value={fields.tried}
            onChange={(value) => updateField('tried', value)}
          />
          <Field
            id="talk-worked"
            label="Reported result"
            value={fields.worked}
            onChange={(value) => updateField('worked', value)}
          />
          <Field
            id="talk-not"
            label="What did not work"
            value={fields.didNotWork}
            onChange={(value) => updateField('didNotWork', value)}
          />
          <Field
            id="talk-remember"
            label="Watch next"
            value={fields.remember}
            onChange={(value) => updateField('remember', value)}
          />
        </div>
      ) : null}
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <>
      <label className="rr-note-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="sp-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Leave blank if not sure"
      />
    </>
  )
}
