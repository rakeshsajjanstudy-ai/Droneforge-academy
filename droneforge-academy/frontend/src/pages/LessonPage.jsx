// src/pages/LessonPage.jsx
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useProgressStore } from '../lib/store'
import { progressService } from '../lib/firestore'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const LESSON_CONTENT = {
  '1': {
    title: 'Introduction to Drone Physics',
    duration: '15 min',
    content: `
# How Drones Fly

A multirotor drone achieves flight through **Newton's Third Law**: for every action there is an equal and opposite reaction. 
By spinning propellers, motors push air downward, and the reaction force pushes the drone upward.

## Thrust and Lift
Four motors working in concert create **lift** — the upward force that overcomes gravity. 
By varying each motor's speed independently, the flight controller creates:

- **Roll**: Tilting left/right by speeding up motors on one side
- **Pitch**: Moving forward/backward by tilting the drone  
- **Yaw**: Rotating left/right using motor torque differential
- **Throttle**: Moving up/down by changing all motor speeds together

## Motor Rotation Pairing
Opposite motors spin in the same direction. This cancels out the **gyroscopic torque** 
that would cause the drone to spin uncontrollably.

## The Flight Controller
The FC reads gyroscope and accelerometer data hundreds of times per second, 
making tiny adjustments to keep the drone stable despite wind, weight imbalance, and pilot inputs.
    `,
    quiz: [
      { q: 'What law explains how propellers generate lift?', a: "Newton's Third Law" },
      { q: 'Which component reads gyroscope data to stabilize the drone?', a: 'Flight Controller (FC)' },
    ],
  },
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const { user } = useAuth()
  const { markComplete, isComplete } = useProgressStore()
  const completed = isComplete(courseId, lessonId)

  const lesson = LESSON_CONTENT[lessonId] || {
    title: `Lesson ${lessonId}`,
    duration: '20 min',
    content: '# Coming Soon\n\nThis lesson content is being prepared.',
    quiz: [],
  }

  const handleComplete = async () => {
    markComplete(courseId, lessonId)
    if (user) {
      await progressService.markLessonComplete(user.uid, courseId, lessonId)
    }
    toast.success('+50 XP earned! 🎉')
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono-code text-xs text-[var(--text-muted)] mb-8">
          <Link to="/courses" className="hover:text-[var(--neon-cyan)] transition-colors">Courses</Link>
          <span>›</span>
          <span className="text-[var(--neon-cyan)] capitalize">{courseId?.replace(/-/g, ' ')}</span>
          <span>›</span>
          <span>Lesson {lessonId}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="font-mono-code text-[0.65rem] text-[var(--neon-orange)] tracking-widest uppercase mb-2">Lesson {lessonId}</div>
            <h1 className="font-orbitron text-2xl font-bold text-white">{lesson.title}</h1>
            <div className="font-mono-code text-xs text-[var(--text-muted)] mt-2">⏱ {lesson.duration}</div>
          </div>
          {completed && (
            <div className="flex items-center gap-2 font-mono-code text-xs text-[var(--neon-green)] border border-[rgba(0,255,136,0.3)] px-3 py-2">
              <CheckCircle size={14} /> Completed
            </div>
          )}
        </div>

        {/* Content */}
        <div className="panel clip-card p-8 mb-6 prose-custom">
          {lesson.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="font-orbitron text-2xl font-bold text-white mb-4">{line.slice(2)}</h1>
            if (line.startsWith('## ')) return <h2 key={i} className="font-orbitron text-xl font-bold text-[var(--neon-cyan)] mt-6 mb-3">{line.slice(3)}</h2>
            if (line.startsWith('- ')) return (
              <li key={i} className="text-[var(--text-muted)] pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--neon-cyan)] mb-2 list-none">
                {line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
              </li>
            )
            if (line.trim() === '') return <div key={i} className="h-3" />
            return <p key={i} className="text-[var(--text-muted)] leading-relaxed mb-3 text-sm" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
          })}
        </div>

        {/* Complete button */}
        {!completed ? (
          <button
            onClick={handleComplete}
            className="w-full py-4 bg-[var(--neon-cyan)] text-black font-orbitron text-sm font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all mb-6"
          >
            ✓ Mark as Complete (+50 XP)
          </button>
        ) : (
          <div className="w-full py-4 text-center bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.3)] font-orbitron text-sm text-[var(--neon-green)] tracking-widest uppercase mb-6">
            ✓ Lesson Complete
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Link
            to={`/courses/${courseId}/lessons/${Math.max(1, parseInt(lessonId) - 1)}`}
            className="flex items-center gap-2 px-5 py-2.5 border border-[rgba(0,245,255,0.2)] text-[var(--text-muted)] hover:text-[var(--neon-cyan)] hover:border-[rgba(0,245,255,0.4)] transition-all font-orbitron text-xs tracking-widest uppercase"
          >
            <ChevronLeft size={14} /> Previous
          </Link>
          <Link
            to={`/courses/${courseId}/lessons/${parseInt(lessonId) + 1}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--neon-cyan)] text-black font-orbitron text-xs font-bold tracking-widest uppercase clip-btn hover:shadow-glow-cyan transition-all"
          >
            Next <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
