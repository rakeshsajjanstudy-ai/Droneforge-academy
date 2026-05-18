// src/pages/AuthPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function AuthPage() {
  const { signInEmail, signUpEmail, signInGoogle, signInGithub } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signInEmail(form.email, form.password)
      } else {
        if (!form.name.trim()) return setError('Display name required')
        await signUpEmail(form.email, form.password, form.name)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    setLoading(true)
    try {
      if (provider === 'google') await signInGoogle()
      else await signInGithub()
      navigate('/dashboard')
    } catch { } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 relative">
      {/* Background grid effect */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="font-orbitron text-2xl font-black text-[var(--neon-cyan)] text-glow-cyan">
            DRONE<span className="text-[var(--neon-orange)]">FORGE</span>
          </Link>
          <h2 className="font-orbitron text-2xl font-bold mt-5 text-white">
            {mode === 'signin' ? 'Welcome Back, Pilot' : mode === 'signup' ? 'Join the Academy' : 'Reset Password'}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            {mode === 'signin' ? 'Sign in to continue your build' : mode === 'signup' ? 'Create your free account' : 'Enter your email to reset'}
          </p>
        </div>

        {/* Card */}
        <div className="panel clip-card p-8">
          {/* OAuth Buttons */}
          {mode !== 'reset' && (
            <>
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:text-white hover:border-[rgba(0,245,255,0.4)] hover:bg-[rgba(0,245,255,0.04)] transition-all font-rajdhani font-semibold tracking-wider"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleOAuth('github')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:text-white hover:border-[rgba(0,245,255,0.4)] hover:bg-[rgba(0,245,255,0.04)] transition-all font-rajdhani font-semibold tracking-wider"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[rgba(0,245,255,0.1)]" />
                <span className="font-mono-code text-xs text-[var(--text-muted)]">OR</span>
                <div className="flex-1 h-px bg-[rgba(0,245,255,0.1)]" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Display Name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white pl-10 pr-4 py-3 font-rajdhani text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)]"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white pl-10 pr-4 py-3 font-rajdhani text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)]"
                required
              />
            </div>

            {mode !== 'reset' && (
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white pl-10 pr-10 py-3 font-rajdhani text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)]"
                  required
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.3)] text-[var(--neon-orange)] text-sm font-rajdhani">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? '...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center flex flex-col gap-2">
            {mode === 'signin' ? (
              <>
                <button onClick={() => setMode('reset')} className="font-mono-code text-xs text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
                  Forgot password?
                </button>
                <p className="text-sm text-[var(--text-muted)]">
                  New pilot?{' '}
                  <button onClick={() => setMode('signup')} className="text-[var(--neon-cyan)] hover:text-glow-cyan font-semibold transition-colors">
                    Create account
                  </button>
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="text-[var(--neon-cyan)] hover:text-glow-cyan font-semibold transition-colors">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
