import FadeIn from '../components/FadeIn'
import FAQItem from '../components/FAQItem'

const FAQ_DATA = [
  {
    question: 'What file formats do I receive?',
    answer:
      "When you purchase a template, you'll receive a link to edit your design directly in your web browser using our intuitive editing platform. Once you're finished customizing, you can download your final files as high-resolution PDF, JPEG, or PNG formats. We recommend PDF for printing.",
  },
  {
    question: 'Where do you recommend printing?',
    answer:
      'You have several options! You can print at home if you have a high-quality inkjet printer. For professional results, we highly recommend local print shops or online professional printers like Prints of Love, VistaPrint, or Moo. We provide options to download with "bleed" and "trim marks" which most professional printers require.',
  },
  {
    question: 'Can I change the colors and fonts?',
    answer:
      'Yes, absolutely! Our editor allows you to fully customize text, change font styles, adjust colors, and even upload your own photos. Most graphic elements (like flowers or borders) can also be moved or resized, though their colors might be fixed depending on the specific design.',
  },
  {
    question: 'What is your refund policy?',
    answer:
      'Due to the digital nature of our products, all sales are final once the template link has been accessed. However, we want you to be completely happy with your purchase. We offer a "try before you buy" demo link on every product page. If you encounter technical issues, please contact our support team and we will assist you promptly.',
  },
]

const STATS = [
  { value: '10K+', label: 'Happy Couples' },
  { value: '200+', label: 'Templates' },
  { value: '4.9', label: 'Average Rating' },
  { value: '24/7', label: 'Support' },
]

export default function AboutFaqPage() {
  return (
    <>
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/gambar13.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark/60" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-28 md:py-36 text-center text-cream">
          <FadeIn>
            <p className="font-script text-3xl text-pink-400 mb-3">About Us</p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
          </FadeIn>
        </div>
      </section>

      {/* ───── About ───── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <FadeIn>
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Crafting Beautiful Beginnings</h2>
              <div className="space-y-4 text-warm-gray leading-relaxed">
                <p>
                  We believe that beautiful wedding stationery shouldn&apos;t be complicated or
                  prohibitively expensive. Founded in 2020 by a team of passionate designers,
                  Eterna was created to bridge the gap between bespoke design and accessible
                  DIY templates.
                </p>
                <p>
                  Our mission is to empower couples to create stunning, personalized
                  invitations that perfectly capture the essence of their special day, right
                  from the comfort of their own homes.
                </p>
                <p>
                  Every template is hand-crafted by our design team, ensuring each piece
                  reflects current wedding trends while maintaining a timeless quality that
                  will be treasured for years to come.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/gambar14.webp"
                alt="Designer arranging wedding stationery"
                className="w-full h-auto object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <section className="bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-pink-400 mb-1">{s.value}</p>
                  <p className="text-sm text-white/60">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-warm-gray">Everything you need to know about our templates.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div>
            {FAQ_DATA.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-12 text-center">
            <p className="text-warm-gray mb-4">Masih ada pertanyaan?</p>
            <a
              href="https://wa.me/6281515263851?text=Halo%20Eterna!%20Saya%20butuh%20bantuan%20mengenai%20template%20undangan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition text-sm"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Hubungi via WhatsApp
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  )
}
