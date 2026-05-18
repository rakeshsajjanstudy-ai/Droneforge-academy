// backend/src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err)
  }

  // Firestore errors
  if (err.code?.startsWith?.('5') || err.code === 'permission-denied') {
    return res.status(403).json({ error: 'Access denied' })
  }

  // Validation errors
  if (err.type === 'validation') {
    return res.status(400).json({ error: message, details: err.details })
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

// backend/src/middleware/requestLogger.js
export function requestLogger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const color = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m'
    if (process.env.NODE_ENV !== 'test') {
      console.log(`${color}${req.method}\x1b[0m ${req.path} ${res.statusCode} ${duration}ms`)
    }
  })
  next()
}
