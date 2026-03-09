import { useScroll, useVelocity, useSpring, useTransform } from 'framer-motion'
import ImageColumn from './ImageColumn'
import CenterCard from './CenterCard'

/*
 * 7 columns: 2 mobile, 4 tablet, 5 desktop, 7 wide desktop.
 * Images distributed across gambar1–14 with wrap-around.
 */
const COLUMNS = [
  { images: ['/gambar1.webp',  '/gambar8.webp',  '/gambar14.webp', '/gambar5.webp'],  direction: 'up',   speed: 10 },
  { images: ['/gambar2.webp',  '/gambar9.webp',  '/gambar6.webp',  '/gambar13.webp'], direction: 'down', speed: 12 },
  { images: ['/gambar3.webp',  '/gambar10.webp', '/gambar7.webp',  '/gambar4.webp'],  direction: 'up',   speed: 14 },
  { images: ['/gambar4.webp',  '/gambar11.webp', '/gambar1.webp',  '/gambar8.webp'],  direction: 'down', speed: 11 },
  { images: ['/gambar5.webp',  '/gambar12.webp', '/gambar2.webp',  '/gambar9.webp'],  direction: 'up',   speed: 11 },
  { images: ['/gambar6.webp',  '/gambar13.webp', '/gambar3.webp',  '/gambar10.webp'], direction: 'down', speed: 10 },
  { images: ['/gambar7.webp',  '/gambar14.webp', '/gambar4.webp',  '/gambar11.webp'], direction: 'up',   speed: 13 },
]

/*
 * Responsive visibility:
 *   mobile  (<640px)  → 2 columns
 *   tablet  (≥640px)  → 4 columns
 *   desktop (≥1024px) → 5 columns
 *   wide    (≥1280px) → 7 columns
 */
const COL_VISIBILITY = [
  '',                  // col 0 — always visible
  '',                  // col 1 — always visible
  'hidden sm:flex',    // col 2 — tablet+
  'hidden sm:flex',    // col 3 — tablet+
  'hidden lg:flex',    // col 4 — desktop+
  'hidden xl:flex',    // col 5 — wide desktop+
  'hidden xl:flex',    // col 6 — wide desktop+
]

export default function HeroGallery() {
  // Track window scroll velocity and map it to a speed multiplier
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 25, stiffness: 400 })
  // At rest = 1×, fast scroll = up to 8×
  const velocityFactor = useTransform(smoothVelocity, [-800, 0, 800], [8, 1, 8], { clamp: false })

  return (
    /* ── 300vh scroll wrapper so the hero stays visible longer ── */
    <div style={{ height: '300vh' }}>
      {/* ── Sticky container: stays pinned while user scrolls ── */}
      <section
        className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden bg-white"
      >
        {/* ── Animated columns with top/bottom edge fade ── */}
        <div
          className="absolute inset-0 flex items-center justify-between px-10"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
          }}
        >
          {COLUMNS.map((col, i) => (
            <div
              key={i}
              className={`${COL_VISIBILITY[i]} flex-col items-center`}
              style={{
                /* Stagger: even-indexed columns offset downward */
                paddingTop: i % 2 === 1 ? '60px' : '0px',
              }}
            >
              <ImageColumn
                images={col.images}
                direction={col.direction}
                speed={col.speed}
                velocityFactor={velocityFactor}
              />
            </div>
          ))}
        </div>

        {/* ── Center glassmorphism card ── */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto w-full flex justify-center px-4">
            <CenterCard />
          </div>
        </div>
      </section>
    </div>
  )
}
