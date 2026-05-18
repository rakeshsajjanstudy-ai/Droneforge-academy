// src/pages/BuildWizardPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { buildService } from '../lib/firestore'
import { useBuildStore } from '../lib/store'
import toast from 'react-hot-toast'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

const DRONE_TYPES = [
  { id: 'mini-quad', icon: '🚁', name: 'Mini Quadcopter', desc: 'Best for beginners. Simple, forgiving, affordable.', budget: '$80–$150', difficulty: 'Beginner' },
  { id: 'fpv-racer', icon: '⚡', name: 'FPV Racer', desc: 'Speed and adrenaline. First-person view racing.', budget: '$250–$600', difficulty: 'Intermediate' },
  { id: 'freestyle', icon: '🌀', name: 'Freestyle', desc: 'Acrobatics and creative flying. Expressive builds.', budget: '$200–$450', difficulty: 'Intermediate' },
  { id: 'cinema', icon: '🎬', name: 'Cinema Drone', desc: 'Professional aerial photography & video.', budget: '$1,500–$4,000', difficulty: 'Advanced' },
  { id: 'mapping', icon: '🗺️', name: 'Mapping Drone', desc: 'Surveying, agriculture, and precision mapping.', budget: '$2,000–$8,000', difficulty: 'Advanced' },
  { id: 'micro-fpv', icon: '🔬', name: 'Micro FPV Whoop', desc: 'Tiny indoor FPV. Learn FPV skills at home.', budget: '$25–$80', difficulty: 'Beginner' },
]

const BUDGETS = [
  { id: 'budget', label: 'Budget', range: 'Under $200', icon: '💰' },
  { id: 'mid', label: 'Mid-Range', range: '$200–$800', icon: '⚡' },
  { id: 'pro', label: 'Professional', range: '$800–$2,000', icon: '🏆' },
  { id: 'elite', label: 'Elite', range: '$2,000+', icon: '💎' },
]

const GOALS = [
  { id: 'learn', label: 'Learn to Fly', icon: '🎓' },
  { id: 'racing', label: 'Race Competitively', icon: '🏁' },
  { id: 'photography', label: 'Aerial Photography', icon: '📸' },
  { id: 'freestyle', label: 'Freestyle Tricks', icon: '🌀' },
  { id: 'tech', label: 'Tech & DIY', icon: '🔧' },
  { id: 'commercial', label: 'Commercial/Survey', icon: '🗺️' },
]

const STEPS = ['Goal', 'Drone Type', 'Budget', 'Name & Save']

export default function BuildWizardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(null)
  const [droneType, setDroneType] = useState(null)
  const [budget, setBudget] = useState(null)
  const [buildName, setBuildName] = useState('')
  const [saving, setSaving] = useState(false)

  const canNext = [!!goal, !!droneType, !!budget, buildName.trim().length > 2]
  const progress = ((step) / (STEPS.length - 1)) * 100

  const handleSave = async () => {
    if (!user) { navigate('/auth'); return }
    setSaving(true)
    try {
      const id = await buildService.createBuild(user.uid, {
        name: buildName || `My ${droneType?.name || 'Drone'} Build`,
        droneType: droneType?.id,
        goal: goal?.id,
        budget: budget?.id,
      })
      toast.success('Build created! 🚁')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to save build')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">Build Wizard</div>
          <h1 className="font-orbitron text-4xl font-black text-white">Configure Your <span className="text-[var(--neon-cyan)]">Build</span></h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-[rgba(0,245,255,0.1)] z-0" />
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-8 h-8 flex items-center justify-center font-orbitron text-xs font-bold border transition-all duration-300 ${
                  i < step ? 'bg-[var(--neon-cyan)] border-[var(--neon-cyan)] text-black' :
                  i === step ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-glow-cyan' :
                  'border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] bg-[var(--dark-bg)]'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`font-mono-code text-[0.62rem] tracking-widest uppercase ${i === step ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-muted)]'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="panel clip-card p-8 mb-6">
          {step === 0 && (
            <div>
              <h2 className="font-orbitron text-xl font-bold text-white mb-2">What's Your Goal?</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">Choose your primary flying goal to get personalized recommendations.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {GOALS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g)}
                    className={`p-5 border flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                      goal?.id === g.id
                        ? 'border-[var(--neon-cyan)] bg-[rgba(0,245,255,0.08)] shadow-glow-cyan'
                        : 'border-[rgba(0,245,255,0.1)] hover:border-[rgba(0,245,255,0.3)]'
                    }`}
                  >
                    <span className="text-3xl">{g.icon}</span>
                    <span className="font-rajdhani font-semibold text-sm text-white">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-orbitron text-xl font-bold text-white mb-2">Choose Your Drone Type</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">Based on your goal, here are recommended drone categories.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DRONE_TYPES.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDroneType(d)}
                    className={`p-5 border text-left flex gap-4 items-start transition-all duration-200 hover:-translate-y-0.5 ${
                      droneType?.id === d.id
                        ? 'border-[var(--neon-cyan)] bg-[rgba(0,245,255,0.08)] shadow-glow-cyan'
                        : 'border-[rgba(0,245,255,0.1)] hover:border-[rgba(0,245,255,0.3)]'
                    }`}
                  >
                    <span className="text-3xl">{d.icon}</span>
                    <div>
                      <div className="font-orbitron text-sm font-bold text-white mb-1">{d.name}</div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2">{d.desc}</p>
                      <div className="flex gap-3">
                        <span className="font-mono-code text-[0.6rem] text-[var(--neon-orange)]">{d.budget}</span>
                        <span className="font-mono-code text-[0.6rem] text-[var(--neon-green)]">{d.difficulty}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-orbitron text-xl font-bold text-white mb-2">Set Your Budget</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">We'll tailor component recommendations to your budget range.</p>
              <div className="grid grid-cols-2 gap-4">
                {BUDGETS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b)}
                    className={`p-6 border flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                      budget?.id === b.id
                        ? 'border-[var(--neon-cyan)] bg-[rgba(0,245,255,0.08)] shadow-glow-cyan'
                        : 'border-[rgba(0,245,255,0.1)] hover:border-[rgba(0,245,255,0.3)]'
                    }`}
                  >
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <div className="font-orbitron text-sm font-bold text-white">{b.label}</div>
                      <div className="font-mono-code text-xs text-[var(--neon-cyan)] mt-1">{b.range}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-orbitron text-xl font-bold text-white mb-2">Name Your Build</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">Give your build a name so you can track it in your dashboard.</p>

              {/* Summary */}
              <div className="flex flex-col gap-3 mb-6 p-5 bg-[rgba(0,245,255,0.04)] border border-[rgba(0,245,255,0.12)]">
                <div className="font-mono-code text-[0.65rem] text-[var(--neon-orange)] tracking-widest uppercase mb-1">Build Summary</div>
                {[
                  { label: 'Goal', value: goal?.label },
                  { label: 'Type', value: droneType?.name },
                  { label: 'Budget', value: budget?.range },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">{label}</span>
                    <span className="text-[var(--neon-cyan)] font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              <input
                type="text"
                placeholder={`My ${droneType?.name || 'Drone'} Build`}
                value={buildName}
                onChange={e => setBuildName(e.target.value)}
                className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white px-5 py-4 font-orbitron text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)] placeholder:font-rajdhani"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[rgba(0,245,255,0.4)] transition-all disabled:opacity-30 disabled:pointer-events-none font-orbitron text-sm tracking-widest uppercase"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext[step]}
              className="flex items-center gap-2 px-8 py-3 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canNext[step] || saving}
              className="flex items-center gap-2 px-8 py-3 bg-[var(--neon-orange)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-orange transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              {saving ? 'Saving...' : '⚡ Save Build'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
