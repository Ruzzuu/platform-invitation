import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import TemplateCard from '../components/TemplateCard'
import { useTemplates } from '../hooks/useTemplates'

const STYLES = ['All', 'Minimalist', 'Floral', 'Classic', 'Modern', 'Rustic', 'Bohemian']

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Sort by: Featured' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest' },
]

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-cream-dark/30 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [activeStyle, setActiveStyle] = useState('All')
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)

  const { data: templates, total, loading, error, pageSize } = useTemplates({
    style: activeStyle,
    sort,
    page,
  })

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function handleStyleChange(s) {
    setActiveStyle(s)
    setPage(1)
  }

  function handleSortChange(e) {
    setSort(e.target.value)
    setPage(1)
  }

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  return (
    <>
      {/* ───── Header ───── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <FadeIn>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-center mb-4">Template Collection</h1>
          <p className="text-warm-gray text-center max-w-2xl mx-auto">
            Koleksi template undangan digital yang elegan dan bisa dikustomisasi sesuai hari spesial Anda.
          </p>
        </FadeIn>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ───── Sidebar Filters ───── */}
          <FadeIn className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Style</h3>
                <div className="space-y-1">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStyleChange(s)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        activeStyle === s
                          ? 'bg-pink-50 text-pink-500 font-medium'
                          : 'text-warm-gray hover:bg-cream-dark/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ───── Grid ───── */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-8 text-sm text-warm-gray">
              {loading ? (
                <span>Memuat template...</span>
              ) : error ? (
                <span className="text-red-400">Gagal memuat data</span>
              ) : (
                <span>
                  {total === 0
                    ? 'Tidak ada template ditemukan'
                    : `Menampilkan ${startItem}–${endItem} dari ${total} template`}
                </span>
              )}
              <select
                value={sort}
                onChange={handleSortChange}
                className="bg-cream border border-cream-dark/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : templates.map((t, i) => (
                    <FadeIn key={t.id} delay={(i % 3) * 0.08}>
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

            {/* Empty state */}
            {!loading && !error && templates.length === 0 && (
              <div className="text-center py-20 text-warm-gray">
                <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
                <p>Belum ada template untuk kategori ini.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-14">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full text-sm text-warm-gray hover:bg-cream-dark transition disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                      p === page
                        ? 'bg-black text-white'
                        : 'text-warm-gray hover:bg-cream-dark'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full text-sm text-warm-gray hover:bg-cream-dark transition disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
