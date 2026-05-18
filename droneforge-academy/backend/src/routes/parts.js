// backend/src/routes/parts.js
import { Router } from 'express'

const router = Router()

const PARTS_DB = [
  // Flight Controllers
  { id: 'fc-speedybee-f405', category: 'flight-controller', name: 'SpeedyBee F405 V4', brand: 'SpeedyBee', price: 45, level: 'beginner', buildTypes: ['freestyle', 'racing', 'mini-quad'], specs: { cpu: 'STM32F405', gyro: 'ICM42688-P', uarts: 6, betaflight: true }, inStock: true },
  { id: 'fc-matek-f722', category: 'flight-controller', name: 'Matek F722-SE', brand: 'Matek', price: 62, level: 'intermediate', buildTypes: ['freestyle', 'long-range'], specs: { cpu: 'STM32F722', gyro: 'ICM42688', uarts: 6, inav: true }, inStock: true },
  { id: 'fc-kakute-h7', category: 'flight-controller', name: 'Holybro Kakute H7', brand: 'Holybro', price: 79, level: 'advanced', buildTypes: ['cinema', 'freestyle'], specs: { cpu: 'STM32H743', gyro: 'ICM42688-P dual', uarts: 8 }, inStock: true },
  // ESCs
  { id: 'esc-blheli-45a', category: 'esc', name: 'SpeedyBee BLS 45A', brand: 'SpeedyBee', price: 38, level: 'beginner', buildTypes: ['freestyle', 'racing', 'mini-quad'], specs: { amperage: 45, protocol: 'DSHOT600', firmware: 'BLHeli_32' }, inStock: true },
  { id: 'esc-dys-35a', category: 'esc', name: 'DYS 35A 4-in-1', brand: 'DYS', price: 28, level: 'beginner', buildTypes: ['mini-quad', 'freestyle'], specs: { amperage: 35, protocol: 'DSHOT300' }, inStock: true },
  // Motors
  { id: 'motor-xing2306', category: 'motor', name: 'iFlight XING 2306 2450KV', brand: 'iFlight', price: 18, level: 'intermediate', buildTypes: ['freestyle', 'racing'], specs: { statorSize: '2306', kv: 2450, voltage: '4S', thrust: '1100g' }, inStock: true },
  { id: 'motor-t-motor-2306', category: 'motor', name: 'T-Motor F40 Pro IV 2306 1950KV', brand: 'T-Motor', price: 28, level: 'advanced', buildTypes: ['cinema', 'freestyle'], specs: { statorSize: '2306', kv: 1950, voltage: '6S' }, inStock: true },
  { id: 'motor-emax-2306', category: 'motor', name: 'EMAX Eco II 2306 1900KV', brand: 'EMAX', price: 14, level: 'beginner', buildTypes: ['freestyle', 'mini-quad'], specs: { statorSize: '2306', kv: 1900, voltage: '4-6S' }, inStock: true },
  // Batteries
  { id: 'batt-4s-1300', category: 'battery', name: 'Tattu 4S 1300mAh 95C', brand: 'Tattu', price: 22, level: 'beginner', buildTypes: ['freestyle', 'racing'], specs: { cells: 4, capacity: 1300, cRating: 95, weight: '122g' }, inStock: true },
  { id: 'batt-6s-1100', category: 'battery', name: 'CNHL 6S 1100mAh 120C', brand: 'CNHL', price: 26, level: 'intermediate', buildTypes: ['freestyle', 'cinema'], specs: { cells: 6, capacity: 1100, cRating: 120 }, inStock: true },
  // Frames
  { id: 'frame-nazgul5', category: 'frame', name: 'iFlight Nazgul5 V3', brand: 'iFlight', price: 35, level: 'beginner', buildTypes: ['freestyle', 'racing'], specs: { size: '5"', material: 'Carbon Fiber 3K', weight: '95g', armThickness: '4mm' }, inStock: true },
  { id: 'frame-squirt', category: 'frame', name: 'TBS Source One 5"', brand: 'TBS', price: 28, level: 'intermediate', buildTypes: ['freestyle'], specs: { size: '5"', material: '6K Carbon', weight: '75g' }, inStock: true },
  // VTX/Cameras
  { id: 'vtx-dji-o3', category: 'vtx', name: 'DJI O3 Air Unit', brand: 'DJI', price: 199, level: 'intermediate', buildTypes: ['cinema', 'freestyle'], specs: { type: 'digital', resolution: '4K', latency: '35ms', range: '10km' }, inStock: true },
  { id: 'vtx-analog-200mw', category: 'vtx', name: 'TBS Unify Pro32 Nano', brand: 'TBS', price: 35, level: 'beginner', buildTypes: ['freestyle', 'racing', 'mini-quad'], specs: { type: 'analog', power: '25–200mW' }, inStock: true },
]

// GET /api/parts
router.get('/', (req, res) => {
  const { query = '', category, buildType, maxPrice } = req.query

  let results = [...PARTS_DB]

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }
  if (category) results = results.filter(p => p.category === category)
  if (buildType) results = results.filter(p => p.buildTypes?.includes(buildType))
  if (maxPrice) results = results.filter(p => p.price <= parseInt(maxPrice))

  res.json({ parts: results, total: results.length })
})

// GET /api/parts/compatible
router.get('/compatible', (req, res) => {
  const { buildType } = req.query
  const compatible = PARTS_DB.filter(p =>
    !buildType || p.buildTypes?.includes(buildType)
  )

  // Group by category
  const grouped = compatible.reduce((acc, part) => {
    if (!acc[part.category]) acc[part.category] = []
    acc[part.category].push(part)
    return acc
  }, {})

  res.json({ grouped, total: compatible.length })
})

// GET /api/parts/:id
router.get('/:id', (req, res) => {
  const part = PARTS_DB.find(p => p.id === req.params.id)
  if (!part) return res.status(404).json({ error: 'Part not found' })
  res.json(part)
})

export default router
