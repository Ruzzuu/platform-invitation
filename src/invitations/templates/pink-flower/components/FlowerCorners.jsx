import { motion } from 'framer-motion'

/**
 * FlowerCorners — renders the bunga.webp image in 4 corners,
 * mirrored via CSS transform so one asset covers all positions.
 *
 * Props:
 *   size      – Tailwind w-/h- class value (default "w-28 h-28")
 *   opacity   – Tailwind opacity class (default "opacity-80")
 *   className – extra classes on each img
 *   animated  – when true, flowers slide in from their respective corners (peek-a-boo)
 *   delay     – base delay in seconds before the first flower starts (default 0)
 */
export default function FlowerCorners({
  size = 'w-28 h-28',
  opacity = 'opacity-80',
  className = '',
  animated = false,
  delay = 0,
}) {
  const base = `absolute pointer-events-none z-20 ${size} ${opacity}`

  // sx/sy replace CSS flip classes — Framer Motion composes them with x/y natively.
  const corners = [
    { pos: 'top-0 left-0',     sx: 1,  sy: -1, ix: '-100%', iy: '-100%' },
    { pos: 'top-0 right-0',    sx: -1, sy: -1, ix:  '100%', iy: '-100%' },
    { pos: 'bottom-0 left-0',  sx: 1,  sy: 1,  ix: '-100%', iy:  '100%' },
    { pos: 'bottom-0 right-0', sx: -1, sy: 1,  ix:  '100%', iy:  '100%' },
  ]

  return (
    <>
      {corners.map(({ pos, sx, sy, ix, iy }, i) =>
        animated ? (
          <motion.img
            key={pos}
            src="/templates/pink-flower/bunga.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`${base} ${pos} ${className}`}
            style={{ scaleX: sx, scaleY: sy }}
            initial={{ x: ix, y: iy, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 16,
              delay: delay + i * 0.09,
            }}
          />
        ) : (
          <img
            key={pos}
            src="/templates/pink-flower/bunga.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`${base} ${pos} ${className}`}
            style={{ transform: `scaleX(${sx}) scaleY(${sy})` }}
          />
        )
      )}
    </>
  )
}
