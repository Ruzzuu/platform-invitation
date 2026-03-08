import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import TemplateCard from '../components/TemplateCard'
import HeroGallery from '../components/HeroGallery'
import { useTemplates } from '../hooks/useTemplates'

const GALLERY = [
  { src: '/gambar4.webp', alt: 'Wedding flowers' },
  { src: '/gambar5.webp', alt: 'Wedding couple' },
  { src: '/gambar6.webp', alt: 'Wedding rings' },
  { src: '/gambar7.webp', alt: 'Bouquet' },
  { src: '/gambar8.webp', alt: 'Table setting' },
  { src: '/gambar9.webp', alt: 'Wedding dress' },
  { src: '/gambar10.webp', alt: 'Wedding ceremony' },
  { src: '/gambar11.webp', alt: 'Wedding shoes' },
  { src: '/gambar12.webp', alt: 'Wedding cake' },
  { src: '/gambar13.webp', alt: 'Wedding toast' },
  { src: '/gambar14.webp', alt: 'Wedding detail' },
]

const FEATURES = [
  {
    icon: 'palette',
    title: 'Fully Customizable',
    desc: 'Edit colors, fonts, and text directly in your browser. No design skills needed.',
  },
  {
    icon: 'bolt',
    title: 'Instant Download',
    desc: 'Get your templates immediately after purchase. Start customizing right away.',
  },
  {
    icon: 'print',
    title: 'Print Ready',
    desc: 'Download high-resolution PDFs with bleed marks, ready for professional printing.',
  },
  {
    icon: 'phone_iphone',
    title: 'Digital & Print',
    desc: 'Every template works for both digital sharing and physical printing.',
  },
]

export default function LandingPage() {
  const { data: featuredTemplates, loading: templatesLoading } = useTemplates({ featuredOnly: true, limit: 3 })

  return (
    <>
      {/* ───── Hero ───── */}
      <HeroGallery />

      {/* ───── Template Collections ───── */}
      <section id="templates" className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Template Collections</h2>
            <div className="w-12 h-1 rounded-full bg-pink-500 mx-auto mb-4" />
            <p className="text-warm-gray max-w-xl mx-auto">
              Browse our curated collections of elegant wedding invitation suites,
              designed to match every style.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templatesLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            : featuredTemplates.map((t, i) => (
                <FadeIn key={t.id} delay={i * 0.1}>
                  <TemplateCard
                    id={t.slug}
                    image={t.images?.[0] ?? '/gambar1.webp'}
                    title={t.name}
                    subtitle={t.subtitle}
                    price={t.price_display}
                    badge={t.badge}
                  />
                </FadeIn>
              ))
          }
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center mt-12">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-pink-400 text-pink-500 font-semibold hover:bg-pink-500 hover:text-white transition text-sm"
            >
              View All Templates
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="bg-cream-dark/40">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Why Choose Eterna?</h2>
              <p className="text-warm-gray max-w-xl mx-auto">
                Everything you need to create stunning wedding stationery, without the hassle.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="bg-cream rounded-2xl p-6 text-center h-full">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-gold">{f.icon}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Gallery ───── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Wedding Inspiration</h2>
            <p className="text-warm-gray max-w-xl mx-auto">
              Beautiful moments captured to inspire your perfect celebration.
            </p>
          </div>
        </FadeIn>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {GALLERY.map((img, i) => (
            <FadeIn key={i} delay={(i % 4) * 0.08}>
              <div className="break-inside-avoid rounded-xl overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <FadeIn>
            <p className="font-script text-2xl text-pink-400 mb-4">Ready to begin?</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Create Your Dream Invitation
            </h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Join thousands of happy couples who chose Eterna for their special day.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              Browse Templates
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
