export type SpeechResultHandler = (text: string, isFinal: boolean) => void

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<{
    isFinal: boolean
    0?: { transcript?: string }
  }>
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null
}

export function speechRecognitionAvailable() {
  return getSpeechRecognitionCtor() !== null
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function micErrorMessage(err: unknown) {
  const name =
    err && typeof err === 'object' && 'name' in err ? String(err.name) : ''
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Microphone is blocked. Allow it for this site, then tap Talk again.'
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No microphone found on this device.'
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'The microphone is already in use. Close other apps and try again.'
  }
  if (name === 'SecurityError') {
    return 'Voice needs a secure connection. Open the live site and try again.'
  }
  return 'Could not turn the microphone on. Check browser settings and try again.'
}

export function speechErrorMessage(code: string) {
  switch (code) {
    case 'not-allowed':
      return 'Microphone is blocked. Allow it for this site, then tap Talk again.'
    case 'audio-capture':
      return 'No microphone available.'
    case 'network':
      return 'Voice needs a network connection to turn speech into text.'
    case 'service-not-allowed':
      return 'Voice is not available in this browser. Try Safari or Chrome.'
    case 'language-not-supported':
      return 'This phone could not start English voice capture. Try Safari or Chrome.'
    case 'aborted':
    case 'no-speech':
      return ''
    default:
      return 'Voice stopped before it captured anything. Try again, or type below.'
  }
}

export type VoiceSession = {
  stop: () => void
}

export async function startVoiceCapture(options: {
  onResult: SpeechResultHandler
  onError: (message: string) => void
  onAudioLevel?: (level: number) => void
}): Promise<VoiceSession> {
  const Ctor = getSpeechRecognitionCtor()
  if (!Ctor) {
    throw new Error('Voice is not available in this browser.')
  }
  if (!window.isSecureContext) {
    throw new Error(
      'Voice needs a secure connection. Open the live site and try again.',
    )
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser cannot use the microphone.')
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  })

  let audioContext: AudioContext | null = null
  let raf = 0
  const { onAudioLevel } = options
  if (onAudioLevel) {
    const Context =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (Context) {
      audioContext = new Context()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const sample of data) {
          const n = (sample - 128) / 128
          sum += n * n
        }
        onAudioLevel(Math.min(1, Math.sqrt(sum / data.length) * 4))
        raf = window.requestAnimationFrame(tick)
      }
      tick()
      void audioContext.resume()
    }
  }

  const rec = new Ctor()
  rec.continuous = !isIos()
  rec.interimResults = true
  rec.lang = 'en-US'
  rec.maxAlternatives = 1

  let stopped = false
  let sawResult = false

  rec.onresult = (event) => {
    let finals = ''
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i]
      const text = result[0]?.transcript?.trim() ?? ''
      if (!text) continue
      if (result.isFinal) finals = finals ? `${finals} ${text}` : text
      else interim = text
    }
    if (finals) {
      sawResult = true
      options.onResult(finals, true)
    } else if (interim) {
      sawResult = true
      options.onResult(interim, false)
    }
  }

  rec.onerror = (event) => {
    if (event.error === 'no-speech') return
    if (event.error === 'aborted') {
      stopped = true
      return
    }
    stopped = true
    const message = speechErrorMessage(event.error)
    if (message) options.onError(message)
  }

  rec.onend = () => {
    if (stopped) return
    try {
      rec.start()
    } catch {
      stopped = true
      if (!sawResult) {
        options.onError(
          'Voice stopped. Tap Talk, allow the microphone, then speak.',
        )
      }
    }
  }

  try {
    rec.start()
  } catch (err) {
    stream.getTracks().forEach((track) => track.stop())
    cancelAnimationFrame(raf)
    void audioContext?.close()
    throw err
  }

  return {
    stop() {
      stopped = true
      rec.onerror = null
      rec.onend = () => {
        rec.onresult = null
        rec.onend = null
        cancelAnimationFrame(raf)
        void audioContext?.close()
        stream.getTracks().forEach((track) => track.stop())
      }
      try {
        rec.stop()
      } catch {
        rec.onresult = null
        rec.onend = null
        cancelAnimationFrame(raf)
        void audioContext?.close()
        stream.getTracks().forEach((track) => track.stop())
      }
    },
  }
}
