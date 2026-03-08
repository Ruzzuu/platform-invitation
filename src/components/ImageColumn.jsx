import { useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'

const IMAGE_H = 96
const GAP = 110
// Every image occupies exactly IMAGE_H + GAP px (marginBottom applies to all,
// including the last), so loopHeight = images.length × SLOT is a whole number
// with zero rounding error — no seam jump on loop.
const SLOT = IMAGE_H + GAP

export default function ImageColumn({ images, direction = 'up', speed = 30, velocityFactor }) {
  const doubled = [...images, ...images]
  const y = useMotionValue(0)
  const progressRef = useRef(0)
  const loopHeight = images.length * SLOT

  useAnimationFrame((_, delta) => {
    const factor = velocityFactor
      ? Math.min(Math.max(velocityFactor.get(), 1), 25)
      : 1
    const pxPerSec = (loopHeight / speed) * factor

    progressRef.current = (progressRef.current + (delta / 1000) * pxPerSec) % loopHeight

    y.set(direction === 'up' ? -progressRef.current : progressRef.current - loopHeight)
  })

  return (
    <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
      <motion.div className="flex flex-col items-center" style={{ y }}>
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            style={{
              width: '71px',
              height: `${IMAGE_H}px`,
              objectFit: 'cover',
              borderRadius: '18px',
              flexShrink: 0,
              marginBottom: `${GAP}px`,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
