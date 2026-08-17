import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HoleReviewScreen } from '../components/round/HoleReview'
import type { HoleDraft } from '../components/round/HoleReview'
import { MemorableHoles } from '../components/round/MemorableHoles'
import { RoundHistory } from '../components/round/RoundHistory'
import { RoundJournalScreen } from '../components/round/RoundJournal'
import { RoundReplay } from '../components/round/RoundReplay'
import { RoundSaved } from '../components/round/RoundSaved'
import { RoundStart } from '../components/round/RoundStart'
import { BackLink } from '../components/ui/BackLink'
import { buildSummary, HOLES_IN_ROUND } from '../data/roundReview'
import {
  clearRoundDraft,
  getCompletedRounds,
  getRoundById,
  getRoundDraft,
  makeMistake,
  makePositive,
  saveCompletedRound,
  saveRoundDraft,
  upsertHole,
} from '../lib/roundStorage'
import type {
  HoleReview,
  MemorableReason,
  MistakeCategory,
  MistakeSubcategory,
  Round,
  RoundFeel,
  RoundJournal,
} from '../types/round'

type Phase =
  | 'start'
  | 'hole'
  | 'memorable'
  | 'replay'
  | 'journal'
  | 'saved'
  | 'history'
  | 'view'

function emptyDraft(): HoleDraft {
  return {
    score: null,
    categories: [],
    subs: {},
    positives: [],
    rememberThisHole: false,
  }
}

function draftFromHole(hole: HoleReview): HoleDraft {
  const categories: MistakeCategory[] = []
  const subs: HoleDraft['subs'] = {}
  for (const mistake of hole.mistakes) {
    if (!categories.includes(mistake.category)) categories.push(mistake.category)
    subs[mistake.category] = mistake.subcategory
  }
  return {
    score: hole.score,
    categories,
    subs,
    positives: hole.positives.map((item) => item.category),
    rememberThisHole: hole.rememberThisHole,
  }
}

function rememberedHoles(round: Round): HoleReview[] {
  return round.holes.filter((hole) => hole.rememberThisHole)
}

export function RoundReviewPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState(() => getCompletedRounds())
  const [round, setRound] = useState<Round | null>(() => getRoundDraft())
  const [viewed, setViewed] = useState<Round | null>(null)
  const [phase, setPhase] = useState<Phase>('start')
  const [draft, setDraft] = useState<HoleDraft>(() => {
    const existing = getRoundDraft()
    if (!existing) return emptyDraft()
    const hole = existing.holes.find((item) => item.holeNumber === existing.currentHole)
    return hole ? draftFromHole(hole) : emptyDraft()
  })
  const [memorableIndex, setMemorableIndex] = useState(0)

  const holeNumber = round?.currentHole ?? 1
  const memorableList = useMemo(
    () => (round ? rememberedHoles(round) : []),
    [round],
  )
  const memorableHole = memorableList[memorableIndex]

  function persist(next: Round) {
    saveRoundDraft(next)
    setRound(next)
  }

  function startNew() {
    clearRoundDraft()
    const next: Round = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'in-progress',
      currentHole: 1,
      holes: [],
    }
    persist(next)
    setDraft(emptyDraft())
    setPhase('hole')
  }

  function continueDraft() {
    const existing = getRoundDraft()
    if (!existing) {
      startNew()
      return
    }
    const hole = existing.holes.find((item) => item.holeNumber === existing.currentHole)
    setRound(existing)
    setDraft(hole ? draftFromHole(hole) : emptyDraft())
    setPhase('hole')
  }

  function buildHole(from: HoleDraft, nothing: boolean): HoleReview | null {
    if (!round || typeof from.score !== 'number') return null
    const timestamp = new Date().toISOString()
    const mistakes = nothing
      ? []
      : from.categories.map((category) =>
          makeMistake(
            round.id,
            holeNumber,
            category,
            (from.subs[category] ?? 'other') as MistakeSubcategory,
          ),
        )
    const positives = from.positives.map((category) =>
      makePositive(round.id, holeNumber, category),
    )
    const previous = round.holes.find((item) => item.holeNumber === holeNumber)
    return {
      holeNumber,
      score: from.score,
      mistakes,
      positives,
      rememberThisHole: from.rememberThisHole,
      memorableReason: previous?.memorableReason,
      memorableNote: previous?.memorableNote,
      completedAt: timestamp,
    }
  }

  function finishHole(from: HoleDraft, nothing: boolean) {
    const hole = buildHole(from, nothing)
    if (!round || !hole) return
    const updated = upsertHole(round, hole)
    if (holeNumber >= HOLES_IN_ROUND) {
      const withSummary: Round = {
        ...updated,
        currentHole: HOLES_IN_ROUND,
        summary: buildSummary(updated.holes),
      }
      persist(withSummary)
      const remembered = rememberedHoles(withSummary)
      if (remembered.length > 0) {
        setMemorableIndex(0)
        setPhase('memorable')
        return
      }
      setPhase('replay')
      return
    }
    const nextHole = holeNumber + 1
    const nextRound = { ...updated, currentHole: nextHole }
    persist(nextRound)
    const existing = nextRound.holes.find((item) => item.holeNumber === nextHole)
    setDraft(existing ? draftFromHole(existing) : emptyDraft())
  }

  function goPreviousHole() {
    if (!round || holeNumber <= 1) return
    const previousNumber = holeNumber - 1
    const previous = round.holes.find((item) => item.holeNumber === previousNumber)
    persist({ ...round, currentHole: previousNumber })
    setDraft(previous ? draftFromHole(previous) : emptyDraft())
  }

  function patchMemorable(patch: {
    memorableReason?: MemorableReason
    memorableNote?: string
  }) {
    if (!round || !memorableHole) return
    const hole: HoleReview = { ...memorableHole, ...patch }
    persist(upsertHole(round, hole))
  }

  function continueMemorable() {
    if (!round) return
    const nextIndex = memorableIndex + 1
    const list = rememberedHoles(round)
    if (nextIndex < list.length) {
      setMemorableIndex(nextIndex)
      return
    }
    persist({ ...round, summary: buildSummary(round.holes) })
    setPhase('replay')
  }

  function saveRound() {
    if (!round) return
    const completed = saveCompletedRound({
      ...round,
      summary: buildSummary(round.holes),
    })
    setRound(null)
    setHistory(getCompletedRounds())
    setViewed(completed)
    setPhase('saved')
  }

  const backLabel =
    phase === 'start' || phase === 'history' || phase === 'saved' || phase === 'view'
      ? 'Home'
      : 'Save & leave'

  return (
    <section className="page rr-page">
      <BackLink to="/">{backLabel}</BackLink>

      {phase === 'start' ? (
        <RoundStart
          hasDraft={Boolean(getRoundDraft())}
          hasHistory={history.length > 0}
          onStart={startNew}
          onContinue={continueDraft}
          onHistory={() => setPhase('history')}
        />
      ) : null}

      {phase === 'hole' && round ? (
        <HoleReviewScreen
          holeNumber={holeNumber}
          draft={draft}
          onChange={setDraft}
          onNothing={() => finishHole(draft, true)}
          onNext={() => finishHole(draft, false)}
          onBackHole={holeNumber > 1 ? goPreviousHole : undefined}
        />
      ) : null}

      {phase === 'memorable' && memorableHole ? (
        <MemorableHoles
          hole={memorableHole}
          remaining={Math.max(0, memorableList.length - memorableIndex - 1)}
          onReason={(reason) => patchMemorable({ memorableReason: reason })}
          onNote={(note) => patchMemorable({ memorableNote: note })}
          onContinue={continueMemorable}
        />
      ) : null}

      {phase === 'replay' && round ? (
        <RoundReplay
          round={round}
          onFeel={(feel: RoundFeel) => persist({ ...round, feel })}
          onContinue={() => setPhase('journal')}
        />
      ) : null}

      {phase === 'journal' && round ? (
        <RoundJournalScreen
          journal={round.journal ?? { workedWell: [] }}
          onChange={(journal: RoundJournal) => persist({ ...round, journal })}
          onSave={saveRound}
        />
      ) : null}

      {phase === 'saved' ? (
        <RoundSaved
          onHistory={() => setPhase('history')}
          onHome={() => navigate('/')}
        />
      ) : null}

      {phase === 'history' ? (
        <RoundHistory
          rounds={history}
          onOpen={(id) => {
            const found = getRoundById(id)
            if (!found) return
            setViewed(found)
            setPhase('view')
          }}
          onNew={startNew}
        />
      ) : null}

      {phase === 'view' && viewed ? (
        <RoundReplay
          round={viewed}
          showFeel={false}
          continueLabel="Back to history"
          onFeel={() => undefined}
          onContinue={() => setPhase('history')}
        />
      ) : null}
    </section>
  )
}
