import { useParams, Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import FadeIn from '../components/FadeIn'
import { useTemplate } from '../hooks/useTemplates'

const WA_NUMBER = '6281515263851'

const HOW_IT_WORKS = [
  { icon: 'search', step: '1', title: 'Pilih Template', desc: 'Browse koleksi kami dan lihat preview langsung. Temukan yang cocok dengan tema pernikahan Anda.' },
  { icon: 'chat', step: '2', title: 'Pesan via WhatsApp', desc: 'Isi form singkat dan kirim. Kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi.' },
  { icon: 'celebration', step: '3', title: 'Terima Undangan', desc: 'Kami buatkan undangan digital Anda dan kirimkan link yang siap dibagikan ke tamu.' },
]

function StarRating({ rating }) {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating)) return <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        if (i < rating) return <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
        return <span key={i} className="material-symbols-outlined text-lg">star</span>
      })}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/5] rounded-2xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function TemplateDetails() {
  const { id } = useParams()
  const { data: product, loading, error } = useTemplate(id)
  const [selectedImg, setSelectedImg] = useState(0)
  const [showFormats, setShowFormats] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const previewRef = useRef(null)

  const [form, setForm] = useState({ nama: '', whatsapp: '', catatan: '' })
  const [formError, setFormError] = useState('')

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError('')
  }

  function handleOrder(e) {
    e.preventDefault()
    if (!form.nama.trim()) { setFormError('Nama wajib diisi'); return }
    if (!form.whatsapp.trim()) { setFormError('Nomor WhatsApp wajib diisi'); return }

    const msg = [
      'Halo Eterna! 👋',
      'Saya ingin memesan template undangan:',
      '',
      `📋 Template: ${product.name}`,
      `💰 Harga: ${product.price_display}`,
      '',
      `👤 Nama: ${form.nama}`,
      `📱 WA: ${form.whatsapp}`,
      `📝 Catatan: ${form.catatan || '-'}`,
      '',
      'Mohon informasi selanjutnya. Terima kasih! 🙏',
    ].join('\n')

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function scrollToPreview() {
    setShowPreview(true)
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  if (loading) return <LoadingSkeleton />

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-warm-gray mb-4">Template tidak ditemukan.</p>
        <Link to="/catalog" className="text-pink-500 hover:underline">← Kembali ke Catalog</Link>
      </div>
    )
  }

  const images = product.images ?? ['/gambar1.webp']
  const previewUrl = product.renderer_key ? `/preview/${product.renderer_key}` : product.demo_url

  return (
    <>
      {/* ───── Breadcrumb ───── */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="text-sm text-warm-gray flex items-center gap-2">
          <Link to="/" className="hover:text-pink-500 transition">Home</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-pink-500 transition">Templates</Link>
          <span>/</span>
          <span className="text-dark">{product.name}</span>
        </nav>
      </div>

      {/* ───── Product ───── */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <FadeIn>
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-pink-50 aspect-[9/16]">
                <img
                  src={images[selectedImg]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-4 py-1.5 text-xs font-semibold rounded-full bg-pink-500 text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="mt-4 flex max-w-full gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-16 h-24 rounded-xl overflow-hidden border-2 transition bg-pink-50 ${
                      selectedImg === i ? 'border-pink-400' : 'border-transparent hover:border-cream-dark'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Details */}
          <FadeIn delay={0.15}>
            <div className="flex flex-col">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={product.rating ?? 5} />
                <span className="text-sm text-warm-gray">({product.review_count ?? 0} Ulasan)</span>
              </div>

              <p className="text-2xl font-bold text-pink-500 mb-2">{product.price_display}</p>
              <p className="text-sm text-warm-gray mb-6">{product.subtitle}</p>
              <p className="text-warm-gray leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              {product.features?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.features.map(f => (
                    <span key={f} className="px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-medium">{f}</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {previewUrl ? (
                  <button
                    onClick={scrollToPreview}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-pink-400 text-pink-500 font-semibold hover:bg-pink-50 transition text-sm"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    Lihat Preview
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-gray-200 text-gray-400 text-sm cursor-default">
                    <span className="material-symbols-outlined text-base">visibility_off</span>
                    Preview segera hadir
                  </div>
                )}
              </div>

              {/* Order Form */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500">chat</span>
                  Pesan via WhatsApp
                </h3>
                <form onSubmit={handleOrder} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="nama"
                      value={form.nama}
                      onChange={handleFormChange}
                      placeholder="Contoh: Ahmad & Siti"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleFormChange}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">Catatan Tambahan</label>
                    <textarea
                      name="catatan"
                      value={form.catatan}
                      onChange={handleFormChange}
                      rows={2}
                      placeholder="Contoh: tanggal pernikahan, nama pasangan, dll"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-white resize-none"
                    />
                  </div>
                  {formError && <p className="text-red-500 text-xs">{formError}</p>}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Pesan Sekarang via WhatsApp
                  </button>
                </form>
              </div>

              {/* What's included */}
              {product.formats?.length > 0 && (
                <div className="border-t border-cream-dark/40 mt-6">
                  <button
                    onClick={() => setShowFormats(!showFormats)}
                    className="w-full flex items-center justify-between py-4"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-pink-500">inventory_2</span>
                      Apa yang Didapat
                    </span>
                    <span
                      className="material-symbols-outlined text-warm-gray transition-transform"
                      style={{ transform: showFormats ? 'rotate(180deg)' : 'rotate(0)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {showFormats && (
                    <ul className="pb-4 pl-8 space-y-1.5 text-sm text-warm-gray list-disc">
                      {product.formats.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───── Live Preview ───── */}
      {previewUrl && (
        <section ref={previewRef} className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">Preview Template</h2>
              <p className="text-warm-gray text-center mb-10">Lihat tampilan asli undangan digital ini</p>
            </FadeIn>

            <div className="flex flex-col items-center gap-4">
              {showPreview ? (
                <div className="relative bg-black rounded-[2.5rem] shadow-2xl p-3 w-full max-w-[390px]">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-10" />
                  <div className="rounded-[2rem] overflow-hidden bg-white" style={{ height: '780px' }}>
                    <iframe
                      src={previewUrl}
                      title={`Preview ${product.name}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Tampilkan Preview
                </button>
              )}

              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-pink-500 hover:underline"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  Buka di Tab Baru
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ───── How It Works ───── */}
      <section className="bg-cream-dark/40">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-14">Cara Pemesanan</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.12}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-pink-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-pink-500">{s.icon}</span>
                  </div>
                  <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-2">{s.step}</p>
                  <h3 className="font-serif text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

