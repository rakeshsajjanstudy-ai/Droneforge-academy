// src/pages/ProfilePage.jsx
import { useAuth } from '../lib/AuthContext'
import { useState } from 'react'
import { userService } from '../lib/firestore'
import toast from 'react-hot-toast'
import { Edit2, Save, X } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ displayName: profile?.displayName || '', bio: profile?.bio || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await userService.updateProfile(user.uid, form)
      await refreshProfile()
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  if (!profile) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="font-mono-code text-[var(--text-muted)]">Loading profile...</div>
    </div>
  )

  const xpColors = ['var(--neon-green)', 'var(--neon-cyan)', 'var(--neon-orange)', 'var(--neon-purple)', 'var(--gold)']
  const levelIdx = Math.min(Math.floor((profile.xp || 0) / 1000), 4)

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-8">Pilot Profile</div>

        <div className="panel clip-card p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 flex items-center justify-center border border-[rgba(0,245,255,0.3)] font-orbitron text-2xl font-black bg-[rgba(0,245,255,0.08)]" style={{ color: xpColors[levelIdx] }}>
                {profile.displayName?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                {editing ? (
                  <input
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                    className="bg-transparent border-b border-[var(--neon-cyan)] text-white font-orbitron text-xl font-bold focus:outline-none mb-1"
                  />
                ) : (
                  <div className="font-orbitron text-xl font-bold text-white mb-1">{profile.displayName}</div>
                )}
                <div className="font-mono-code text-xs text-[var(--text-muted)]">{profile.email}</div>
                <div className="font-mono-code text-xs mt-1" style={{ color: xpColors[levelIdx] }}>{profile.xp || 0} XP</div>
              </div>
            </div>
            <button
              onClick={() => editing ? setEditing(false) : setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[rgba(0,245,255,0.4)] transition-all font-mono-code text-xs"
            >
              {editing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit</>}
            </button>
          </div>

          <div className="mb-6">
            <div className="font-mono-code text-[0.65rem] text-[var(--text-muted)] tracking-widest uppercase mb-2">Bio</div>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Tell the community about yourself..."
                className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white px-4 py-3 font-rajdhani text-sm focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)] resize-none"
              />
            ) : (
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {profile.bio || 'No bio yet. Add one to introduce yourself to the community!'}
              </p>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--neon-cyan)] text-black font-orbitron text-xs font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all disabled:opacity-50"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="panel clip-card p-6">
          <div className="font-orbitron text-base font-bold text-white mb-4">Badges</div>
          {(profile.badges?.length || 0) === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">No badges yet. Complete courses to earn them!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {profile.badges.map((b, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)]">
                  <span>{b.icon}</span>
                  <span className="font-mono-code text-xs text-[var(--gold)]">{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
