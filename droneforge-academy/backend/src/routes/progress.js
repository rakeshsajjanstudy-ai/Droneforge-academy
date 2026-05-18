// backend/src/routes/progress.js
import { Router } from 'express'
import { getFirestore } from '../config/firebase.js'
import { requireAuth } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = Router()
router.use(requireAuth)

const XP_REWARDS = {
  lesson: 50,
  quiz: 100,
  course: 500,
}

// GET /api/progress
router.get('/', async (req, res, next) => {
  try {
    const db = getFirestore()
    const snap = await db.collection('progress')
      .where('uid', '==', req.uid)
      .get()
    const progress = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json({ progress })
  } catch (err) { next(err) }
})

// POST /api/progress/complete — mark lesson complete & award XP
router.post('/complete',
  body('courseId').isString().notEmpty(),
  body('lessonId').isString().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid body' })

      const db = getFirestore()
      const { courseId, lessonId, type = 'lesson' } = req.body

      const progressId = `${req.uid}_${courseId}`
      const progressRef = db.collection('progress').doc(progressId)
      const snap = await progressRef.get()

      const current = snap.exists ? snap.data() : { completedLessons: [], xpEarned: 0 }
      const alreadyDone = current.completedLessons?.includes(lessonId)

      if (!alreadyDone) {
        // Update progress
        await progressRef.set({
          uid: req.uid,
          courseId,
          completedLessons: [...(current.completedLessons || []), lessonId],
          xpEarned: (current.xpEarned || 0) + (XP_REWARDS[type] || 50),
          lastUpdated: new Date(),
        }, { merge: true })

        // Award XP to user
        const userRef = db.collection('users').doc(req.uid)
        const userSnap = await userRef.get()
        if (userSnap.exists) {
          await userRef.update({
            xp: (userSnap.data().xp || 0) + (XP_REWARDS[type] || 50),
          })
        }

        res.json({ success: true, xpEarned: XP_REWARDS[type] || 50, alreadyCompleted: false })
      } else {
        res.json({ success: true, xpEarned: 0, alreadyCompleted: true })
      }
    } catch (err) { next(err) }
  }
)

export default router
