import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { InvitationProvider } from '../invitations/InvitationContext'
import { createSampleInvitation } from '../invitations/invitationData'
import { TEMPLATE_REGISTRY, resolveRendererKey } from '../invitations/templateRegistry'

export default function TemplatePreviewPage() {
  const { templateSlug } = useParams()
  const key = resolveRendererKey(templateSlug)
  const Renderer = TEMPLATE_REGISTRY[key]
  if (!Renderer) return <main className="min-h-screen grid place-items-center text-center"><div><h1 className="text-2xl font-bold">Preview tidak ditemukan</h1><Link to="/catalog" className="mt-4 inline-block text-pink-500 underline">Kembali ke katalog</Link></div></main>
  return (
    <InvitationProvider invitation={createSampleInvitation(key)} guestName="Nama Tamu">
      <Suspense fallback={<main className="min-h-screen grid place-items-center">Menyiapkan preview…</main>}>
        <Renderer preview />
      </Suspense>
    </InvitationProvider>
  )
}
