// backend/src/middleware/auth.js
import admin from 'firebase-admin'

/**
 * Verifies Firebase ID token from Authorization header.
 * Attaches decoded token and uid to req.user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.split('Bearer ')[1]
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    req.uid = decoded.uid
    next()
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired. Please sign in again.' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

/**
 * Optional auth: attaches user if token present, continues without.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return next()
  const token = authHeader.split('Bearer ')[1]
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    req.uid = decoded.uid
  } catch { /* ignore */ }
  next()
}

/**
 * Require admin claim on Firebase token.
 */
export async function requireAdmin(req, res, next) {
  if (!req.user?.admin) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
