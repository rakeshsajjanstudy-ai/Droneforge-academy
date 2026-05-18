// backend/src/routes/courses.js
import { Router } from 'express'
import { getFirestore } from '../config/firebase.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

// Seeded course data (also stored in Firestore)
const COURSES_SEED = [
  {
    id: 'drone-101',
    title: 'Drone Fundamentals',
    description: 'Physics, regulations, safety, and your first flight.',
    icon: '🎓',
    level: 'beginner',
    duration: '3h 20m',
    lessonCount: 12,
    order: 1,
    tags: ['basics', 'safety', 'regulations'],
    color: 'var(--neon-green)',
    published: true,
  },
  {
    id: 'electronics',
    title: 'Electronics & Wiring',
    description: 'Motors, ESCs, batteries, and soldering basics.',
    icon: '⚡',
    level: 'beginner',
    duration: '2h 45m',
    lessonCount: 10,
    order: 2,
    tags: ['electronics', 'soldering', 'wiring'],
    color: 'var(--neon-cyan)',
    published: true,
  },
  {
    id: 'betaflight',
    title: 'Betaflight Mastery',
    description: 'Configure, tune PIDs, and optimize your flight controller.',
    icon: '🎮',
    level: 'intermediate',
    duration: '4h 10m',
    lessonCount: 15,
    order: 3,
    tags: ['betaflight', 'pid', 'configuration'],
    color: 'var(--neon-orange)',
    published: true,
  },
  {
    id: 'fpv-flying',
    title: 'FPV Flying Techniques',
    description: 'Master first-person view flying from hover to freestyle.',
    icon: '🕹️',
    level: 'intermediate',
    duration: '5h 30m',
    lessonCount: 20,
    order: 4,
    tags: ['fpv', 'flying', 'freestyle'],
    color: 'var(--neon-purple)',
    published: true,
  },
  {
    id: 'photography',
    title: 'Aerial Photography',
    description: 'Camera settings, compositions, and cinematic techniques.',
    icon: '🎬',
    level: 'intermediate',
    duration: '3h 50m',
    lessonCount: 14,
    order: 5,
    tags: ['photography', 'cinema', 'camera'],
    color: 'var(--gold)',
    published: true,
  },
  {
    id: 'autonomous',
    title: 'Autonomous Flight',
    description: 'GPS waypoints, ArduPilot, and automated missions.',
    icon: '🤖',
    level: 'advanced',
    duration: '5h 00m',
    lessonCount: 18,
    order: 6,
    tags: ['autonomous', 'ardupilot', 'gps'],
    color: '#ff2244',
    published: true,
  },
]

// GET /api/courses
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { level, tag } = req.query

    let courses = COURSES_SEED.filter(c => c.published)

    if (level) courses = courses.filter(c => c.level === level)
    if (tag) courses = courses.filter(c => c.tags?.includes(tag))

    res.json({
      courses,
      total: courses.length,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/courses/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const course = COURSES_SEED.find(c => c.id === req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json(course)
  } catch (err) {
    next(err)
  }
})

// GET /api/courses/:id/lessons
router.get('/:id/lessons', optionalAuth, async (req, res, next) => {
  try {
    const course = COURSES_SEED.find(c => c.id === req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })

    // Generate lesson list based on course
    const lessons = Array.from({ length: course.lessonCount }, (_, i) => ({
      id: String(i + 1),
      courseId: course.id,
      order: i + 1,
      title: getLessonTitle(course.id, i + 1),
      duration: `${10 + Math.floor(Math.random() * 20)} min`,
      type: i % 5 === 4 ? 'quiz' : 'video',
      free: i < 2, // first 2 lessons free
    }))

    res.json({ lessons, courseId: course.id })
  } catch (err) {
    next(err)
  }
})

function getLessonTitle(courseId, num) {
  const map = {
    'drone-101': [
      'Introduction to Drone Physics',
      'Parts of a Drone Explained',
      'Drone Regulations & Legal Flying',
      'Safety Checklist & Pre-flight Routine',
      'Your First Hover',
      'Basic Flight Maneuvers',
      'Understanding Wind & Weather',
      'Emergency Procedures',
      'Batteries: Care & Safety',
      'Post-flight Inspection',
      'Flying Indoors vs Outdoors',
      'Final Assessment',
    ],
    'electronics': [
      'Intro to Electronics for Drones',
      'Understanding Voltage & Amperage',
      'Brushless Motors Deep Dive',
      'ESC Selection & Setup',
      'LiPo Batteries: All You Need to Know',
      'Soldering Fundamentals',
      'Power Distribution Boards',
      'Flight Controller Overview',
      'Wiring Your First Build',
      'Electronics Safety & Troubleshooting',
    ],
  }
  return map[courseId]?.[num - 1] || `Lesson ${num}`
}

export default router
