import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ── Phases ───────────────────────────────────────────────────
// 'flat'   : fade in VERTICAL/UPRIGHT — both rotate 0° (pointing straight up)
// 'appear' : spring-rotate to 25° inward tilt (the "lean" animation)
// 'cross'  : both slide to x:0 center, fully overlapping → merged gunungan
// 'exit'   : each flies back to its OWN side with 25° outward tilt
const PHASE_APPEAR_MS = 650   // flat → start rising upright
const PHASE_CROSS_MS  = 1900  // standing upright → slide to center
// compressed timings: go straight from cross → exit (no 'hold' pause)
const PHASE_EXIT_MS   = 2600  // cross → exit
const PHASE_DONE_MS   = 3800  // exit done → unmount

// Responsive — 4× larger than original (2× linear = 4× area)
// clamp ensures consistent visual size on every device
const W_SIZE = 'min(95vw, 108vh)'
// lateral starting gap scales with width so wayangs never overlap on small screens
const X_START = '35vw'   // left:-35vw  right:+35vw  (wider than half of 95vw so no overlap)
const X_EXIT  = '160vw'  // far enough off-screen at any size

export default function Opening({ onDone }) {
  const [phase, setPhase] = useState('flat')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('appear'), PHASE_APPEAR_MS)
    const t2 = setTimeout(() => setPhase('cross'),  PHASE_CROSS_MS)
    const t3 = setTimeout(() => setPhase('exit'),   PHASE_EXIT_MS)
    const t4 = setTimeout(() => onDone(),           PHASE_DONE_MS)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone])

  // LEFT wayang
  //   flat   → left of center, standing VERTICAL (rotate 0° — pointing straight up)
  //   appear → spring-tilt to +25° inward lean
  //   cross  → slide to x:0 center, keeping +25° tilt
  //   exit   → fly back LEFT, tip leans outward (-25°)
  const leftPos = {
    flat:   { x: `-${X_START}`,  rotate:   0, opacity: 1 },
    appear: { x: `-${X_START}`,  rotate:  25, opacity: 1 },
    cross:  { x: '0vw',          rotate:  25, opacity: 1 },
    hold:   { x: '0vw',          rotate:  25, opacity: 1 },
    exit:   { x: `-${X_EXIT}`,   rotate: -25, opacity: 0 },
  }

  // RIGHT wayang
  //   flat   → right of center, standing VERTICAL (rotate 0° — pointing straight up)
  //   appear → spring-tilt to -25° inward lean
  //   cross  → slide to x:0 center, keeping -25° tilt
  //   exit   → fly back RIGHT, tip leans outward (+25°)
  const rightPos = {
    flat:   { x: X_START,        rotate:   0, opacity: 1 },
    appear: { x: X_START,        rotate: -25, opacity: 1 },
    cross:  { x: '0vw',          rotate: -25, opacity: 1 },
    hold:   { x: '0vw',          rotate: -25, opacity: 1 },
    exit:   { x: X_EXIT,         rotate:  25, opacity: 0 },
  }

  const fadeInT  = { duration: 0.5, ease: 'easeOut' }
  // Rise spring: bouncy feel as wayangs stand up from horizontal
  const riseT    = { type: 'spring', stiffness: 55, damping: 10, mass: 0.9 }
  const crossT   = { type: 'spring', stiffness: 48, damping: 15 }
  const exitT    = { duration: 0.85, ease: [0.55, 0, 1, 0.45] }

  const trans = (p) => {
    if (p === 'flat')   return fadeInT
    if (p === 'appear') return riseT
    if (p === 'exit')   return exitT
    return crossT
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0904 0%, #141208 45%, #0a0904 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
    >
          {/* (hold glow removed) */}

      {/* Left Wayang (Kiri) — z-10 renders on top during overlap */}
      <motion.img
        src="/templates/javanese/wayangOpeningKiri.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute select-none pointer-events-none z-10"
        style={{
          width: W_SIZE,
          height: W_SIZE,
          objectFit: 'contain',
          transformOrigin: 'bottom center',
          filter: 'drop-shadow(0 0 22px rgba(212,175,55,0.5))',
        }}
        initial={{ x: `-${X_START}`, rotate: 0, opacity: 0 }}
        animate={leftPos[phase]}
        transition={trans(phase)}
      />

      {/* Right Wayang (Kanan) */}
      <motion.img
        src="/templates/javanese/wayangOpeningKanan.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute select-none pointer-events-none z-0"
        style={{
          width: W_SIZE,
          height: W_SIZE,
          objectFit: 'contain',
          transformOrigin: 'bottom center',
          filter: 'drop-shadow(0 0 22px rgba(212,175,55,0.5))',
        }}
        initial={{ x: X_START, rotate: 0, opacity: 0 }}
        animate={rightPos[phase]}
        transition={trans(phase)}
      />
    </motion.div>
  )
}

