// src/pages/HomePage.jsx
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import ThreeBackground from '../components/ThreeBackground'
import DroneCard from '../components/DroneCard'
import { useDroneStore } from '../lib/store'

const STATS = [
  { num: '12+', label: 'Drone Types' },
  { num: '8', label: 'Build Phases' },
  { num: '50+', label: 'Components Covered' },
  { num: '0', label: 'Prior Experience Needed' },
]

const BUILD_STEPS = [
  { phase: 'Phase 01', title: 'Plan Your Build', desc: 'Define your goals, budget, and use case. Use our Build Wizard to select the right drone type and get a full parts list.', items: ['Set goals & budget', 'Choose drone type', 'Parts compatibility check'], num: '01' },
  { phase: 'Phase 02', title: 'Source Components', desc: 'Find the right parts at the best prices. We compare suppliers and flag common counterfeit products.', items: ['Frame & motors', 'ESC & flight controller', 'Battery & props'], num: '02' },
  { phase: 'Phase 03', title: 'Assemble & Solder', desc: 'Step-by-step assembly with visual guides and safety warnings. No experience needed.', items: ['Motor mounting', 'ESC wiring diagram', 'Solder like a pro'], num: '03', warn: '⚠ Li-Po batteries can be dangerous. Always check polarity before connecting power.' },
  { phase: 'Phase 04', title: 'Configure & Fly', desc: 'Flash Betaflight or ArduPilot, tune your PIDs, and take your first flight with confidence.', items: ['Firmware flashing', 'PID tuning basics', 'Maiden flight checklist'], num: '04' },
]

export default function HomePage() {
  const drones = useDroneStore(s => s.drones).slice(0, 3)

  return (
    <div className="relative">
      <ThreeBackground />

      <div className="relative z-10">
        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col justify-center px-20 pt-28 pb-20 relative">
          <div className="font-mono-code text-[0.72rem] text-[var(--neon-cyan)] tracking-[3px] uppercase mb-7 flex items-center gap-3 opacity-0 animate-[fadeUp_0.8s_ease_0.3s_forwards]">
            <span className="inline-block w-7 h-px bg-[var(--neon-cyan)] shadow-glow-cyan" />
            ✦ Complete Drone Academy
          </div>

          <h1 className="font-orbitron font-black leading-none tracking-tight opacity-0 animate-[fadeUp_0.9s_ease_0.5s_forwards]" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}>
            <span className="block text-white">BUILD YOUR</span>
            <span className="block text-[var(--neon-cyan)] text-glow-cyan">DREAM DRONE</span>
            <span className="block" style={{ background: 'linear-gradient(90deg, var(--neon-orange), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              FROM ZERO.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-lg font-light leading-relaxed text-[var(--text-muted)] opacity-0 animate-[fadeUp_0.9s_ease_0.7s_forwards]">
            Everything a complete beginner needs to design, assemble, and fly their own drone — from choosing parts to your first autonomous flight.
          </p>

          <div className="flex gap-5 mt-11 opacity-0 animate-[fadeUp_0.9s_ease_0.9s_forwards]">
            <Link to="/build" className="btn-primary flex items-center gap-2.5 px-9 py-4 bg-[var(--neon-cyan)] text-black font-orbitron text-[0.78rem] font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all">
              ⚙ Start Building
            </Link>
            <Link to="/drones" className="flex items-center gap-2.5 px-9 py-4 border border-[rgba(0,245,255,0.35)] text-[var(--neon-cyan)] font-orbitron text-[0.78rem] font-bold tracking-widest uppercase clip-btn hover:bg-[rgba(0,245,255,0.08)] transition-all">
              ◈ Explore Drones
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-18 pt-10 border-t border-[rgba(0,245,255,0.1)] opacity-0 animate-[fadeUp_0.9s_ease_1.1s_forwards]">
            {STATS.map(({ num, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-orbitron text-4xl font-black text-[var(--neon-cyan)] text-glow-cyan">{num}</span>
                <span className="text-sm text-[var(--text-muted)] tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_ease_1.5s_forwards]">
            <span className="font-mono-code text-[0.65rem] text-[var(--text-muted)] tracking-[2px]">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-[var(--neon-cyan)] to-transparent animate-scroll-pulse" />
          </div>
        </section>

        {/* ── DRONE TYPES PREVIEW ── */}
        <section className="px-20 py-24">
          <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-4 flex items-center gap-3 reveal">
            Explore <span className="w-16 h-px bg-[var(--neon-orange)] inline-block" />
          </div>
          <h2 className="font-orbitron text-4xl font-bold mb-3 reveal">Types of Drones</h2>
          <p className="text-[var(--text-muted)] max-w-lg mb-14 leading-relaxed reveal reveal-delay-1">
            From pocket-sized toys to professional cinema machines. Understand every category before you choose your build path.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drones.map((d, i) => (
              <div key={d.id} className={`reveal reveal-delay-${i + 1}`}>
                <DroneCard drone={d} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/drones" className="inline-flex items-center gap-2 font-orbitron text-sm tracking-widest uppercase text-[var(--neon-cyan)] hover:text-glow-cyan transition-all group">
              View All 12+ Drone Types
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </section>

        {/* ── BUILD GUIDE PREVIEW ── */}
        <section className="px-20 py-24 bg-[rgba(0,10,20,0.4)]">
          <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-4 flex items-center gap-3 reveal">
            How It Works <span className="w-16 h-px bg-[var(--neon-orange)] inline-block" />
          </div>
          <h2 className="font-orbitron text-4xl font-bold mb-3 reveal">The Build Journey</h2>
          <p className="text-[var(--text-muted)] max-w-lg mb-14 leading-relaxed reveal reveal-delay-1">
            Four phases take you from zero knowledge to flying your custom-built drone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BUILD_STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`flex gap-6 p-8 panel relative overflow-hidden transition-all duration-300 hover:border-[rgba(0,245,255,0.25)] hover:translate-x-1 reveal reveal-delay-${i + 1}`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
              >
                <span className="font-orbitron text-6xl font-black text-[rgba(0,245,255,0.08)] leading-none min-w-[70px] text-center">
                  {step.num}
                </span>
                <div>
                  <div className="font-mono-code text-[0.65rem] text-[var(--neon-orange)] tracking-[3px] uppercase mb-2">{step.phase}</div>
                  <div className="font-orbitron text-lg font-bold text-white mb-2">{step.title}</div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{step.desc}</p>
                  <ul className="flex flex-col gap-1.5">
                    {step.items.map(item => (
                      <li key={item} className="text-sm text-[var(--text-muted)] pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--neon-cyan)] before:text-xs">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {step.warn && (
                    <div className="mt-3 px-3.5 py-2.5 bg-[rgba(255,107,0,0.08)] border-l-2 border-[var(--neon-orange)] text-sm text-[rgba(255,200,150,0.8)] leading-relaxed">
                      {step.warn}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/build" className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--neon-orange)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-orange hover:-translate-y-0.5 transition-all">
              ⚡ Launch Build Wizard
            </Link>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section className="px-20 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-orbitron text-5xl font-black mb-5 reveal" style={{ background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ready to Build?
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed reveal reveal-delay-1">
              Join thousands of pilots who've gone from zero to flying using DroneForge Academy.
            </p>
            <div className="flex justify-center gap-5 reveal reveal-delay-2">
              <Link to="/auth" className="px-10 py-4 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all">
                Create Free Account
              </Link>
              <Link to="/courses" className="px-10 py-4 border border-[rgba(0,245,255,0.35)] text-[var(--neon-cyan)] font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:bg-[rgba(0,245,255,0.08)] transition-all">
                Browse Courses
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
