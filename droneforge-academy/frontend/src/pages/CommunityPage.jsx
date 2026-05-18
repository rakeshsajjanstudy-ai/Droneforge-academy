// src/pages/CommunityPage.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { communityService } from '../lib/firestore'
import { Heart, MessageCircle, Plus, X, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Build Showcase', 'Help & Advice', 'Mods & Upgrades', 'Flight Footage', 'For Sale']

const SAMPLE_POSTS = [
  { id: '1', uid: 'user1', authorName: 'NeonPilot_X', authorPhoto: null, category: 'Build Showcase', title: 'My First 5" FPV Racer Build 🚀', content: 'Finally completed my first build after 3 months of learning. Used Nazgul5 V3 frame, F7 FC, 2306 motors. First flight was incredible!', likes: 42, likedBy: [], commentCount: 8, createdAt: { seconds: Date.now() / 1000 - 3600 } },
  { id: '2', uid: 'user2', authorName: 'DroneEngineer99', authorPhoto: null, category: 'Help & Advice', title: 'ESC Calibration Failing — Any Tips?', content: 'Been trying to calibrate my 4-in-1 ESC but BLHeli keeps throwing errors. Running 45A ESCs with 2306 2400kv motors. Anyone had similar issues?', likes: 15, likedBy: [], commentCount: 12, createdAt: { seconds: Date.now() / 1000 - 7200 } },
  { id: '3', uid: 'user3', authorName: 'CinePilotMaria', authorPhoto: null, category: 'Flight Footage', title: 'Sunrise Mountain Cinewhoop Run ☀️', content: 'Took my DJI O3-equipped 3" cinewhoop out at dawn. The light was incredible. Shot in D-Cinelike and graded in Resolve. Sharing the raw + edit.', likes: 87, likedBy: [], commentCount: 24, createdAt: { seconds: Date.now() / 1000 - 86400 } },
  { id: '4', uid: 'user4', authorName: 'TechTinkerer', authorPhoto: null, category: 'Mods & Upgrades', title: 'Custom 3D Printed TPU Antenna Mounts', content: 'Designed and printed my own antenna mounts for better signal diversity. Sharing the STL files — works with most 5" frames. Links in comments.', likes: 56, likedBy: [], commentCount: 18, createdAt: { seconds: Date.now() / 1000 - 172800 } },
]

function timeAgo(seconds) {
  const diff = Math.floor(Date.now() / 1000 - seconds)
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function PostCard({ post, currentUid, onLike }) {
  const liked = post.likedBy?.includes(currentUid)
  return (
    <div className="panel clip-card p-6 flex flex-col gap-4 hover:border-[rgba(0,245,255,0.25)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.2)] flex items-center justify-center font-orbitron text-sm font-bold text-[var(--neon-cyan)]">
            {post.authorName?.[0]?.toUpperCase() || 'P'}
          </div>
          <div>
            <div className="font-rajdhani font-semibold text-white text-sm">{post.authorName}</div>
            <div className="font-mono-code text-[0.6rem] text-[var(--text-muted)]">{timeAgo(post.createdAt?.seconds || Date.now() / 1000)}</div>
          </div>
        </div>
        <span className="font-mono-code text-[0.6rem] px-2 py-1 border border-[rgba(0,245,255,0.15)] text-[var(--neon-cyan)] whitespace-nowrap">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-orbitron text-base font-bold text-white mb-2">{post.title}</h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 pt-2 border-t border-[rgba(0,245,255,0.06)]">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 text-sm transition-all ${liked ? 'text-[#ff6b8a]' : 'text-[var(--text-muted)] hover:text-[#ff6b8a]'}`}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          <span className="font-mono-code text-xs">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
          <MessageCircle size={15} />
          <span className="font-mono-code text-xs">{post.commentCount}</span>
        </button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [category, setCategory] = useState('All')
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [showCreate, setShowCreate] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Build Showcase' })
  const [submitting, setSubmitting] = useState(false)

  const filtered = category === 'All' ? posts : posts.filter(p => p.category === category)

  const handleLike = async (postId) => {
    if (!user) { toast.error('Sign in to like posts'); return }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const liked = p.likedBy?.includes(user.uid)
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked ? p.likedBy.filter(id => id !== user.uid) : [...(p.likedBy || []), user.uid],
      }
    }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Sign in to post'); return }
    if (!newPost.title.trim() || !newPost.content.trim()) return
    setSubmitting(true)
    try {
      const post = {
        id: Date.now().toString(),
        uid: user.uid,
        authorName: user.displayName || 'Pilot',
        authorPhoto: user.photoURL,
        ...newPost,
        likes: 0,
        likedBy: [],
        commentCount: 0,
        createdAt: { seconds: Date.now() / 1000 },
      }
      setPosts(prev => [post, ...prev])
      setShowCreate(false)
      setNewPost({ title: '', content: '', category: 'Build Showcase' })
      toast.success('Post shared! 🚁')
      // Also save to Firestore
      await communityService.createPost(user.uid, { ...newPost, authorName: user.displayName, authorPhoto: user.photoURL })
    } catch {
      toast.error('Failed to post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono-code text-[0.7rem] text-[var(--neon-orange)] tracking-[4px] uppercase mb-3">Community</div>
            <h1 className="font-orbitron text-4xl font-black text-white">Pilot Hub</h1>
            <p className="text-[var(--text-muted)] mt-2">Share builds, ask questions, and connect with fellow pilots.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--neon-cyan)] text-black font-orbitron text-xs font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all"
          >
            <Plus size={16} /> New Post
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 font-mono-code text-xs tracking-widest uppercase transition-all ${
                category === c
                  ? 'bg-[var(--neon-cyan)] text-black'
                  : 'border border-[rgba(0,245,255,0.15)] text-[var(--text-muted)] hover:border-[rgba(0,245,255,0.4)] hover:text-[var(--neon-cyan)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-5">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} currentUid={user?.uid} onLike={handleLike} />
          ))}
          {filtered.length === 0 && (
            <div className="panel p-16 text-center">
              <div className="text-4xl mb-4">📡</div>
              <div className="font-orbitron text-lg font-bold text-white mb-2">No posts yet</div>
              <p className="text-[var(--text-muted)] text-sm">Be the first to post in this category!</p>
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <div className="panel clip-card w-full max-w-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-xl font-bold text-white">New Post</h2>
                <button onClick={() => setShowCreate(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <select
                  value={newPost.category}
                  onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white px-4 py-3 font-rajdhani text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white px-4 py-3 font-rajdhani text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)]"
                  required
                />
                <textarea
                  placeholder="Share your build, question, or story..."
                  value={newPost.content}
                  onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                  rows={5}
                  className="w-full bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] text-white px-4 py-3 font-rajdhani text-base focus:outline-none focus:border-[var(--neon-cyan)] transition-colors placeholder:text-[var(--text-muted)] resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : <span className="flex items-center justify-center gap-2"><Send size={14} /> Share Post</span>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
