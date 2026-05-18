// backend/src/routes/community.js
import { Router } from 'express'
import { getFirestore } from '../config/firebase.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  next()
}

// GET /api/community/posts
router.get('/posts', optionalAuth, async (req, res, next) => {
  try {
    const db = getFirestore()
    const { category, limit: lim = 20 } = req.query

    let query = db.collection('community_posts').orderBy('createdAt', 'desc').limit(parseInt(lim))
    if (category && category !== 'All') {
      query = db.collection('community_posts').where('category', '==', category).orderBy('createdAt', 'desc').limit(parseInt(lim))
    }

    const snap = await query.get()
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json({ posts, total: posts.length })
  } catch (err) { next(err) }
})

// POST /api/community/posts
router.post('/posts', requireAuth,
  body('title').trim().isLength({ min: 5, max: 120 }),
  body('content').trim().isLength({ min: 10, max: 5000 }),
  body('category').isString().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const db = getFirestore()
      const { title, content, category } = req.body

      // Get author info from Firestore
      const userSnap = await db.collection('users').doc(req.uid).get()
      const userData = userSnap.data()

      const ref = await db.collection('community_posts').add({
        uid: req.uid,
        authorName: userData?.displayName || 'Pilot',
        authorPhoto: userData?.photoURL || null,
        title, content, category,
        likes: 0,
        likedBy: [],
        commentCount: 0,
        createdAt: new Date(),
      })
      res.status(201).json({ id: ref.id, message: 'Post created' })
    } catch (err) { next(err) }
  }
)

// POST /api/community/posts/:id/like
router.post('/posts/:id/like', requireAuth, async (req, res, next) => {
  try {
    const db = getFirestore()
    const ref = db.collection('community_posts').doc(req.params.id)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'Post not found' })

    const likedBy = snap.data().likedBy || []
    const alreadyLiked = likedBy.includes(req.uid)

    await ref.update({
      likes: snap.data().likes + (alreadyLiked ? -1 : 1),
      likedBy: alreadyLiked
        ? likedBy.filter(id => id !== req.uid)
        : [...likedBy, req.uid],
    })

    res.json({ liked: !alreadyLiked })
  } catch (err) { next(err) }
})

// GET /api/community/posts/:id/comments
router.get('/posts/:id/comments', async (req, res, next) => {
  try {
    const db = getFirestore()
    const snap = await db.collection('community_posts').doc(req.params.id)
      .collection('comments').orderBy('createdAt', 'asc').get()
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    res.json({ comments })
  } catch (err) { next(err) }
})

// POST /api/community/posts/:id/comments
router.post('/posts/:id/comments', requireAuth,
  body('text').trim().isLength({ min: 1, max: 1000 }),
  validate,
  async (req, res, next) => {
    try {
      const db = getFirestore()
      const postRef = db.collection('community_posts').doc(req.params.id)
      const snap = await postRef.get()
      if (!snap.exists) return res.status(404).json({ error: 'Post not found' })

      const userSnap = await db.collection('users').doc(req.uid).get()
      const userData = userSnap.data()

      const batch = db.batch()
      const commentRef = postRef.collection('comments').doc()
      batch.set(commentRef, {
        uid: req.uid,
        authorName: userData?.displayName || 'Pilot',
        text: req.body.text,
        createdAt: new Date(),
      })
      batch.update(postRef, { commentCount: (snap.data().commentCount || 0) + 1 })
      await batch.commit()

      res.status(201).json({ id: commentRef.id, message: 'Comment added' })
    } catch (err) { next(err) }
  }
)

export default router
