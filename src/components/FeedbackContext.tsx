import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { FeedbackAnswers } from '../types/feedback'
import { FeedbackSheet } from './FeedbackSheet'

interface OpenFeedbackOptions {
  /** Prefill answers when opening from a contextual prompt. */
  seed?: FeedbackAnswers
}

interface FeedbackContextValue {
  openFeedback: (options?: OpenFeedbackOptions) => void
  closeFeedback: () => void
  feedbackOpen: boolean
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [seed, setSeed] = useState<FeedbackAnswers | undefined>()

  const openFeedback = useCallback((options?: OpenFeedbackOptions) => {
    setSeed(options?.seed)
    setFeedbackOpen(true)
  }, [])

  const closeFeedback = useCallback(() => {
    setFeedbackOpen(false)
    setSeed(undefined)
  }, [])

  const value = useMemo(
    () => ({ openFeedback, closeFeedback, feedbackOpen }),
    [openFeedback, closeFeedback, feedbackOpen],
  )

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackSheet
        open={feedbackOpen}
        onClose={closeFeedback}
        initialAnswers={seed}
      />
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) {
    throw new Error('useFeedback must be used within FeedbackProvider')
  }
  return ctx
}
