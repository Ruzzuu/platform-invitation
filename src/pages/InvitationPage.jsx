import { Suspense } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useInvitation } from '../hooks/useInvitation'
import { InvitationProvider } from '../invitations/InvitationContext'
import { TEMPLATE_REGISTRY, resolveRendererKey } from '../invitations/templateRegistry'

function FullPageMessage({ children }) {
  return <main className="min-h-screen grid place-items-center bg-stone-950 px-6 text-center text-white">{children}</main>
}

export default function InvitationPage() {
  const { invitationSlug } = useParams()
  const [searchParams] = useSearchParams()
  const { data, loading, error } = useInvitation(invitationSlug)

  if (loading) return <FullPageMessage><p className="animate-pulse">Memuat undangan…</p></FullPageMessage>
  if (error) return <FullPageMessage><div><h1 className="font-serif text-2xl">Undangan belum dapat dimuat</h1><p className="mt-2 text-sm text-white/60">Silakan coba lagi beberapa saat.</p></div></FullPageMessage>
  if (!data) return <FullPageMessage><div><h1 className="font-serif text-3xl">Undangan tidak ditemukan</h1><p className="mt-3 text-white/60">Tautan mungkin salah atau undangan belum dipublikasikan.</p><Link to="/" className="mt-6 inline-block text-pink-300 underline">Kembali ke Lembaran Baru</Link></div></FullPageMessage>

  const key = resolveRendererKey(data.rendererKey)
  const Renderer = TEMPLATE_REGISTRY[key]
  if (!Renderer) return <FullPageMessage><p>Desain undangan ini belum tersedia.</p></FullPageMessage>

  const rawGuest = searchParams.get('to')?.trim().slice(0, 80)
  const guestName = rawGuest || 'Bapak/Ibu/Saudara/i'
  return (
    <InvitationProvider invitation={data} guestName={guestName}>
      <Suspense fallback={<FullPageMessage><p className="animate-pulse">Menyiapkan desain…</p></FullPageMessage>}>
        <Renderer />
      </Suspense>
    </InvitationProvider>
  )
}
