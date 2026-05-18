// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { buildService } from '../lib/firestore'
import { Zap, Wrench, BookOpen, Trophy, Plus, Clock, ChevronRight } from 'lucide-react'

const XP_LEVELS = [
  { level: 'Rookie Pilot', min: 0, max: 500, color: 'var(--neon-green)' },
  { level: 'Hobbyist Builder', min: 500, max: 1500, color: 'var(--neon-cyan)' },
  { level: 'Tech Enthusiast', min: 1500, max: 3000, color: 'var(--neon-orange)' },
  { level: 'Drone Engineer', min: 3000, max: 6000, color: 'var(--neon-purple)' },
  { level: 'Master Pilot', min: 6000, max: Infinity, color: 'var(--gold)' },
]

function getUserLevel(xp) {
  return XP_LEVELS.find(l => xp >= l.min && xp < l.max) || XP_LEVELS[0]
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = buildService.subscribeToBuilds(user.uid, (data) => {
      setBuilds(data)
      setLoading(false)
    })
    return unsub
  }, [user])

  const xp = profile?.xp || 0
  const level = getUserLevel(xp)
  const nextLevel = XP_LEVELS[XP_LEVELS.indexOf(level) + 1]
  const xpProgress = nextLevel
    ? Math.round(((xp - level.min) / (nextLevel.min - level.min)) * 100)
    : 100

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">
            Control Center
          </div>
          <h1 className="font-orbitron text-4xl font-black text-white">
            Welcome back, <span className="text-[var(--neon-cyan)]">{profile?.displayName?.split(' ')[0] || 'Pilot'}</span>
          </h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Zap size={20} />, label: 'Total XP', value: xp.toLocaleString(), color: 'var(--neon-cyan)' },
            { icon: <Wrench size={20} />, label: 'Active Builds', value: builds.filter(b => b.status !== 'complete').length, color: 'var(--neon-orange)' },
            { icon: <BookOpen size={20} />, label: 'Courses In Progress', value: profile?.completedCourses?.length || 0, color: 'var(--neon-purple)' },
            { icon: <Trophy size={20} />, label: 'Badges Earned', value: profile?.badges?.length || 0, color: 'var(--gold)' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="panel p-5 clip-card">
              <div className="flex items-center gap-2 mb-3" style={{ color }}>
                {icon}
                <span className="font-mono-code text-[0.65rem] tracking-widest uppercase">{label}</span>
              </div>
              <div className="font-orbitron text-3xl font-black" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="panel clip-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-mono-code text-[0.65rem] text-[var(--text-muted)] tracking-widest uppercase mb-1">Current Rank</div>
              <div className="font-orbitron text-xl font-bold" style={{ color: level.color }}>{level.level}</div>
            </div>
            {nextLevel && (
              <div className="text-right">
                <div className="font-mono-code text-[0.65rem] text-[var(--text-muted)] tracking-widest uppercase mb-1">Next Rank</div>
                <div className="font-orbitron text-sm font-bold text-[var(--text-muted)]">{nextLevel.level}</div>
                <div className="font-mono-code text-xs text-[var(--neon-cyan)]">{nextLevel.min - xp} XP needed</div>
              </div>
            )}
          </div>
          <div className="w-full h-2 bg-white/5 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-1000"
              style={{ width: `${xpProgress}%`, background: level.color, boxShadow: `0 0 10px ${level.color}` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono-code text-xs text-[var(--text-muted)]">{xp} XP</span>
            {nextLevel && <span className="font-mono-code text-xs text-[var(--text-muted)]">{nextLevel.min} XP</span>}
          </div>
        </div>

        {/* Builds section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-orbitron text-lg font-bold text-white">My Builds</h2>
              <Link to="/build" className="flex items-center gap-2 text-sm font-orbitron tracking-widest uppercase text-[var(--neon-cyan)] hover:text-glow-cyan transition-all">
                <Plus size={16} /> New Build
              </Link>
            </div>

            {loading ? (
              <div className="panel p-8 text-center text-[var(--text-muted)] font-mono-code text-sm">
                Loading builds...
              </div>
            ) : builds.length === 0 ? (
              <div className="panel clip-card p-10 text-center">
                <div className="text-4xl mb-4">🔧</div>
                <div className="font-orbitron text-lg font-bold text-white mb-2">No builds yet</div>
                <p className="text-[var(--text-muted)] text-sm mb-6">Start your first drone build with our guided wizard.</p>
                <Link to="/build" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all">
                  ⚙ Start Building
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {builds.map(build => (
                  <div key={build.id} className="panel clip-card p-5 flex items-center justify-between gap-4 hover:border-[rgba(0,245,255,0.25)] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-[rgba(0,245,255,0.2)] flex items-center justify-center text-xl">
                        🚁
                      </div>
                      <div>
                        <div className="font-orbitron font-bold text-white text-sm">{build.name}</div>
                        <div className="font-mono-code text-[0.65rem] text-[var(--text-muted)] mt-0.5 capitalize">
                          {build.status} · {build.droneType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-orbitron text-sm font-bold text-[var(--neon-orange)]">
                          ${build.totalCost || 0}
                        </div>
                        <div className="font-mono-code text-[0.6rem] text-[var(--text-muted)]">est. cost</div>
                      </div>
                      <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges & activity */}
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white mb-4">Recent Activity</h2>
            <div className="panel clip-card p-5">
              {(profile?.badges?.length || 0) === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-3">🏆</div>
                  <p className="text-[var(--text-muted)] text-sm">Complete lessons to earn badges!</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)]">
                      <span>{b.icon}</span>
                      <span className="font-mono-code text-[0.65rem] text-[var(--gold)]">{b.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick links */}
            <h2 className="font-orbitron text-lg font-bold text-white mb-4 mt-6">Quick Access</h2>
            <div className="flex flex-col gap-2">
              {[
                { to: '/courses', icon: '📚', label: 'Continue Learning' },
                { to: '/community', icon: '👥', label: 'Community' },
                { to: '/compare', icon: '⚖️', label: 'Compare Drones' },
              ].map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-4 panel border-[rgba(0,245,255,0.08)] hover:border-[rgba(0,245,255,0.25)] hover:bg-[rgba(0,245,255,0.04)] transition-all group"
                >
                  <span className="text-lg">{icon}</span>
                  <span className="font-rajdhani font-semibold text-[var(--text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors">{label}</span>
                  <ChevronRight size={14} className="ml-auto text-[var(--text-muted)] group-hover:text-[var(--neon-cyan)] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
