import type { TalkFields } from '../types/memory'

const CUES: { field: keyof TalkFields; pattern: RegExp }[] = [
  {
    field: 'workingOn',
    pattern: /\b(?:working on|work on|focus(?:ing)? on|watching)\b/i,
  },
  {
    field: 'tried',
    pattern:
      /\b(?:i tried|what i tried|i was trying|tried to|the change was)\b/i,
  },
  {
    field: 'worked',
    pattern:
      /\b(?:it worked|that worked|seemed better|felt better|clearly better)\b/i,
  },
  {
    field: 'didNotWork',
    pattern:
      /\b(?:didn'?t work|did not work|still (?:happening|there|showed)|got worse|no change)\b/i,
  },
  {
    field: 'remember',
    pattern:
      /\b(?:remember|next (?:round|time)|watch (?:for|this|it)|keep (?:an eye|watching))\b/i,
  },
]

export function emptyTalkFields(): TalkFields {
  return {
    workingOn: '',
    tried: '',
    worked: '',
    didNotWork: '',
    remember: '',
  }
}

function sentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function afterCue(sentence: string, pattern: RegExp) {
  const match = pattern.exec(sentence)
  if (!match || match.index === undefined) return ''
  return sentence
    .slice(match.index + match[0].length)
    .replace(/^[,:\s-]+/, '')
    .trim()
    .replace(/[.]+$/, '')
    .trim()
}

function matchingCues(sentence: string) {
  return CUES.filter((cue) => cue.pattern.test(sentence))
}

export function parseTalkTranscript(text: string): TalkFields {
  const fields = emptyTalkFields()
  const buckets = new Map<keyof TalkFields, string[]>()

  for (const sentence of sentences(text)) {
    const cues = matchingCues(sentence)
    if (cues.length !== 1) continue
    const cue = cues[0]
    const value = afterCue(sentence, cue.pattern)
    if (!value) continue
    const list = buckets.get(cue.field) ?? []
    list.push(value)
    buckets.set(cue.field, list)
  }

  for (const [field, values] of buckets) {
    const unique = [...new Set(values.map((value) => value.toLowerCase()))]
    if (unique.length === 1) fields[field] = values[0]
  }

  if (fields.worked && fields.didNotWork) {
    fields.worked = ''
    fields.didNotWork = ''
  }

  return fields
}
