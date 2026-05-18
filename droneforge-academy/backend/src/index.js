// backend/src/index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

import { initFirebase } from './config/firebase.js'
import courseRoutes from './routes/courses.js'
import userRoutes from './routes/users.js'
import buildRoutes from './routes/builds.js'
import communityRoutes from './routes/community.js'
import partsRoutes from './routes/parts.js'
import progressRoutes from './routes/progress.js'
import analyticsRoutes from './routes/analytics.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

// Initialize Firebase Admin
initFirebase()

const app = express()
const PORT = process.env.PORT || 5001

// ── Security & Utilities ──────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}))

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(requestLogger)

// ── Rate Limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts.' },
})

app.use('/api', limiter)

// ── Health Check ──────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DroneForge Academy API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'DroneForge Academy API',
    version: '1.0.0',
    docs: '/api/docs',
    endpoints: [
      'GET /api/courses',
      'GET /api/courses/:id',
      'GET /api/courses/:id/lessons',
      'GET /api/user/me',
      'PATCH /api/user/me',
      'GET /api/user/leaderboard',
      'GET/POST /api/builds',
      'GET/PATCH/DELETE /api/builds/:id',
      'GET/POST /api/community/posts',
      'POST /api/community/posts/:id/like',
      'GET /api/parts',
      'GET/POST /api/progress',
      'GET /api/analytics/summary',
    ],
  })
})

// ── Routes ────────────────────────────────────
app.use('/api/courses', courseRoutes)
app.use('/api/user', userRoutes)
app.use('/api/builds', buildRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/parts', partsRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/analytics', analyticsRoutes)

// ── 404 catch ────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

// ── Error Handler ─────────────────────────────
app.use(errorHandler)

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚁 DroneForge Academy API`)
  console.log(`   Running on: http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health: http://localhost:${PORT}/health\n`)
})

export default app
