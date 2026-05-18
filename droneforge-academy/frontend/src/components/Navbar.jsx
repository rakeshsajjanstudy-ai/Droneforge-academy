// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Menu, X, User, LogOut, Zap, LayoutDashboard } from 'lucide-react'

const NAV_LINKS = [
  { to: '/drones', label: 'Drones' },
  { to: '/courses', label: 'Courses' },
  { to: '/components', label: 'Components' },
  { to: '/compare', label: 'Compare' },
  { to: '/community', label: 'Community' },
]

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-12 py-[18px] transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(2,4,8,0.92)' : 'rgba(2,4,8,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(0,245,255,0.12)' : '1px solid rgba(0,245,255,0.04)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="font-orbitron text-xl font-black tracking-wider text-[var(--neon-cyan)] text-glow-cyan">
        DRONE<span className="text-[var(--neon-orange)]">FORGE</span>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 list-none">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `font-rajdhani font-semibold text-sm tracking-widest uppercase transition-all duration-200 ${
                  isActive ? 'text-[var(--neon-cyan)] text-glow-cyan' : 'text-[var(--text-muted)] hover:text-[var(--neon-cyan)]'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right: Auth */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/build"
              className="flex items-center gap-2 px-5 py-2 font-orbitron text-[0.72rem] font-bold tracking-widest uppercase text-black bg-[var(--neon-cyan)] clip-btn transition-all hover:shadow-glow-cyan hover:-translate-y-0.5"
            >
              <Zap size={14} /> Build
            </Link>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[rgba(0,245,255,0.4)] transition-all duration-200"
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <User size={16} />
                )}
                <span className="font-mono-code text-xs">{profile?.displayName?.split(' ')[0] || 'Pilot'}</span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 panel border border-[rgba(0,245,255,0.15)] py-2 z-50"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:bg-[rgba(0,245,255,0.05)] transition-colors" onClick={() => setProfileOpen(false)}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:bg-[rgba(0,245,255,0.05)] transition-colors" onClick={() => setProfileOpen(false)}>
                    <User size={15} /> Profile
                  </Link>
                  <div className="my-1 border-t border-[rgba(0,245,255,0.08)]" />
                  <button
                    onClick={() => { logout(); setProfileOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--neon-orange)] hover:bg-[rgba(255,107,0,0.05)] transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="font-rajdhani font-semibold text-sm tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/build"
              className="px-5 py-2 border border-[var(--neon-orange)] text-[var(--neon-orange)] font-orbitron text-[0.72rem] font-bold tracking-widest uppercase clip-btn hover:bg-[var(--neon-orange)] hover:text-black hover:shadow-glow-orange transition-all duration-250"
            >
              Start Building
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-[var(--neon-cyan)] p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 panel border-b border-[rgba(0,245,255,0.1)] py-6 px-6 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="font-rajdhani font-semibold text-base tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-[rgba(0,245,255,0.08)] pt-4">
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false) }} className="text-[var(--neon-orange)] font-rajdhani font-semibold">
                Sign Out
              </button>
            ) : (
              <Link to="/auth" className="text-[var(--neon-cyan)] font-rajdhani font-semibold" onClick={() => setMobileOpen(false)}>
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
