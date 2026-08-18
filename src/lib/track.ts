import { track as vercelTrack } from '@vercel/analytics'

export function track(name: string) {
  try {
    vercelTrack(name)
  } catch {
    /* analytics should never block the golfer */
  }
}
