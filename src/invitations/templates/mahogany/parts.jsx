import { useEffect, useRef, useState } from 'react'
import FadeIn from '../../../components/FadeIn'
import { supabase } from '../../../lib/supabase'
import { useInvitationContext } from '../../InvitationContext'
import { calendarUrl, formatWeddingDate } from '../../invitationData'

function useCountdown(value) {
  const calculate = () => {
    const difference = new Date(value).getTime() - Date.now()
    if (!Number.isFinite(difference) || difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor((difference % 86400000) / 3600000),
      minutes: Math.floor((difference % 3600000) / 60000),
      seconds: Math.floor((difference % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calculate)
  useEffect(() => {
    const timer = setInterval(() => setTime(calculate()), 1000)
    return () => clearInterval(timer)
  }, [value])
  return time
}

function Countdown() {
  const { invitation } = useInvitationContext()
  const time = useCountdown(invitation.weddingAt)
  return (
    <div className="flex justify-center gap-2 px-2">
      {[
        ['Hari', time.days],
        ['Jam', time.hours],
        ['Menit', time.minutes],
        ['Detik', time.seconds],
      ].map(([label, value]) => (
        <div key={label} className="min-w-[64px] rounded-xl border border-ivory/20 bg-ivory/10 px-3 py-2.5 text-center shadow-md backdrop-blur-sm">
          <p className="text-2xl font-bold leading-none text-ivory tabular-nums">{String(value).padStart(2, '0')}</p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-wide text-ivory/70">{label}</p>
        </div>
      ))}
    </div>
  )
}

function PhotoBackground({ src, contain = false, priority = false }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-mahogany" aria-hidden="true">
      <img
        src={src}
        alt=""
        className={contain ? 'mahogany-responsive-photo' : 'h-full w-full object-cover object-center'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  )
}

export function MahoganyCover({ onOpen }) {
  const { invitation, guestName } = useInvitationContext()
  const { bride, groom, media } = invitation
  return (
    <div className="relative flex min-h-[100dvh] select-none flex-col items-center justify-between overflow-hidden text-center text-ivory">
      <PhotoBackground src={media.coverImageUrl} contain priority />
      <div className="absolute inset-0 bg-mahogany/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-mahogany/95 via-transparent to-mahogany/65" />

      <div className="relative z-10 mt-16 w-full animate-fade-up px-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-ivory/90 drop-shadow-md">The Wedding Of</p>
        <h1 className="font-serif text-5xl uppercase leading-none text-ivory drop-shadow-lg md:text-6xl">{bride.shortName} &amp; {groom.shortName}</h1>
      </div>

      <div className="relative z-10 mt-4 flex flex-1 animate-fade-up flex-col items-center justify-center anim-delay-100">
        <p className="text-sm text-ivory/90 drop-shadow-md">Kepada Yth;</p>
        <p className="text-sm text-ivory/90 drop-shadow-md">Bapak/Ibu/Saudara/i</p>
        <p className="mt-3 text-2xl font-bold capitalize text-ivory drop-shadow-lg">{guestName}</p>
      </div>

      <div className="relative z-10 flex w-full animate-fade-up flex-col items-center gap-5 px-4 pb-10 anim-delay-200">
        <div className="flex w-full items-center justify-center gap-3">
          <div className="h-px max-w-[48px] flex-1 bg-ivory/40" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ivory/90">{formatWeddingDate(invitation)}</p>
          <div className="h-px max-w-[48px] flex-1 bg-ivory/40" />
        </div>
        <Countdown />
        <button onClick={onOpen} className="mt-1 rounded-full bg-ivory px-12 py-4 text-sm font-bold tracking-widest text-mahogany shadow-[0_0_20px_rgba(239,239,240,.3)] transition active:scale-95">
          Open Invitation
        </button>
      </div>
    </div>
  )
}

export function MahoganyHome() {
  const { invitation } = useInvitationContext()
  const { bride, groom, media } = invitation
  async function share() {
    if (navigator.share) await navigator.share({ title: invitation.title, url: location.href }).catch(() => {})
    else await navigator.clipboard?.writeText(location.href)
  }
  return (
    <div className="min-h-full bg-mahogany pb-14 text-ivory">
      <div className="relative min-h-[220px] overflow-hidden px-6 pb-6 pt-8">
        <PhotoBackground src={media.homeBackgroundUrl} />
        <div className="absolute inset-0 bg-mahogany/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-mahogany via-transparent to-mahogany/45" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ivory/85">The Wedding Of</p>
          <h1 className="mt-2 font-serif text-5xl italic text-ivory drop-shadow-lg md:text-6xl">{bride.shortName} &amp;</h1>
          <h1 className="ml-12 mt-1 font-serif text-5xl italic text-ivory drop-shadow-lg md:text-6xl">{groom.shortName}</h1>
        </div>
      </div>

      <FadeIn className="relative z-10 mx-4 overflow-hidden rounded-3xl bg-ivory text-mahogany shadow-2xl">
        <div className="p-8 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mahogany/60">The Invitation</p>
          <p className="text-xs leading-relaxed text-mahogany/80">“{invitation.quoteText}”</p>
          <p className="mt-4 text-[10px] italic text-mahogany/60">{invitation.quoteSource}</p>
        </div>
        <img src={media.secondaryImageUrl} alt={`${bride.shortName} dan ${groom.shortName}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
      </FadeIn>

      <FadeIn className="mt-5 px-6 text-center">
        <p className="text-sm font-medium tracking-wide">{formatWeddingDate(invitation)}</p>
        <p className="mt-1 text-xs text-ivory/70">{invitation.locationLabel}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={share} className="rounded-2xl border border-ivory/20 bg-ivory/10 py-3 text-sm font-semibold">Bagikan</button>
          <a href={calendarUrl(invitation)} target="_blank" rel="noreferrer" className="rounded-2xl bg-ivory py-3 text-sm font-bold text-mahogany shadow-lg">Simpan di Kalender</a>
        </div>
      </FadeIn>
    </div>
  )
}

function PersonCard({ person }) {
  return (
    <FadeIn className="mb-11 text-center">
      <div className="mx-auto mb-5 aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl shadow-xl">
        <img src={person.photoUrl} alt={person.fullName} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <h2 className="font-serif text-2xl uppercase tracking-widest text-mahogany">{person.fullName}</h2>
      <p className="mx-auto mt-2 max-w-[290px] text-xs leading-relaxed text-mahogany/70">{person.parents}</p>
    </FadeIn>
  )
}

export function MahoganyCouple() {
  const { invitation } = useInvitationContext()
  return (
    <div className="min-h-full rounded-t-3xl bg-ivory px-6 pb-8 pt-14 text-mahogany shadow-[0_-10px_24px_rgba(0,0,0,.16)]">
      <FadeIn className="mb-9 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mahogany/60">The Couple</p>
        <p className="mx-auto max-w-sm whitespace-pre-line text-xs leading-relaxed text-mahogany/80">{invitation.introText}</p>
      </FadeIn>
      <PersonCard person={invitation.bride} />
      <PersonCard person={invitation.groom} />
    </div>
  )
}

export function MahoganyEvents() {
  const { invitation } = useInvitationContext()
  const locationEvent = invitation.events.find((event) => event.mapUrl) || invitation.events[0]
  return (
    <div className="min-h-full bg-mahogany pb-10">
      <div className="relative overflow-hidden px-6 pb-14 pt-10 text-center text-ivory">
        <PhotoBackground src={invitation.media.eventImageUrl} contain />
        <div className="absolute inset-0 bg-mahogany/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-mahogany via-transparent to-mahogany/40" />
        <FadeIn className="relative z-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70">The Day</p>
          <h2 className="mb-7 font-serif text-4xl tracking-widest md:text-5xl">WEDDING<br /><span className="-mt-3 block font-script text-5xl normal-case tracking-normal opacity-90 md:text-6xl">Event</span></h2>
          {invitation.events.map((event, index) => (
            <div key={`${event.name}-${index}`} className="mb-7">
              <h3 className="mb-3 font-serif text-2xl uppercase tracking-widest">{event.name}</h3>
              <p className="text-sm font-medium">{event.dateLabel}</p>
              <p className="text-sm font-medium">{event.timeLabel}</p>
              {index === 0 && <div className="my-8"><Countdown /></div>}
            </div>
          ))}
          {locationEvent && (
            <div className="mx-auto mt-3 max-w-sm rounded-2xl border border-ivory/20 bg-mahogany/70 p-6 shadow-lg backdrop-blur-sm">
              <span className="material-symbols-outlined mb-3 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <p className="mb-2 font-serif text-xl">{locationEvent.venue || 'Lokasi Acara'}</p>
              <p className="mb-5 text-xs leading-relaxed text-ivory/70">{locationEvent.address || invitation.locationLabel}</p>
              {locationEvent.mapUrl && <a href={locationEvent.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-xs font-semibold text-mahogany shadow-md"><span className="material-symbols-outlined text-base">map</span>Buka Google Maps</a>}
            </div>
          )}
        </FadeIn>
      </div>

      {invitation.loveStory.length > 0 && (
        <div className="relative z-20 -mt-6 rounded-t-3xl bg-ivory px-6 py-10 text-center text-mahogany shadow-[0_-10px_24px_rgba(0,0,0,.2)]">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mahogany/60">Our Journey</p>
            <h2 className="mb-10 mt-2 font-serif text-3xl tracking-widest">Love Story</h2>
            <div className="mx-auto max-w-md space-y-8">
              {invitation.loveStory.map((item, index) => (
                <div key={`${item.title}-${index}`}>
                  <h3 className="text-sm font-bold">{item.title}{item.year ? ` (${item.year})` : ''}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-mahogany/70">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  )
}

function timeAgo(value) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} jam lalu`
  return `${Math.floor(minutes / 1440)} hari lalu`
}

// The original Mahogany invitation already has live responses under this
// legacy slug. Keep that history visible from the customer's new URL and
// keep future submissions in the same shared guest book.
function responseSlug(invitation) {
  return invitation.slug === 'siti-nur-alfatihana' ? 'alfa-rizaldy' : invitation.slug
}

export function MahoganyGallery() {
  const { invitation } = useInvitationContext()
  const [wishes, setWishes] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [wishName, setWishName] = useState('')
  const [message, setMessage] = useState('')
  const [rsvpName, setRsvpName] = useState('')
  const [attending, setAttending] = useState(true)
  const [guestCount, setGuestCount] = useState(1)
  const [notice, setNotice] = useState('')
  const [sending, setSending] = useState(false)
  const [accountCopied, setAccountCopied] = useState(false)
  const wishSubmitting = useRef(false)
  const rsvpSubmitting = useRef(false)

  useEffect(() => {
    if (!invitation.id) return
    supabase.from('wishes').select('id,name,message,created_at').eq('invitation_slug', responseSlug(invitation)).order('created_at', { ascending: false }).limit(50).then(({ data }) => setWishes(data || []))
  }, [invitation.id])

  useEffect(() => {
    if (!selectedPhoto) return
    const close = (event) => event.key === 'Escape' && setSelectedPhoto(null)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [selectedPhoto])

  async function sendRsvp(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (formData.get('company_website') || !invitation.id || !rsvpName.trim() || rsvpSubmitting.current) return
    rsvpSubmitting.current = true
    setSending(true)
    setNotice('')
    const { error } = await supabase.from('rsvp').insert({ invitation_slug: responseSlug(invitation), name: rsvpName.trim(), hadir: attending, jumlah_tamu: attending ? guestCount : 0 })
    setSending(false)
    rsvpSubmitting.current = false
    setNotice(error ? 'Gagal mengirim konfirmasi. Silakan coba lagi.' : 'Konfirmasi kehadiran telah diterima. Terima kasih!')
  }

  async function sendWish(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (formData.get('company_website') || !invitation.id || !wishName.trim() || !message.trim() || wishSubmitting.current) return
    wishSubmitting.current = true
    setSending(true)
    setNotice('')
    const { data, error } = await supabase.from('wishes').insert({ invitation_slug: responseSlug(invitation), name: wishName.trim(), message: message.trim() }).select('id,name,message,created_at').single()
    setSending(false)
    wishSubmitting.current = false
    if (error) setNotice('Gagal mengirim ucapan. Silakan coba lagi.')
    else {
      setWishes((current) => [data, ...current])
      setWishName('')
      setMessage('')
      setNotice('Ucapan berhasil dikirim.')
    }
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(invitation.gift.accountNumber)
      setAccountCopied(true)
      setTimeout(() => setAccountCopied(false), 2000)
    } catch { setAccountCopied(false) }
  }

  return (
    <div className="min-h-full bg-ivory pb-20 text-mahogany">
      <div className="px-4 pb-14 pt-8">
        <FadeIn className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mahogany/60">Memories</p>
          <h2 className="mt-2 font-serif text-4xl">Our Gallery</h2>
          <div className="mx-auto mt-4 h-px w-12 bg-mahogany/20" />
        </FadeIn>
        <div className="columns-2 gap-3 space-y-3">
          {invitation.media.galleryUrls.map((url, index) => (
            <button key={`${url}-${index}`} type="button" onClick={() => setSelectedPhoto({ url, index })} className="block w-full overflow-hidden rounded-xl shadow-lg">
              <img src={url} alt={`Galeri pernikahan ${index + 1}`} className="w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="relative -mt-6 overflow-hidden rounded-t-3xl px-4 py-12 text-ivory shadow-[0_-10px_20px_rgba(0,0,0,.2)]">
        <PhotoBackground src={invitation.media.rsvpBackgroundUrl} contain />
        <div className="absolute inset-0 bg-mahogany/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-mahogany via-transparent to-mahogany/40" />
        <div className="relative z-10 mx-auto max-w-md space-y-16">
          <FadeIn>
            <div className="mb-8 text-center"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/60">RSVP</p><h3 className="font-serif text-3xl">Konfirmasi Kehadiran</h3><div className="mx-auto mt-4 h-px w-12 bg-ivory/20" /></div>
            <form onSubmit={sendRsvp} className="space-y-5 rounded-2xl border border-ivory/20 bg-mahogany/90 p-6 backdrop-blur-md">
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-px w-px opacity-0" aria-hidden="true" />
              <div><label className="mb-2 block text-xs uppercase tracking-wider text-ivory/60">Nama Lengkap</label><input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} maxLength={100} required placeholder="Masukkan nama Anda" className="w-full rounded-xl border border-ivory/20 bg-mahogany px-4 py-3 text-sm text-ivory placeholder:text-ivory/40" /></div>
              <div><label className="mb-2 block text-xs uppercase tracking-wider text-ivory/60">Kehadiran</label><div className="flex gap-3">{[true, false].map((value) => <button key={String(value)} type="button" onClick={() => setAttending(value)} className={`flex-1 rounded-xl border py-3 text-sm ${attending === value ? 'border-ivory bg-ivory font-medium text-mahogany' : 'border-ivory/20 text-ivory/60'}`}>{value ? 'Hadir' : 'Tidak Hadir'}</button>)}</div></div>
              {attending && <div><label className="mb-2 block text-xs uppercase tracking-wider text-ivory/60">Jumlah Tamu</label><div className="flex w-fit items-center gap-4 rounded-xl border border-ivory/20 bg-mahogany p-2"><button type="button" onClick={() => setGuestCount((count) => Math.max(1, count - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-ivory/10">−</button><span className="w-6 text-center">{guestCount}</span><button type="button" onClick={() => setGuestCount((count) => Math.min(10, count + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-ivory/10">+</button></div></div>}
              <button disabled={sending || !invitation.id} className="w-full rounded-xl bg-ivory py-4 text-sm font-medium text-mahogany disabled:opacity-50">{invitation.id ? (sending ? 'Mengirim...' : 'Kirim Konfirmasi') : 'Dinonaktifkan pada preview'}</button>
            </form>
          </FadeIn>

          {invitation.gift.enabled && (
            <FadeIn>
              <div className="mb-7 text-center"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/60">Wedding Gift</p><h3 className="font-serif text-3xl">Hadiah Digital</h3><div className="mx-auto mt-4 h-px w-12 bg-ivory/20" /></div>
              <p className="mx-auto mb-6 max-w-sm text-center text-sm leading-relaxed text-ivory/70">Tanpa mengurangi rasa hormat, bagi kerabat yang ingin memberikan hadiah atau tanda kasih secara digital, dapat dikirimkan melalui rekening berikut:</p>
              <div className="relative overflow-hidden rounded-2xl border border-ivory/20 bg-mahogany/90 p-6 shadow-xl backdrop-blur-md">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-ivory/10" />
                <div className="absolute -bottom-14 -left-8 h-36 w-36 rounded-full border border-ivory/10" />
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-full bg-ivory/10">account_balance</span><div><p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Bank</p><p className="font-serif text-xl font-semibold">{invitation.gift.bankName}</p></div></div>
                  <span className="material-symbols-outlined text-3xl text-ivory/30">credit_card</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Nomor rekening</p>
                <p className="mb-5 mt-1 break-all font-serif text-2xl tracking-[0.08em]">{invitation.gift.accountNumber}</p>
                <div className="flex items-end justify-between gap-4 border-t border-ivory/15 pt-5">
                  <div><p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Atas nama</p><p className="mt-1 text-sm font-semibold">{invitation.gift.accountHolder}</p></div>
                  <button type="button" onClick={copyAccount} className="inline-flex items-center gap-2 rounded-xl bg-ivory px-4 py-2.5 text-xs font-semibold text-mahogany"><span className="material-symbols-outlined text-base">{accountCopied ? 'check' : 'content_copy'}</span>{accountCopied ? 'Tersalin' : 'Salin Rekening'}</button>
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn>
            <div className="mb-8 text-center"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/60">Guest Book</p><h3 className="font-serif text-3xl">Wishes &amp; Prayers</h3><div className="mx-auto mt-4 h-px w-12 bg-ivory/20" /></div>
            <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
              {wishes.length === 0 ? <p className="rounded-2xl border border-ivory/15 bg-mahogany/80 p-6 text-center text-sm text-ivory/60">Belum ada ucapan.<span className="mt-1 block text-xs text-ivory/40">Jadilah yang pertama memberikan doa terbaik.</span></p> : wishes.map((wish) => <article key={wish.id} className="rounded-2xl border border-ivory/20 bg-mahogany/90 p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory/15 text-sm font-medium">{wish.name?.charAt(0).toUpperCase()}</span><div><strong className="block text-sm">{wish.name}</strong><span className="text-[10px] text-ivory/45">{timeAgo(wish.created_at)}</span></div></div><p className="mt-3 text-sm leading-relaxed text-ivory/75">{wish.message}</p></article>)}
            </div>
            <form onSubmit={sendWish} className="space-y-3 rounded-2xl border border-ivory/20 bg-mahogany/85 p-5 backdrop-blur-md">
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-px w-px opacity-0" aria-hidden="true" />
              <input value={wishName} onChange={(event) => setWishName(event.target.value)} maxLength={100} required placeholder="Nama Anda" className="w-full rounded-xl border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40" />
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} required placeholder="Tuliskan ucapan & doa…" className="w-full resize-none rounded-xl border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40" />
              <button disabled={sending || !invitation.id} className="w-full rounded-xl bg-ivory py-3 text-sm font-semibold text-mahogany disabled:opacity-50">Kirim Ucapan</button>
            </form>
            {notice && <p className="mt-4 rounded-xl bg-black/40 p-3 text-center text-xs">{notice}</p>}
          </FadeIn>
        </div>
      </div>

      {selectedPhoto && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-mahogany/95 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedPhoto(null)}><button type="button" onClick={() => setSelectedPhoto(null)} className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-mahogany" aria-label="Tutup foto"><span className="material-symbols-outlined">close</span></button><img src={selectedPhoto.url} alt={`Galeri pernikahan ${selectedPhoto.index + 1}`} className="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-2xl" onClick={(event) => event.stopPropagation()} /></div>}
    </div>
  )
}

export function MahoganyClosing() {
  const { invitation } = useInvitationContext()
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 text-center text-ivory">
      <PhotoBackground src={invitation.media.closingBackgroundUrl} contain />
      <div className="absolute inset-0 bg-mahogany/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-mahogany via-transparent to-mahogany/95" />
      <div className="absolute left-6 top-6 h-16 w-16 rounded-tl-3xl border-l-2 border-t-2 border-ivory opacity-70" />
      <div className="absolute right-6 top-6 h-16 w-16 rounded-tr-3xl border-r-2 border-t-2 border-ivory opacity-70" />
      <div className="absolute bottom-6 left-6 h-16 w-16 rounded-bl-3xl border-b-2 border-l-2 border-ivory opacity-70" />
      <div className="absolute bottom-6 right-6 h-16 w-16 rounded-br-3xl border-b-2 border-r-2 border-ivory opacity-70" />
      <FadeIn className="relative z-10 mx-auto max-w-xl">
        <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-ivory/90">{invitation.closingText}</p>
        <p className="my-10 font-serif text-xl">{invitation.closingGreeting}</p>
        <h2 className="mb-8 font-serif text-3xl">Kami yang berbahagia</h2>
        <div className="space-y-8">
          <div><p className="inline-block border-b border-ivory/40 pb-1 font-serif text-lg">{invitation.brideFamilyTitle}</p><p className="mt-1 font-serif text-base text-ivory/80">{invitation.brideFamilyDetail}</p></div>
          <div><p className="inline-block border-b border-ivory/40 pb-1 font-serif text-lg">{invitation.groomFamilyTitle}</p><p className="mt-1 font-serif text-base text-ivory/80">{invitation.groomFamilyDetail}</p></div>
        </div>
        {invitation.media.musicCredit && <p className="mt-16 text-xs italic text-ivory/50">Music: {invitation.media.musicCredit}</p>}
      </FadeIn>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Beranda' },
  { id: 'couple', icon: 'favorite', label: 'Pasangan' },
  { id: 'events', icon: 'event', label: 'Acara' },
  { id: 'gallery', icon: 'photo_library', label: 'Galeri' },
]

export function MahoganyNav({ active, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && <button type="button" aria-label="Tutup navigasi" onClick={() => setOpen(false)} className="absolute inset-0 z-[60] bg-mahogany/55" />}
      {open && <div className="absolute inset-x-5 bottom-24 z-[70] flex items-center justify-center gap-2 rounded-full border border-mahogany/15 bg-ivory/95 px-4 py-4 shadow-xl backdrop-blur-md">{NAV_ITEMS.map((item) => <button key={item.id} type="button" onClick={() => { setOpen(false); onChange(item.id) }} className={`flex h-11 w-11 items-center justify-center rounded-full border ${active === item.id ? 'border-mahogany bg-mahogany text-ivory' : 'border-mahogany/15 text-mahogany/50'}`} aria-label={item.label}><span className="material-symbols-outlined text-xl">{item.icon}</span></button>)}</div>}
      <button type="button" onClick={() => setOpen((value) => !value)} className="absolute bottom-7 right-5 z-[80] flex items-center gap-2 rounded-full border border-mahogany/15 bg-ivory px-5 py-3 text-xs font-bold uppercase tracking-widest text-mahogany shadow-xl" aria-label="Buka navigasi"><span className="material-symbols-outlined text-xl">{open ? 'close' : 'menu'}</span>Menu</button>
    </>
  )
}

export function MahoganyMusicButton({ playing, onToggle }) {
  return <button type="button" onClick={onToggle} className={`absolute bottom-24 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-mahogany/15 bg-ivory text-mahogany shadow-xl ${playing ? 'animate-spin-slow' : 'spin-paused'}`} aria-label={playing ? 'Jeda musik' : 'Putar musik'}><span className="material-symbols-outlined text-xl">{playing ? 'music_note' : 'music_off'}</span></button>
}
