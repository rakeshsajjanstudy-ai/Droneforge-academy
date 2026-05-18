// src/components/DroneCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

const ACCENT_COLORS = {
  cyan: 'var(--neon-cyan)',
  orange: 'var(--neon-orange)',
  purple: 'var(--neon-purple)',
  gold: 'var(--gold)',
  green: 'var(--neon-green)',
  red: '#ff2244',
}

const DIFFICULTY_LABELS = {
  beginner: { label: '◉ BEGINNER', color: 'var(--neon-green)' },
  intermediate: { label: '◉◉ INTERMEDIATE', color: 'var(--neon-orange)' },
  advanced: { label: '◉◉◉ ADVANCED', color: '#ff2244' },
}

export default function DroneCard({ drone, onSelect, selected }) {
  const accent = ACCENT_COLORS[drone.color] || ACCENT_COLORS.cyan
  const diff = DIFFICULTY_LABELS[drone.difficulty]

  return (
    <div
      onClick={() => onSelect?.(drone)}
      className={`panel clip-card relative overflow-hidden transition-all duration-350 cursor-none group ${
        selected ? 'border-[var(--neon-cyan)] shadow-glow-cyan' : 'hover:-translate-y-1.5'
      }`}
      style={{
        '--card-accent': accent,
        borderColor: selected ? accent : undefined,
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: accent }}
      />

      <div className="p-8">
        {/* Icon */}
        <span className="text-5xl mb-5 block" style={{ filter: `drop-shadow(0 0 10px ${accent}44)` }}>
          {drone.icon}
        </span>

        {/* Labels */}
        <div className="font-mono-code text-[0.65rem] tracking-[3px] uppercase mb-2" style={{ color: accent }}>
          {drone.category}
        </div>
        <div className="font-orbitron text-lg font-bold text-white mb-3">{drone.name}</div>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">{drone.desc}</p>

        {/* Specs */}
        <div className="flex flex-col gap-2.5 mb-5">
          {Object.entries(drone.specs).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono-code text-[0.68rem] text-[var(--text-muted)] uppercase tracking-wide">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-orbitron text-[0.85rem] font-bold" style={{ color: accent }}>{v}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spec bars */}
        {drone.specBars && (
          <div className="flex flex-col gap-2 mb-5">
            {Object.entries(drone.specBars).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between mb-1">
                  <span className="font-mono-code text-[0.62rem] text-[var(--text-muted)] uppercase">{k}</span>
                  <span className="font-mono-code text-[0.62rem]" style={{ color: accent }}>{v}%</span>
                </div>
                <div className="w-full h-[3px] bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${v}%`, background: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Difficulty badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border font-mono-code text-[0.65rem] tracking-[2px] uppercase"
          style={{ borderColor: diff.color, color: diff.color }}
        >
          {diff.label}
        </div>
      </div>
    </div>
  )
}
