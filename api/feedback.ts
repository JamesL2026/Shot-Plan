import type { VercelRequest, VercelResponse } from '@vercel/node'
import { del, get, list, put } from '@vercel/blob'

interface FeedbackAnswers {
  golferType?: string
  playFrequency?: string
  practiceFrequency?: string
  frustration?: string
  struggles?: string[]
  planUsefulness?: number
  improvementIdea?: string
  useAgain?: string
  recommend?: string
}

interface FeedbackSubmission {
  id: string
  createdAt: string
  source: 'shotplan-web'
  openedFrom: string
  answers: FeedbackAnswers
}

function isSubmission(value: unknown): value is FeedbackSubmission {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.createdAt === 'string' &&
    s.source === 'shotplan-web' &&
    typeof s.openedFrom === 'string' &&
    typeof s.answers === 'object' &&
    s.answers !== null
  )
}

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function adminAuthorized(req: VercelRequest): boolean {
  const expected = process.env.FEEDBACK_ADMIN_SECRET
  if (!expected) return false
  const header = req.headers['x-feedback-secret']
  const query =
    typeof req.query.secret === 'string' ? req.query.secret : undefined
  return header === expected || query === expected
}

async function readBlobJson(urlOrPath: string): Promise<unknown | null> {
  const result = await get(urlOrPath, { access: 'private' })
  if (!result || result.statusCode !== 200) return null
  const text = await new Response(result.stream).text()
  return JSON.parse(text) as unknown
}

function pathnameFor(submission: FeedbackSubmission): string {
  return `feedback/${submission.createdAt.slice(0, 10)}-${submission.id}.json`
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Feedback-Secret',
  )

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (!blobConfigured()) {
    res.status(503).json({
      error:
        'Feedback storage is not configured. Add a Vercel Blob store (BLOB_READ_WRITE_TOKEN).',
    })
    return
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (!isSubmission(body)) {
      res.status(400).json({ error: 'Invalid feedback payload.' })
      return
    }

    const pathname = pathnameFor(body)
    await put(pathname, JSON.stringify(body, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
    })

    res.status(201).json({ ok: true, id: body.id })
    return
  }

  if (req.method === 'GET') {
    if (!adminAuthorized(req)) {
      res.status(401).json({ error: 'Unauthorized. Provide X-Feedback-Secret.' })
      return
    }

    const { blobs } = await list({ prefix: 'feedback/', limit: 200 })
    const sorted = [...blobs].sort((a, b) =>
      b.uploadedAt > a.uploadedAt ? 1 : -1,
    )

    const submissions: FeedbackSubmission[] = []
    for (const blob of sorted) {
      try {
        const data = await readBlobJson(blob.pathname)
        if (isSubmission(data)) submissions.push(data)
      } catch {
        /* skip corrupt entries */
      }
    }

    res.status(200).json({ count: submissions.length, submissions })
    return
  }

  if (req.method === 'DELETE') {
    if (!adminAuthorized(req)) {
      res.status(401).json({ error: 'Unauthorized. Provide X-Feedback-Secret.' })
      return
    }

    const id = typeof req.query.id === 'string' ? req.query.id : undefined
    if (!id) {
      res.status(400).json({ error: 'Missing feedback id.' })
      return
    }

    const { blobs } = await list({ prefix: 'feedback/', limit: 200 })
    const match = blobs.find((blob) => blob.pathname.endsWith(`-${id}.json`))
    if (!match) {
      res.status(404).json({ error: 'Feedback not found.' })
      return
    }

    await del(match.url)
    res.status(200).json({ ok: true, id })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
