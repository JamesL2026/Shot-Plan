import { track } from '@vercel/analytics'

export function trackEvent(name: string): void {
  try {
    track(name)
  } catch {
    /* analytics optional */
  }
}
