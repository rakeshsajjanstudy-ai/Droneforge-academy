// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    // Custom cursor
    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    let ringX = 0, ringY = 0
    let mouseX = 0, mouseY = 0

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const onDown = () => cursor.classList.add('clicking')
    const onUp = () => cursor.classList.remove('clicking')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    // Ring follows with lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.14
      ringY += (mouseY - ringY) * 0.14
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      requestAnimationFrame(animateRing)
    }
    animateRing()

    // Scroll progress
    const progress = progressRef.current
    const onScroll = () => {
      if (!progress) return
      const scrolled = document.documentElement.scrollTop
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight
      progress.style.width = `${(scrolled / total) * 100}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    revealEls.forEach(el => observer.observe(el))

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      window.removeEventListener('scroll', onScroll)
      revealEls.forEach(el => observer.unobserve(el))
    }
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Reading progress bar */}
      <div id="reading-progress" ref={progressRef} style={{ width: '0%' }} />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
