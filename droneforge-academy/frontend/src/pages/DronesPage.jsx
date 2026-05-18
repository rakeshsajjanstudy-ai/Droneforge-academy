// src/pages/DronesPage.jsx
import { useState } from 'react'
import DroneCard from '../components/DroneCard'
import { useDroneStore } from '../lib/store'

const FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function DronesPage() {
  const drones = useDroneStore(s => s.drones)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'All' ? drones : drones.filter(d =>
    d.difficulty.toLowerCase() === filter.toLowerCase()
  )

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">Explore</div>
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">Types of Drones</h1>
        <p className="text-[var(--text-muted)] max-w-xl mb-10 leading-relaxed">
          From pocket-sized toys to professional cinema machines. Understand every category before you choose your build path.
        </p>

        {/* Filters */}
        <div className="flex gap-3 mb-10">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 font-orbitron text-xs font-bold tracking-widest uppercase transition-all clip-btn ${
                filter === f
                  ? 'bg-[var(--neon-cyan)] text-black shadow-glow-cyan'
                  : 'border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:border-[rgba(0,245,255,0.4)] hover:text-[var(--neon-cyan)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(d => (
            <DroneCard
              key={d.id}
              drone={d}
              selected={selected?.id === d.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
