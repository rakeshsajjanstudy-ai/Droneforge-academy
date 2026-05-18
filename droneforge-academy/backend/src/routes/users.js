// backend/src/routes/users.js
import { Router } from 'express'
import { getFirestore } from '../config/firebase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/user/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const db = getFirestore()
    const snap = await db.collection('users').doc(req.uid).get()
    if (!snap.exists) return res.status(404).json({ error: 'User not found' })
    res.json({ id: snap.id, ...snap.data() })
  } catch (err) { next(err) }
})

// PATCH /api/user/me
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const db = getFirestore()
    const allowed = ['displayName', 'bio', 'settings', 'photoURL']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    updates.updatedAt = new Date()
    await db.collection('users').doc(req.uid).update(updates)
    res.json({ success: true, updated: updates })
  } catch (err) { next(err) }
})

// GET /api/user/leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const db = getFirestore()
    const snap = await db.collection('users')
      .orderBy('xp', 'desc')
      .limit(20)
      .get()
    const users = snap.docs.map((d, i) => ({
      rank: i + 1,
      uid: d.id,
      displayName: d.data().displayName,
      photoURL: d.data().photoURL,
      xp: d.data().xp || 0,
      badges: d.data().badges?.length || 0,
    }))
    res.json({ leaderboard: users })
  } catch (err) { next(err) }
})

export default router
