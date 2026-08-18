import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { track } from '../lib/track'
import {
  micErrorMessage,
  speechRecognitionAvailable,
  startVoiceCapture,
  type VoiceSession,
} from '../lib/speech'
import { emptyTalkFields, isLikelyJunkTranscript, parseTalkTranscript, stripJunkPhrases } from '../lib/talkParse'
import type { TalkFields } from '../types/memory'

const LISTEN_MS = 60_000

export function TalkToShotPlan({
  transcript,
  fields,
  onTranscript,
  onFields,
}: {
  transcript: string
  fields: TalkFields
  onTranscript: (value: string) => void
  onFields: (value: TalkFields) => void
}) {
  const [listening, setListening] = useState(false)
  const [starting, setStarting] = useState(false)
  const [reading, setReading] = useState(false)
  const [error, setError] = useState('')
  const [level, setLevel] = useState(0)
  const sessionRef = useRef<VoiceSession | null>(null)
  const finalsRef = useRef('')
  const displayRef = useRef('')
  const timeoutRef = useRef<number | null>(null)
  const capturedRef = useRef(false)
  const voiceReady = speechRecognitionAvailable()

  useEffect(
    () => () => {
      sessionRef.current?.stop()
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  async function readBack(text: string) {
    setReading(true)
    try {
      onFields(parseTalkTranscript(text))
    } finally {
      setReading(false)
    }
  }

  function stopListening() {
    sessionRef.current?.stop()
    sessionRef.current = null
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
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
        void readBack(text)
        return
      }
      onTranscript('')
      onFields(emptyTalkFields())
      setError(
        raw && isLikelyJunkTranscript(raw)
          ? 'That did not sound like you. Pause any video, hold the phone closer, and try again—or type below.'
          : 'Nothing was captured. Allow the microphone if asked, then talk for a few seconds.',
      )
    }, 250)
  }

  async function startListening() {
    if (!voiceReady) return
    setError('')
    finalsRef.current = ''
    displayRef.current = ''
    capturedRef.current = false
    onTranscript('')
    onFields(emptyTalkFields())
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
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          setListening(false)
          setStarting(false)
          setLevel(0)
        },
        onResult: (text, isFinal) => {
          if (isFinal) {
            if (!capturedRef.current) {
              capturedRef.current = true
              track('voice_captured')
            }
            finalsRef.current = [finalsRef.current, text]
              .filter(Boolean)
              .join(' ')
            displayRef.current = finalsRef.current
            onTranscript(finalsRef.current)
            return
          }
          const preview = [finalsRef.current, text].filter(Boolean).join(' ')
          displayRef.current = preview
          onTranscript(preview)
        },
      })
      timeoutRef.current = window.setTimeout(stopListening, LISTEN_MS)
      setStarting(false)
    } catch (err) {
      setListening(false)
      setStarting(false)
      setLevel(0)
      setError(micErrorMessage(err))
    }
  }

  function updateField(field: keyof TalkFields, value: string) {
    onFields({ ...fields, [field]: value })
  }

  const hasFields = Object.values(fields).some((value) => value.trim())

  return (
    <div className="sp-talk">
      {voiceReady ? (
        <Button
          variant="primary"
          block
          className="ready-cta__btn"
          onClick={() => (listening ? stopListening() : void startListening())}
        >
          {listening ? 'Stop' : 'Talk to Shot Plan'}
        </Button>
      ) : (
        <p className="muted">
          Voice works in Chrome or Safari on this phone. You can type the
          fields below.
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
      {reading ? <p className="muted">Reading it back.</p> : null}

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

      {hasFields || transcript ? (
        <div className="sp-confirm">
          <p className="rr-kicker">Check this</p>
          <p className="muted">
            ShotPlan only fills a line when the words are obvious. Blank means
            it was not sure.
          </p>
          <TalkField
            id="talk-working"
            label="Working on"
            value={fields.workingOn}
            onChange={(value) => updateField('workingOn', value)}
          />
          <TalkField
            id="talk-tried"
            label="What I tried"
            value={fields.tried}
            onChange={(value) => updateField('tried', value)}
          />
          <TalkField
            id="talk-worked"
            label="What worked"
            value={fields.worked}
            onChange={(value) => updateField('worked', value)}
          />
          <TalkField
            id="talk-not"
            label="What did not work"
            value={fields.didNotWork}
            onChange={(value) => updateField('didNotWork', value)}
          />
          <TalkField
            id="talk-remember"
            label="Remember"
            value={fields.remember}
            onChange={(value) => updateField('remember', value)}
          />
        </div>
      ) : null}
    </div>
  )
}

function TalkField({
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
