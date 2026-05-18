// src/components/Footer.jsx
import { Link } from 'react-router-dom'

const LINKS = {
  Learn: [
    { to: '/courses', label: 'Courses' },
    { to: '/drones', label: 'Drone Types' },
    { to: '/components', label: 'Components' },
    { to: '/compare', label: 'Compare' },
  ],
  Build: [
    { to: '/build', label: 'Build Wizard' },
    { to: '/community', label: 'Community Builds' },
    { to: '/dashboard', label: 'My Dashboard' },
  ],
  Company: [
    { to: '#', label: 'About' },
    { to: '#', label: 'Blog' },
    { to: '#', label: 'Contact' },
    { to: '#', label: 'Privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="pt-16 pb-10 px-20 bg-[rgba(0,4,10,0.9)] border-t border-[rgba(0,245,255,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div>
          <div className="font-orbitron text-xl font-black text-[var(--neon-cyan)] text-glow-cyan mb-3">
            DRONE<span className="text-[var(--neon-orange)]">FORGE</span>
          </div>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-[280px]">
            The complete platform for drone builders — from first solder to autonomous flight. Build. Fly. Master.
          </p>
          <div className="flex gap-3 mt-5">
            {['⚡', '🌐', '📡'].map((icon, i) => (
              <button key={i} className="w-9 h-9 border border-[rgba(0,245,255,0.15)] flex items-center justify-center text-base hover:border-[rgba(0,245,255,0.4)] hover:bg-[rgba(0,245,255,0.05)] transition-all">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section}>
            <h4 className="font-orbitron text-xs font-bold text-[var(--text-primary)] tracking-widest uppercase mb-4">
              {section}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[var(--text-muted)] text-sm hover:text-[var(--neon-cyan)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-7 border-t border-[rgba(255,255,255,0.05)] gap-4">
        <p className="font-mono-code text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} DroneForge Academy. All rights reserved.
        </p>
        <p className="font-mono-code text-xs text-[var(--text-muted)]">
          Built with <span className="text-[var(--neon-orange)]">♥</span> using React · Firebase · Vercel
        </p>
      </div>
    </footer>
  )
}
