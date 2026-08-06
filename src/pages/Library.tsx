import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { BackLink } from '../components/ui/BackLink'
import { getDrillsBySymptom } from '../data/drills'
import { symptoms } from '../data/symptoms'
import type { SymptomId } from '../types'

type FilterId = 'all' | SymptomId

export function Library() {
  const [filter, setFilter] = useState<FilterId>('all')

  const sections = useMemo(() => {
    if (filter === 'all') {
      return symptoms.map((symptom) => ({
        symptom,
        drills: getDrillsBySymptom(symptom.id),
      }))
    }

    const symptom = symptoms.find((item) => item.id === filter)
    if (!symptom) return []
    return [{ symptom, drills: getDrillsBySymptom(symptom.id) }]
  }, [filter])

  return (
    <section className="page library animate-in">
      <BackLink to="/">Home</BackLink>

      <div className="page-intro">
        <h1>Drill library</h1>
        <p className="muted">
          Drills are grouped by the trouble they help most. Browse when you want
          ideas, or check in when you need a full practice plan.
        </p>
      </div>

      <div
        className="filter-row"
        role="tablist"
        aria-label="Filter by symptom"
      >
        <FilterChip
          label="All"
          selected={filter === 'all'}
          onSelect={() => setFilter('all')}
        />
        {symptoms.map((symptom) => (
          <FilterChip
            key={symptom.id}
            label={filterLabel(symptom.id, symptom.label)}
            selected={filter === symptom.id}
            onSelect={() => setFilter(symptom.id)}
          />
        ))}
      </div>

      <div className="library-sections">
        {sections.map(({ symptom, drills }) => (
          <section key={symptom.id} className="library-section">
            <h2 className="library-section__title">{symptom.label}</h2>
            <p className="library-section__desc muted">{symptom.description}</p>
            <ul className="library-list">
              {drills.map((drill) => (
                <li key={drill.id}>
                  <Link to={`/drills/${drill.id}`} className="library-item">
                    <span className="library-item__name">{drill.name}</span>
                    <span className="library-item__cue muted">{drill.cue}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}

function filterLabel(id: SymptomId, label: string): string {
  if (id === 'chipping') return 'Chipping'
  if (id === 'putting') return 'Putting'
  return label
}

function FilterChip({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={selected ? 'filter-chip filter-chip--selected' : 'filter-chip'}
      onClick={onSelect}
    >
      {label}
    </button>
  )
}
