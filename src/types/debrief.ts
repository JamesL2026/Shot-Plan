export interface DebriefFields {
  workingOn: string
  tried: string
  worked: string
  didNotWork: string
  remember: string
}

export function emptyDebriefFields(): DebriefFields {
  return {
    workingOn: '',
    tried: '',
    worked: '',
    didNotWork: '',
    remember: '',
  }
}

/** Swap point for a future structured-output API. Same fields, same confirmation UX. */
export type DebriefParser = (transcript: string) => Promise<DebriefFields>
