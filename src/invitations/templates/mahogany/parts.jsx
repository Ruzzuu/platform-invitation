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
        <div key={label} className="min-w-[62px] rounded-xl border border-ivory/20 bg-ivory/10 px-2 py-3 text-center shadow-md backdrop-blur-sm">
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
    <div className="relative flex min-h-[100dvh] select-none flex-col items-center justify-between overflow-hidden px-5 py-10 text-center text-ivory">
      <PhotoBackground src={media.coverImageUrl} priority />
      <div className="absolute inset-0 bg-mahogany/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-mahogany/95 via-transparent to-mahogany/65" />

      <div className="relative z-10 mt-6 w-full animate-fade-up">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-ivory/90 drop-shadow-md">The Wedding Of</p>
        <h1 className="font-serif text-5xl uppercase leading-none text-ivory drop-shadow-lg">{bride.shortName} &amp; {groom.shortName}</h1>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <p className="text-sm text-ivory/85">Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <p className="mt-3 text-2xl font-bold capitalize text-ivory drop-shadow-lg">{guestName}</p>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-5">
        <div className="flex w-full items-center justify-center gap-3">
          <div className="h-px w-12 bg-ivory/40" />
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ivory/90">{formatWeddingDate(invitation)}</p>
          <div className="h-px w-12 bg-ivory/40" />
        </div>
        <Countdown />
        <button onClick={onOpen} className="mt-1 rounded-full bg-ivory px-11 py-4 text-xs font-bold uppercase tracking-[0.18em] text-mahogany shadow-xl active:scale-95">
          Buka Undangan
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
      <div className="relative h-[52vh] overflow-hidden">
        <PhotoBackground src={media.coverImageUrl} />
        <div className="absolute inset-0 bg-mahogany/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-mahogany via-transparent to-mahogany/45" />
        <div className="absolute inset-x-0 bottom-14 z-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ivory/85">The Wedding Of</p>
          <h1 className="mt-2 font-serif text-5xl italic text-ivory drop-shadow-lg">{bride.shortName} &amp; {groom.shortName}</h1>
        </div>
      </div>

      <FadeIn className="relative z-10 mx-4 -mt-8 overflow-hidden rounded-3xl bg-ivory text-mahogany shadow-2xl">
        <div className="p-8 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mahogany/60">The Invitation</p>
          <p className="text-xs leading-relaxed text-mahogany/80">“{invitation.quoteText}”</p>
          <p className="mt-4 text-[10px] italic text-mahogany/60">{invitation.quoteSource}</p>
        </div>
        <img src={media.secondaryImageUrl} alt={`${bride.shortName} dan ${groom.shortName}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
      </FadeIn>

      <FadeIn className="mt-7 px-6 text-center">
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
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-mahogany/80">{invitation.introText}</p>
      </FadeIn>
      <PersonCard person={invitation.bride} />
      <PersonCard person={invitation.groom} />
    </div>
  )
}

export function MahoganyEvents() {
  const { invitation } = useInvitationContext()
  return (
    <div className="min-h-full bg-mahogany">
      <div className="relative overflow-hidden px-6 py-14 text-center text-ivory">
        <PhotoBackground src={invitation.media.eventImageUrl} />
        <div className="absolute inset-0 bg-mahogany/70" />
        <FadeIn className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70">The Day</p>
          <h2 className="mb-9 mt-2 font-serif text-4xl tracking-widest">Wedding Event</h2>
          {invitation.events.map((event, index) => (
            <div key={`${event.name}-${index}`} className="mb-10">
              <h3 className="font-serif text-2xl uppercase tracking-widest">{event.name}</h3>
              <p className="mt-3 text-sm">{event.dateLabel}</p>
              <p className="text-sm">{event.timeLabel}</p>
              <p className="mt-2 text-xs leading-relaxed text-ivory/75">{event.venue}{event.address ? `, ${event.address}` : ''}</p>
              {event.mapUrl && <a href={event.mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-xs font-semibold text-mahogany"><span className="material-symbols-outlined text-base">map</span>Buka Google Maps</a>}
              {index === 0 && <div className="mt-8"><Countdown /></div>}
            </div>
          ))}
        </FadeIn>
      </div>

      {invitation.loveStory.length > 0 && (
        <div className="rounded-t-3xl bg-ivory px-6 py-14 text-center text-mahogany shadow-[0_-10px_24px_rgba(0,0,0,.2)]">
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
    supabase.from('invitation_wishes').select('id,name,message,created_at').eq('invitation_id', invitation.id).order('created_at', { ascending: false }).limit(50).then(({ data }) => setWishes(data || []))
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
    const { error } = await supabase.from('invitation_rsvps').insert({ invitation_id: invitation.id, name: rsvpName.trim(), attending, guest_count: attending ? guestCount : 0 })
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
    const { data, error } = await supabase.from('invitation_wishes').insert({ invitation_id: invitation.id, name: wishName.trim(), message: message.trim() }).select('id,name,message,created_at').single()
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
      <div className="px-4 py-14">
        <FadeIn className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mahogany/60">Memories</p>
          <h2 className="mt-2 font-serif text-4xl">Our Gallery</h2>
        </FadeIn>
        <div className="columns-2 gap-3 space-y-3">
          {invitation.media.galleryUrls.map((url, index) => (
            <button key={`${url}-${index}`} type="button" onClick={() => setSelectedPhoto({ url, index })} className="block w-full overflow-hidden rounded-xl shadow-lg">
              <img src={url} alt={`Galeri pernikahan ${index + 1}`} className="w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="relative px-4 py-16 text-ivory">
        <PhotoBackground src={invitation.media.rsvpBackgroundUrl} />
        <div className="absolute inset-0 bg-mahogany/75" />
        <div className="relative z-10 mx-auto max-w-md space-y-12">
          <FadeIn>
            <h3 className="mb-6 text-center font-serif text-3xl">Konfirmasi Kehadiran</h3>
            <form onSubmit={sendRsvp} className="space-y-4 rounded-2xl border border-ivory/20 bg-mahogany/85 p-6 backdrop-blur-md">
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-px w-px opacity-0" aria-hidden="true" />
              <input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} maxLength={100} required placeholder="Nama lengkap" className="w-full rounded-xl border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40" />
              <div className="flex gap-3">
                {[true, false].map((value) => <button key={String(value)} type="button" onClick={() => setAttending(value)} className={`flex-1 rounded-xl border py-3 text-sm ${attending === value ? 'bg-ivory font-semibold text-mahogany' : 'border-ivory/20 text-ivory/70'}`}>{value ? 'Hadir' : 'Tidak Hadir'}</button>)}
              </div>
              {attending && <div className="flex items-center justify-between"><span className="text-sm">Jumlah tamu</span><input type="number" min="1" max="10" value={guestCount} onChange={(event) => setGuestCount(Math.min(10, Math.max(1, Number(event.target.value))))} className="w-20 rounded-lg border border-ivory/20 bg-transparent px-3 py-2 text-ivory" /></div>}
              <button disabled={sending || !invitation.id} className="w-full rounded-xl bg-ivory py-3 text-sm font-semibold text-mahogany disabled:opacity-50">{invitation.id ? 'Kirim Konfirmasi' : 'Dinonaktifkan pada preview'}</button>
            </form>
          </FadeIn>

          {invitation.gift.enabled && (
            <FadeIn>
              <h3 className="mb-6 text-center font-serif text-3xl">Hadiah Digital</h3>
              <div className="rounded-2xl border border-ivory/20 bg-mahogany/85 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-7 flex items-center justify-between">
                  <div><p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Bank</p><p className="font-serif text-xl font-semibold">{invitation.gift.bankName}</p></div>
                  <span className="material-symbols-outlined text-3xl text-ivory/40">account_balance</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Nomor rekening</p>
                <p className="mb-5 mt-1 break-all font-serif text-2xl tracking-[0.08em]">{invitation.gift.accountNumber}</p>
                <div className="flex items-end justify-between gap-4 border-t border-ivory/15 pt-5">
                  <div><p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Atas nama</p><p className="mt-1 text-sm font-semibold">{invitation.gift.accountHolder}</p></div>
                  <button type="button" onClick={copyAccount} className="rounded-xl bg-ivory px-4 py-2.5 text-xs font-semibold text-mahogany">{accountCopied ? 'Tersalin' : 'Salin'}</button>
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn>
            <h3 className="mb-6 text-center font-serif text-3xl">Wishes &amp; Prayers</h3>
            <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
              {wishes.length === 0 ? <p className="rounded-2xl border border-ivory/15 bg-mahogany/80 p-6 text-center text-sm text-ivory/60">Belum ada ucapan.</p> : wishes.map((wish) => <article key={wish.id} className="rounded-2xl border border-ivory/15 bg-mahogany/85 p-5"><div className="flex justify-between gap-3"><strong className="text-sm">{wish.name}</strong><span className="text-[10px] text-ivory/45">{timeAgo(wish.created_at)}</span></div><p className="mt-3 text-sm text-ivory/75">{wish.message}</p></article>)}
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
      <PhotoBackground src={invitation.media.coverImageUrl} />
      <div className="absolute inset-0 bg-mahogany/82" />
      <div className="absolute inset-6 border border-ivory/40" />
      <FadeIn className="relative z-10 mx-auto max-w-xl">
        <p className="font-serif text-lg leading-relaxed text-ivory/90">{invitation.closingText}</p>
        <p className="my-10 font-serif text-xl">{invitation.closingGreeting}</p>
        <h2 className="mb-8 font-serif text-3xl">Kami yang berbahagia</h2>
        <div className="space-y-7">
          <div><p className="font-serif text-lg">{invitation.brideFamilyTitle}</p><p className="mt-1 text-sm text-ivory/65">{invitation.brideFamilyDetail}</p></div>
          <div><p className="font-serif text-lg">{invitation.groomFamilyTitle}</p><p className="mt-1 text-sm text-ivory/65">{invitation.groomFamilyDetail}</p></div>
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
