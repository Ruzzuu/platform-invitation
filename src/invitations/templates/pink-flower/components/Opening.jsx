import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Timing constants (ms) — tweak to adjust pacing ──────────
// Phase 1 – appear + 4 fast rotations  : 0 → 1500 ms
// Phase 2 – stop, hold full opacity    : 1500 → 3000 ms  (1.5 s)
// Phase 3 – 4 fast rotations + shrink  : 3000 → 4000 ms  (1 s)
// Phase 4 – fully gone → panels burst  : 4000 ms onward
const PHASE_HOLD_MS   = 1500  // bloom finishes  → stop & breathe
const PHASE_SHRINK_MS = 3000  // hold ends       → spin-out starts
const PHASE_EXIT_MS   = 4100  // spin-out done   → 4 panels fly apart
const PHASE_DONE_MS   = 5100  // panels finish   → Cover revealed

// Single responsive size that fits any mobile/desktop screen
const FLOWER_SIZE = 'min(84vw, 84vh)'

// Each quadrant: its CSS position within the 2×2 grid container
// and the background-position that shows only that quarter of the image
const QUADRANTS = [
  { id: 'tl', top: '0%',  left: '0%',  bgPos: '0% 0%',     xExit: '-62vw', yExit: '-62vh' },
  { id: 'tr', top: '0%',  left: '50%', bgPos: '100% 0%',   xExit:  '62vw', yExit: '-62vh' },
  { id: 'bl', top: '50%', left: '0%',  bgPos: '0% 100%',   xExit: '-62vw', yExit:  '62vh' },
  { id: 'br', top: '50%', left: '50%', bgPos: '100% 100%', xExit:  '62vw', yExit:  '62vh' },
]

export default function Opening({ onDone }) {
  const [phase, setPhase] = useState('enter') // 'enter' | 'hold' | 'shrink' | 'exit'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'),   PHASE_HOLD_MS)
    const t2 = setTimeout(() => setPhase('shrink'), PHASE_SHRINK_MS)
    const t3 = setTimeout(() => setPhase('exit'),   PHASE_EXIT_MS)
    const t4 = setTimeout(() => onDone(),           PHASE_DONE_MS)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #FFF8F0 0%, #F3D0E0 45%, #FFF8F0 100%)',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
    >

      {/* ── Phase ENTER / HOLD / SHRINK: looping bloom flower ── */}
      <AnimatePresence>
        {phase !== 'exit' && (
          <motion.img
            key="bloom"
            src="/templates/pink-flower/bunga opening.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute select-none pointer-events-none"
            style={{ width: FLOWER_SIZE, height: FLOWER_SIZE, objectFit: 'contain' }}

            // Phase 1 start: tiny, invisible
            initial={{ scale: 0.08, rotate: 0, opacity: 0 }}

            animate={
              phase === 'enter'
                // Phase 1 — fade in + 4 fast rotations (1440°) + grow to full size
                ? { scale: 1, rotate: 1440, opacity: 1 }
                : phase === 'hold'
                  // Phase 2 — stop, gentle breathing, no extra rotation
                  ? {
                      scale:   [1, 1.04, 1, 1.04, 1],
                      rotate:  1440,
                      opacity: 1,
                    }
                  // Phase 3 (shrink) — 4 more fast rotations + shrink + fade out
                  : { scale: 0.08, rotate: 2880, opacity: 0 }
            }

            // Instant removal so panels appear without a gap
            exit={{ opacity: 0, transition: { duration: 0.05 } }}

            transition={
              phase === 'enter'
                ? { duration: 1.5, ease: [0.2, 0, 0.6, 1] }
                : phase === 'hold'
                  ? { duration: 1.5, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }
                  : { duration: 1.0, ease: [0.4, 0, 1, 1] }
            }
          />
        )}
      </AnimatePresence>

      {/* Panels removed — opening now uses single flower animation only. */}

    </motion.div>
  )
}
