// src/pages/CoursesPage.jsx
import { Link } from 'react-router-dom'

const COURSES = [
  { id: 'drone-101', icon: '🎓', title: 'Drone Fundamentals', desc: 'Physics, regulations, safety, and your first flight.', lessons: 12, duration: '3h 20m', level: 'Beginner', color: 'var(--neon-green)' },
  { id: 'electronics', icon: '⚡', title: 'Electronics & Wiring', desc: 'Motors, ESCs, batteries, and soldering basics.', lessons: 10, duration: '2h 45m', level: 'Beginner', color: 'var(--neon-cyan)' },
  { id: 'betaflight', icon: '🎮', title: 'Betaflight Mastery', desc: 'Configure, tune PIDs, and optimize your flight controller.', lessons: 15, duration: '4h 10m', level: 'Intermediate', color: 'var(--neon-orange)' },
  { id: 'fpv-flying', icon: '🕹️', title: 'FPV Flying Techniques', desc: 'Master first-person view flying from hover to freestyle.', lessons: 20, duration: '5h 30m', level: 'Intermediate', color: 'var(--neon-purple)' },
  { id: 'photography', icon: '🎬', title: 'Aerial Photography', desc: 'Camera settings, compositions, and cinematic techniques.', lessons: 14, duration: '3h 50m', level: 'Intermediate', color: 'var(--gold)' },
  { id: 'autonomous', icon: '🤖', title: 'Autonomous Flight', desc: 'GPS waypoints, ArduPilot, and automated missions.', lessons: 18, duration: '5h 00m', level: 'Advanced', color: '#ff2244' },
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">Academy</div>
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">Courses</h1>
        <p className="text-[var(--text-muted)] max-w-xl mb-12 leading-relaxed">
          Structured learning paths from beginner to expert. Every course is hands-on and project-based.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(c => (
            <div key={c.id} className="panel clip-card p-7 flex flex-col gap-4 hover:border-[rgba(0,245,255,0.3)] hover:-translate-y-1 transition-all group">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{c.icon}</span>
                <span className="font-mono-code text-[0.62rem] px-2 py-1 border" style={{ color: c.color, borderColor: c.color + '44' }}>{c.level}</span>
              </div>
              <div>
                <div className="font-orbitron text-base font-bold text-white mb-2">{c.title}</div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{c.desc}</p>
              </div>
              <div className="flex gap-4 text-xs font-mono-code text-[var(--text-muted)]">
                <span>📚 {c.lessons} lessons</span>
                <span>⏱ {c.duration}</span>
              </div>
              <Link
                to={`/courses/${c.id}/lessons/1`}
                className="w-full py-2.5 text-center border font-orbitron text-xs font-bold tracking-widest uppercase transition-all clip-btn"
                style={{ borderColor: c.color, color: c.color }}
              >
                Start Course
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
