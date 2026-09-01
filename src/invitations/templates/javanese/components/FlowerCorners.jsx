import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// FlowerCorners — picture-frame border
//
//   ┌[corner atas kiri]────────────────[corner atas kanan]┐
//   │                                                     │
//   │  ║ ← CSS gold line (gap from measured corner H)  ║  │
//   │                                                     │
//   └[corner bawah kiri]──────────────[corner bawah kanan]┘
//
// Side lines are pure CSS. Their top/bottom offset is computed at runtime
// from the actual rendered height of the corner images (measured via
// onLoad + ResizeObserver), so they always stop cleanly before the corners
// regardless of image aspect ratio or viewport size.
// ─────────────────────────────────────────────────────────────────────────────

// Corner width — fluid from 80px (phone) to 160px (desktop)
const CS = 'clamp(5rem, 16vw, 10rem)'

// Fixed gap (px) between corner bottom edge and where the line starts
const SIDE_GAP_PX = 8

// Side line thickness
const LINE_W = '2px'

// Gold color for the lines
const GOLD = '#d4af37'

export default function FlowerCorners({
  opacityValue = 0.9,
  className = '',
  animated = false,
  delay = 0,
}) {
  // ── Measure actual rendered corner heights ───────────────────────────────
  // Top and bottom corner images may have different aspect ratios / heights,
  // so we measure one from each group and use them independently:
  //   topH  → drives the `top` offset (where the line starts)
  //   botH  → drives the `bottom` offset (where the line ends)
  const topCornerRef = useRef(null)
  const botCornerRef = useRef(null)
  const [topH, setTopH] = useState(null)
  const [botH, setBotH] = useState(null)

  const measureTop = useCallback(() => {
    if (topCornerRef.current) {
      const h = topCornerRef.current.getBoundingClientRect().height
      if (h > 0) setTopH(h)
    }
  }, [])

  const measureBot = useCallback(() => {
    if (botCornerRef.current) {
      const h = botCornerRef.current.getBoundingClientRect().height
      if (h > 0) setBotH(h)
    }
  }, [])

  // Re-measure when viewport resizes (corner width is viewport-responsive)
  useEffect(() => {
    const nodes = [topCornerRef.current, botCornerRef.current].filter(Boolean)
    if (!nodes.length) return
    const ro = new ResizeObserver(() => { measureTop(); measureBot() })
    nodes.forEach(n => ro.observe(n))
    return () => ro.disconnect()
  }, [measureTop, measureBot])

  // ── Corners: single copy, natural aspect ratio ───────────────────────────
  const corners = [
    {
      key: 'tl', src: '/templates/javanese/corner atas kiri.webp', ref: topCornerRef, onMeasure: measureTop,
      style: { top: 0, left: 0, width: CS, height: 'auto' },
      initial: { x: '-60%', y: '-60%', opacity: 0 },
    },
    {
      key: 'bl', src: '/templates/javanese/corner bawah kiri.webp', ref: botCornerRef, onMeasure: measureBot,
      style: { bottom: 0, left: 0, width: CS, height: 'auto' },
      initial: { x: '-60%', y: '60%', opacity: 0 },
    },
    {
      key: 'tr', src: '/templates/javanese/corner atas kanan.webp', ref: null, onMeasure: null,
      style: { top: 0, right: 0, width: CS, height: 'auto' },
      initial: { x: '60%', y: '-60%', opacity: 0 },
    },
    {
      key: 'br', src: '/templates/javanese/corner bawah kanan.webp', ref: null, onMeasure: null,
      style: { bottom: 0, right: 0, width: CS, height: 'auto' },
      initial: { x: '60%', y: '60%', opacity: 0 },
    },
  ]

  // ── Side lines: pure CSS, offset by measured corner heights ──────────────
  // Lines stay invisible until both measurements are ready to prevent any
  // flash at the wrong position.
  const linesReady = topH != null && botH != null
  const topOffset = topH != null ? `${topH + SIDE_GAP_PX}px` : '50%'
  const botOffset = botH != null ? `${botH + SIDE_GAP_PX}px` : '50%'

  const sideLineStyle = {
    width: LINE_W,
    top: topOffset,
    bottom: botOffset,
    backgroundColor: GOLD,
  }

  const sides = [
    { key: 'left-line', style: { ...sideLineStyle, left: `calc(${LINE_W} * 2)` } },
    { key: 'right-line', style: { ...sideLineStyle, right: `calc(${LINE_W} * 2)` } },
  ]

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* ── Side lines z-[1] ── pure CSS, stretches between corners ──────── */}
      {sides.map(({ key, style }) =>
        animated ? (
          <motion.div
            key={key}
            className="absolute z-[1]"
            style={{ ...style, opacity: 0 }}
            animate={{ opacity: linesReady ? opacityValue : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: delay + 0.35 }}
          />
        ) : (
          <div
            key={key}
            className="absolute z-[1]"
            style={{ ...style, opacity: linesReady ? opacityValue : 0 }}
          />
        )
      )}

      {/* ── Corners z-[2] ── on top of line ends ─────────────────────────── */}
      {corners.map(({ key, src, style, initial, ref, onMeasure }, i) =>
        animated ? (
          <motion.img
            key={key}
            ref={ref}
            src={src}
            alt=""
            draggable={false}
            className="absolute z-[2]"
            style={{ ...style, opacity: 0, display: 'block' }}
            initial={{ ...initial }}
            animate={{ x: 0, y: 0, opacity: opacityValue }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 14,
              delay: delay + i * 0.08,
            }}
            onLoad={onMeasure ?? undefined}
          />
        ) : (
          <img
            key={key}
            ref={ref}
            src={src}
            alt=""
            draggable={false}
            className="absolute z-[2]"
            style={{ ...style, opacity: opacityValue, display: 'block' }}
            onLoad={onMeasure ?? undefined}
          />
        )
      )}
    </div>
  )
}
