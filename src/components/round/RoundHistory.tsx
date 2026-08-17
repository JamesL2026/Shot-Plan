import { Button } from '../ui/Button'
import { categoryLabel, formatRoundDate } from '../../data/roundReview'
import type { Round } from '../../types/round'

interface RoundHistoryProps {
  rounds: Round[]
  onOpen: (id: string) => void
  onNew: () => void
}

export function RoundHistory({ rounds, onOpen, onNew }: RoundHistoryProps) {
  return (
    <section className="rr-history animate-in">
      <p className="rr-kicker">ShotPlan</p>
      <h1>Round History</h1>
      <p className="muted rr-hint">What accumulated. No charts yet.</p>

      {rounds.length === 0 ? (
        <p className="rr-empty">No rounds saved yet.</p>
      ) : (
        <ul className="rr-history-list">
          {rounds.map((round) => {
            const score = round.summary?.totalScore
            const top = (round.summary?.mistakeCounts ?? []).slice(0, 3)
            return (
              <li key={round.id}>
                <button
                  type="button"
                  className="rr-history-item"
                  onClick={() => onOpen(round.id)}
                >
                  <span className="rr-history-item__top">
                    <span>{formatRoundDate(round.completedAt ?? round.createdAt)}</span>
                    <strong>{typeof score === 'number' ? score : '—'}</strong>
                  </span>
                  <span className="rr-history-item__cats muted">
                    {top.length === 0
                      ? 'No mistakes logged'
                      : top
                          .map((item) => `${categoryLabel(item.category)} ${item.count}`)
                          .join(' · ')}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="rr-actions">
        <Button variant="primary" block className="ready-cta__btn" onClick={onNew}>
          Start 18 Holes
        </Button>
      </div>
    </section>
  )
}
