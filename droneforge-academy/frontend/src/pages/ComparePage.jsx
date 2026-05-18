// src/pages/ComparePage.jsx
import { useState } from 'react'
import { useDroneStore } from '../lib/store'

const COMPARE_FIELDS = [
  { key: 'maxSpeed', label: 'Max Speed' },
  { key: 'range', label: 'Range' },
  { key: 'weight', label: 'Weight' },
  { key: 'flightTime', label: 'Flight Time' },
  { key: 'cost', label: 'Est. Cost' },
]

const ACCENT_COLORS = {
  cyan: 'var(--neon-cyan)',
  orange: 'var(--neon-orange)',
  purple: 'var(--neon-purple)',
  gold: 'var(--gold)',
  green: 'var(--neon-green)',
  red: '#ff2244',
}

export default function ComparePage() {
  const drones = useDroneStore(s => s.drones)
  const [selected, setSelected] = useState([drones[0].id, drones[1].id, drones[2].id])

  const toggle = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const compareDrones = drones.filter(d => selected.includes(d.id))

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">Analysis</div>
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">Compare Drones</h1>
        <p className="text-[var(--text-muted)] max-w-xl mb-10 leading-relaxed">Select up to 4 drones to compare side-by-side.</p>

        {/* Selector */}
        <div className="flex flex-wrap gap-3 mb-12">
          {drones.map(d => (
            <button
              key={d.id}
              onClick={() => toggle(d.id)}
              className={`flex items-center gap-2 px-4 py-2 border font-rajdhani font-semibold text-sm transition-all clip-btn ${
                selected.includes(d.id)
                  ? 'border-[var(--neon-cyan)] bg-[rgba(0,245,255,0.1)] text-[var(--neon-cyan)]'
                  : 'border-[rgba(0,245,255,0.15)] text-[var(--text-muted)] hover:border-[rgba(0,245,255,0.3)] hover:text-white'
              }`}
            >
              <span>{d.icon}</span> {d.name}
            </button>
          ))}
        </div>

        {/* Comparison table */}
        {compareDrones.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 font-mono-code text-[0.65rem] text-[var(--text-muted)] tracking-widest uppercase border-b border-[rgba(0,245,255,0.08)] w-32">
                    Spec
                  </th>
                  {compareDrones.map(d => (
                    <th key={d.id} className="p-5 border-b border-[rgba(0,245,255,0.08)] text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">{d.icon}</span>
                        <span className="font-orbitron text-sm font-bold text-white">{d.name}</span>
                        <span className="font-mono-code text-[0.62rem] px-2 py-0.5 border" style={{ color: ACCENT_COLORS[d.color], borderColor: ACCENT_COLORS[d.color] + '44' }}>
                          {d.category}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map(({ key, label }) => (
                  <tr key={key} className="border-b border-[rgba(0,245,255,0.05)] hover:bg-[rgba(0,245,255,0.02)] transition-colors">
                    <td className="p-4 font-mono-code text-[0.68rem] text-[var(--text-muted)] tracking-wide uppercase border-l-2 border-[rgba(0,245,255,0.1)]">
                      {label}
                    </td>
                    {compareDrones.map(d => (
                      <td key={d.id} className="p-4 text-center">
                        <span className="font-orbitron text-sm font-bold" style={{ color: ACCENT_COLORS[d.color] }}>
                          {d.specs[key]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Difficulty */}
                <tr className="border-b border-[rgba(0,245,255,0.05)] hover:bg-[rgba(0,245,255,0.02)] transition-colors">
                  <td className="p-4 font-mono-code text-[0.68rem] text-[var(--text-muted)] tracking-wide uppercase border-l-2 border-[rgba(0,245,255,0.1)]">
                    Difficulty
                  </td>
                  {compareDrones.map(d => {
                    const colors = { beginner: 'var(--neon-green)', intermediate: 'var(--neon-orange)', advanced: '#ff2244' }
                    return (
                      <td key={d.id} className="p-4 text-center">
                        <span className="font-mono-code text-xs uppercase px-2 py-1 border" style={{ color: colors[d.difficulty], borderColor: colors[d.difficulty] + '44' }}>
                          {d.difficulty}
                        </span>
                      </td>
                    )
                  })}
                </tr>

                {/* Spec bars */}
                {['speed', 'range', 'durability', 'features'].map(bar => (
                  <tr key={bar} className="border-b border-[rgba(0,245,255,0.05)] hover:bg-[rgba(0,245,255,0.02)] transition-colors">
                    <td className="p-4 font-mono-code text-[0.68rem] text-[var(--text-muted)] tracking-wide uppercase border-l-2 border-[rgba(0,245,255,0.1)] capitalize">
                      {bar}
                    </td>
                    {compareDrones.map(d => (
                      <td key={d.id} className="p-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-24 h-2 bg-white/5 rounded overflow-hidden">
                            <div
                              className="h-full rounded"
                              style={{
                                width: `${d.specBars?.[bar] || 0}%`,
                                background: ACCENT_COLORS[d.color],
                                boxShadow: `0 0 6px ${ACCENT_COLORS[d.color]}`,
                              }}
                            />
                          </div>
                          <span className="font-mono-code text-[0.62rem]" style={{ color: ACCENT_COLORS[d.color] }}>
                            {d.specBars?.[bar] || 0}%
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
