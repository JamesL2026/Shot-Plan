import {
  emptyDebriefFields,
  type DebriefFields,
  type DebriefParser,
} from '../types/debrief'

interface Cue {
  field: keyof DebriefFields
  pattern: RegExp
}

const JUNK_SNIPPETS = [
  /thanks for watching/gi,
  /please subscribe/gi,
  /like and subscribe/gi,
  /see you (?:in the )?next (?:one|video|time)/gi,
  /don'?t forget to subscribe/gi,
]

export function stripJunkPhrases(text: string) {
  let out = text
  for (const pattern of JUNK_SNIPPETS) {
    out = out.replace(pattern, ' ')
  }
  return out.replace(/\s+/g, ' ').trim()
}

/** True when speech-to-text likely picked up TV, YouTube, or noise, not you. */
export function isLikelyJunkTranscript(text: string) {
  const cleaned = stripJunkPhrases(text)
  if (!cleaned) return true
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const longWords = words.filter(
    (word) => word.replace(/[^a-z]/gi, '').length >= 4,
  )
  return longWords.length === 0 && words.length <= 8
}

const CUES: Cue[] = [
  { field: 'workingOn', pattern: /\b(?:working on|work on|focus(?:ing)? on|watching)\b/i },
  { field: 'tried', pattern: /\b(?:i tried|what i tried|i was trying|tried to|the change was)\b/i },
  { field: 'worked', pattern: /\b(?:it worked|that worked|seemed better|felt better|clearly better)\b/i },
  {
    field: 'didNotWork',
    pattern: /\b(?:didn'?t work|did not work|still (?:happening|there|showed)|got worse|no change)\b/i,
  },
  {
    field: 'remember',
    pattern: /\b(?:remember|next (?:round|time)|watch (?:for|this|it)|keep (?:an eye|watching))\b/i,
  },
]

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function afterCue(sentence: string, pattern: RegExp): string {
  const match = pattern.exec(sentence)
  if (!match || match.index === undefined) return ''
  const rest = sentence.slice(match.index + match[0].length).replace(/^[,:\s-]+/, '').trim()
  return rest.replace(/[.]+$/, '').trim()
}

function matchesFor(sentence: string): Cue[] {
  return CUES.filter((cue) => cue.pattern.test(sentence))
}

/** Conservative: fill a field only when exactly one cue matches a sentence. */
export function parseDebriefLocal(transcript: string): DebriefFields {
  const fields = emptyDebriefFields()
  const hits = new Map<keyof DebriefFields, string[]>()

  for (const sentence of sentences(stripJunkPhrases(transcript))) {
    const cues = matchesFor(sentence)
    if (cues.length !== 1) continue
    const cue = cues[0]
    const value = afterCue(sentence, cue.pattern)
    if (!value) continue
    const list = hits.get(cue.field) ?? []
    list.push(value)
    hits.set(cue.field, list)
  }

  for (const [field, values] of hits) {
    const unique = [...new Set(values.map((item) => item.toLowerCase()))]
    if (unique.length !== 1) continue
    fields[field] = values[0]
  }

  if (fields.worked && fields.didNotWork) {
    fields.worked = ''
    fields.didNotWork = ''
  }

  return fields
}

export const parseDebrief: DebriefParser = async (transcript) =>
  parseDebriefLocal(transcript)
