// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="font-orbitron text-8xl font-black text-[rgba(0,245,255,0.08)] mb-4">404</div>
      <div className="text-5xl mb-6">🚁</div>
      <h1 className="font-orbitron text-3xl font-bold text-white mb-3">Signal Lost</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10 max-w-md">
        This drone went off the map. The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="px-8 py-3.5 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all"
      >
        ← Return to Base
      </Link>
    </div>
  )
}
