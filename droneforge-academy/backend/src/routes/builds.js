// backend/src/routes/builds.js
import { Router } from 'express'
import { getFirestore } from '../config/firebase.js'
import { requireAuth } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = Router()
router.use(requireAuth)

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

// GET /api/builds — get all user's builds
router.get('/', async (req, res, next) => {
  try {
    const db = getFirestore()
    const snap = await db.collection('builds')
      .where('uid', '==', req.uid)
      .orderBy('createdAt', 'desc')
      .get()
    const builds = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json({ builds, total: builds.length })
  } catch (err) { next(err) }
})

// POST /api/builds — create build
router.post('/',
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 chars'),
  body('droneType').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const db = getFirestore()
      const { name, droneType, goal, budget } = req.body
      const ref = await db.collection('builds').add({
        uid: req.uid,
        name,
        droneType,
        goal: goal || null,
        budget: budget || null,
        status: 'planning',
        components: [],
        completedSteps: [],
        totalCost: 0,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      res.status(201).json({ id: ref.id, message: 'Build created' })
    } catch (err) { next(err) }
  }
)

// GET /api/builds/:id
router.get('/:id', async (req, res, next) => {
  try {
    const db = getFirestore()
    const snap = await db.collection('builds').doc(req.params.id).get()
    if (!snap.exists) return res.status(404).json({ error: 'Build not found' })
    const build = { id: snap.id, ...snap.data() }
    if (build.uid !== req.uid) return res.status(403).json({ error: 'Access denied' })
    res.json(build)
  } catch (err) { next(err) }
})

// PATCH /api/builds/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const db = getFirestore()
    const ref = db.collection('builds').doc(req.params.id)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'Build not found' })
    if (snap.data().uid !== req.uid) return res.status(403).json({ error: 'Access denied' })

    const allowed = ['name', 'status', 'notes', 'totalCost', 'completedSteps']
    const updates = { updatedAt: new Date() }
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    await ref.update(updates)
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /api/builds/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getFirestore()
    const ref = db.collection('builds').doc(req.params.id)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'Build not found' })
    if (snap.data().uid !== req.uid) return res.status(403).json({ error: 'Access denied' })
    await ref.delete()
    res.json({ success: true, message: 'Build deleted' })
  } catch (err) { next(err) }
})

// POST /api/builds/:id/components — add component
router.post('/:id/components',
  body('name').trim().notEmpty(),
  body('category').trim().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const db = getFirestore()
      const ref = db.collection('builds').doc(req.params.id)
      const snap = await ref.get()
      if (!snap.exists) return res.status(404).json({ error: 'Build not found' })
      if (snap.data().uid !== req.uid) return res.status(403).json({ error: 'Access denied' })

      const component = {
        id: Date.now().toString(),
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand || '',
        price: req.body.price || 0,
        link: req.body.link || '',
        addedAt: new Date().toISOString(),
      }

      const currentComponents = snap.data().components || []
      const currentCost = snap.data().totalCost || 0

      await ref.update({
        components: [...currentComponents, component],
        totalCost: currentCost + (component.price || 0),
        updatedAt: new Date(),
      })

      res.status(201).json({ component, message: 'Component added' })
    } catch (err) { next(err) }
  }
)

export default router
