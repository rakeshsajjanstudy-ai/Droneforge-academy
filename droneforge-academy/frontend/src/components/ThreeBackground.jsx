// src/components/ThreeBackground.jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.z = 400

    let mouseX = 0, mouseY = 0
    let targetX = 0, targetY = 0

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    })

    // ── Particle field ──
    const particleCount = 1800
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const colorOptions = [
      new THREE.Color(0x00f5ff),
      new THREE.Color(0xff6b00),
      new THREE.Color(0xbf00ff),
      new THREE.Color(0xffffff),
      new THREE.Color(0x00ff88),
    ]

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600
      const col = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      const b = 0.3 + Math.random() * 0.7
      colors[i * 3] = col.r * b
      colors[i * 3 + 1] = col.g * b
      colors[i * 3 + 2] = col.b * b
      sizes[i] = Math.random() * 2.5 + 0.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({
      size: 1.8, vertexColors: true, transparent: true, opacity: 0.7,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // ── Grid ──
    const grid = new THREE.GridHelper(2000, 40, 0x003344, 0x001122)
    grid.position.y = -250
    grid.material.opacity = 0.3
    grid.material.transparent = true
    scene.add(grid)

    // ── Torus rings ──
    const torus1 = new THREE.Mesh(
      new THREE.TorusGeometry(120, 1.5, 4, 60),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.06 })
    )
    torus1.position.set(300, 50, -200)
    scene.add(torus1)

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(80, 1, 4, 40),
      new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.05 })
    )
    torus2.position.set(-350, -80, -150)
    scene.add(torus2)

    // ── Drone silhouettes ──
    function createDrone(x, y, z, scale, color) {
      const group = new THREE.Group()
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25 })
      for (let i = 0; i < 4; i++) {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, scale * 6, 4), mat)
        arm.rotation.z = Math.PI / 2
        arm.rotation.y = (i * Math.PI / 2) + Math.PI / 4
        arm.position.set(
          Math.cos((i * Math.PI / 2) + Math.PI / 4) * scale * 1.5, 0,
          Math.sin((i * Math.PI / 2) + Math.PI / 4) * scale * 1.5
        )
        group.add(arm)
      }
      for (let i = 0; i < 4; i++) {
        const mot = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.5, 8, 8), mat)
        mot.position.set(
          Math.cos((i * Math.PI / 2) + Math.PI / 4) * scale * 4, 0,
          Math.sin((i * Math.PI / 2) + Math.PI / 4) * scale * 4
        )
        group.add(mot)
      }
      group.add(new THREE.Mesh(new THREE.BoxGeometry(scale * 1.2, scale * 0.4, scale * 1.2), mat))
      group.position.set(x, y, z)
      group.scale.setScalar(scale / 5)
      return group
    }

    const d1 = createDrone(-200, 80, -100, 14, 0x00f5ff)
    const d2 = createDrone(280, -50, -180, 10, 0xff6b00)
    const d3 = createDrone(50, -150, -50, 8, 0xbf00ff)
    scene.add(d1, d2, d3)

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ──
    const clock = new THREE.Clock()
    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      targetX += (mouseX - targetX) * 0.04
      targetY += (mouseY - targetY) * 0.04
      camera.position.x = targetX * 50
      camera.position.y = -targetY * 30
      camera.lookAt(0, 0, 0)
      particles.rotation.y = t * 0.025
      particles.rotation.x = t * 0.010
      grid.rotation.y = t * 0.01
      torus1.rotation.x = t * 0.3
      torus1.rotation.y = t * 0.2
      torus2.rotation.z = t * 0.25
      torus2.rotation.x = t * 0.15
      d1.position.y = 80 + Math.sin(t * 0.6) * 15
      d1.rotation.y = t * 0.4
      d2.position.y = -50 + Math.sin(t * 0.5 + 1) * 12
      d2.rotation.y = -t * 0.3
      d3.position.y = -150 + Math.sin(t * 0.7 + 2) * 10
      d3.rotation.y = t * 0.5
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      />
      <div
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at 20% 50%, rgba(0,50,80,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(60,0,100,0.2) 0%, transparent 50%)',
          zIndex: 1, pointerEvents: 'none',
        }}
      />
    </>
  )
}
