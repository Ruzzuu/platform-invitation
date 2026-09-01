import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useInvitationContext } from '../InvitationContext'
import { calendarUrl, formatWeddingDate, templateAsset } from '../invitationData'

function useCountdown(value) {
  const calculate = () => {
    const difference = new Date(value).getTime() - Date.now()
    if (!Number.isFinite(difference) || difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return { days: Math.floor(difference / 86400000), hours: Math.floor((difference % 86400000) / 3600000), minutes: Math.floor((difference % 3600000) / 60000), seconds: Math.floor((difference % 60000) / 1000) }
  }
  const [time, setTime] = useState(calculate)
  useEffect(() => { const timer = setInterval(() => setTime(calculate()), 1000); return () => clearInterval(timer) }, [value])
  return time
}

export function Countdown({ dark = false }) {
  const { invitation } = useInvitationContext()
  const time = useCountdown(invitation.weddingAt)
  return <div className="flex justify-center gap-2 px-2">{[['Hari', time.days], ['Jam', time.hours], ['Menit', time.minutes], ['Detik', time.seconds]].map(([label, value]) => <div key={label} className={`min-w-[58px] rounded-xl border px-2 py-3 text-center backdrop-blur-sm ${dark ? 'border-white/20 bg-white/10' : 'border-blush/30 bg-blush/20'}`}><p className="text-2xl font-bold leading-none tabular-nums">{String(value).padStart(2, '0')}</p><p className="mt-1 text-[9px] font-medium uppercase opacity-70">{label}</p></div>)}</div>
}

export function DynamicCover({ onOpen, variant }) {
  const { invitation, guestName } = useInvitationContext()
  const { bride, groom, media } = invitation
  const isDark = variant === 'delta-gray'
  const isJavanese = variant === 'javanese'
  const date = formatWeddingDate(invitation)
  return <div className={`relative flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden px-6 py-10 text-center ${isDark ? 'text-white' : 'text-dark'}`} style={{ backgroundColor: isJavanese ? '#0a0904' : undefined }}>
    {!isJavanese && <><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${media.coverImageUrl})` }} /><div className={`absolute inset-0 ${isDark ? 'bg-black/55' : 'bg-cream/75 backdrop-blur-[1px]'}`} /></>}
    {isJavanese && <><img src={templateAsset('javanese', 'bagian atas nama.webp')} alt="" className="relative z-10 mt-5 w-56" /><div className="absolute inset-0 border-[10px] border-[#d4af37]/10" /></>}
    <div className="relative z-10 mt-6"><p className="mb-3 text-xs uppercase tracking-[0.3em] opacity-80">The Wedding Of</p><h1 className={`${isJavanese ? 'font-script text-[#d4af37]' : isDark ? 'font-serif uppercase' : 'font-script text-blush-dark'} text-6xl leading-tight`}>{bride.shortName}</h1><p className="font-serif text-2xl opacity-70">&amp;</p><h1 className={`${isJavanese ? 'font-script text-[#d4af37]' : isDark ? 'font-serif uppercase' : 'font-script text-blush-dark'} text-6xl leading-tight`}>{groom.shortName}</h1></div>
    <div className="relative z-10 my-6"><p className="text-sm opacity-70">Kepada Yth. Bapak/Ibu/Saudara/i</p><p className="mt-2 text-2xl font-bold capitalize">{guestName}</p></div>
    <div className="relative z-10 flex flex-col items-center gap-5"><p className="text-xs font-bold uppercase tracking-[0.15em] opacity-80">{date}</p><Countdown dark={isDark || isJavanese} /><button onClick={onOpen} className={`${isJavanese ? 'border border-[#d4af37] text-[#d4af37]' : isDark ? 'bg-white text-gray-900' : 'bg-blush text-white'} rounded-full px-10 py-3 text-xs font-bold uppercase tracking-[0.18em] shadow-lg active:scale-95`}>Buka Undangan</button></div>
  </div>
}

export function DynamicHome({ onShare, variant }) {
  const { invitation } = useInvitationContext()
  const { bride, groom, media } = invitation
  const isDark = variant === 'delta-gray'
  return <div className={`${isDark ? 'bg-[#333] text-white' : 'bg-cream text-dark'} min-h-full pb-10`}>
    <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${media.coverImageUrl})` }}><div className={`absolute inset-0 ${isDark ? 'bg-black/45' : 'bg-gradient-to-t from-cream via-transparent to-black/20'}`} /><div className="absolute inset-x-0 bottom-20 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.3em]">The Wedding Of</p><h1 className={`${isDark ? 'font-serif italic' : 'font-script text-blush-dark'} mt-2 text-5xl`}>{bride.shortName} &amp; {groom.shortName}</h1></div></div>
    <div className={`${isDark ? 'bg-[#f0f0f0] text-gray-800' : 'bg-white text-dark border border-blush/10'} relative z-10 mx-4 -mt-12 overflow-hidden rounded-3xl shadow-xl`}><div className="p-8 text-center"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] opacity-60">The Invitation</p><p className="text-xs leading-relaxed opacity-80">“{invitation.quoteText}”</p><p className="mt-4 text-[10px] italic opacity-60">({invitation.quoteSource})</p></div><div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${media.secondaryImageUrl})` }} /></div>
    <div className="mt-7 px-6 text-center"><p className="text-sm font-medium">{formatWeddingDate(invitation)}</p><p className="mt-1 text-xs opacity-60">{invitation.locationLabel}</p><div className="mt-7 flex flex-col gap-3"><button onClick={onShare} className="rounded-2xl border border-current/20 py-3 text-sm font-semibold">Bagikan</button><a href={calendarUrl(invitation)} target="_blank" rel="noreferrer" className={`${isDark ? 'bg-white text-gray-900' : 'bg-sage text-white'} rounded-2xl py-3 text-sm font-bold`}>Simpan di Kalender</a></div></div>
  </div>
}

export function DynamicCouple({ variant }) {
  const { invitation } = useInvitationContext()
  const isDark = variant === 'delta-gray'
  return <div className={`${isDark ? 'bg-[#f0f0f0] text-gray-800' : 'bg-cream text-dark'} min-h-full px-6 py-14 text-center`}><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] opacity-60">The Couple</p><p className="mx-auto mb-10 max-w-sm text-xs leading-relaxed opacity-70">{invitation.introText}</p>{[invitation.bride, invitation.groom].map((person) => <div key={person.fullName} className="mb-12"><div className="mx-auto mb-5 aspect-[3/4] w-full max-w-[280px] rounded-2xl bg-cover bg-center shadow-lg ring-2 ring-blush/20" style={{ backgroundImage: `url(${person.photoUrl})` }} /><h2 className="font-serif text-2xl uppercase tracking-widest">{person.fullName}</h2><p className="mx-auto mt-2 max-w-[280px] text-xs leading-relaxed opacity-60">{person.parents}</p></div>)}</div>
}

export function DynamicEvents({ variant }) {
  const { invitation } = useInvitationContext()
  const isDark = variant === 'delta-gray'
  return <div className={`${isDark ? 'bg-[#333]' : 'bg-cream'} min-h-full`}><div className="relative bg-cover bg-center px-6 py-16 text-center text-white" style={{ backgroundImage: `url(${invitation.media.eventImageUrl})` }}><div className="absolute inset-0 bg-black/55" /><div className="relative"><p className="text-xs uppercase tracking-[.2em] opacity-70">The Day</p><h2 className="mb-10 mt-2 font-serif text-4xl tracking-widest">Wedding Event</h2>{invitation.events.map((event, index) => <div key={`${event.name}-${index}`} className="mb-10"><h3 className="font-serif text-2xl uppercase tracking-widest">{event.name}</h3><p className="mt-3 text-sm">{event.dateLabel}</p><p className="text-sm">{event.timeLabel}</p><p className="mt-1 text-sm opacity-80">{event.venue}{event.address ? `, ${event.address}` : ''}</p>{event.mapUrl && <a href={event.mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-sage px-5 py-2.5 text-xs font-medium">Buka Google Maps</a>}{index === 0 && <div className="my-8"><Countdown dark /></div>}</div>)}</div></div>{invitation.loveStory.length > 0 && <div className={`${isDark ? 'bg-[#f0f0f0] text-gray-800' : 'bg-white text-dark'} rounded-t-3xl px-6 py-14 text-center`}><p className="text-xs uppercase tracking-[.2em] opacity-60">Our Journey</p><h2 className="mb-10 mt-2 font-serif text-3xl tracking-widest">Love Story</h2><div className="mx-auto max-w-md space-y-8">{invitation.loveStory.map((item, index) => <div key={`${item.title}-${index}`}><h3 className="text-sm font-bold">{item.title} ({item.year})</h3><p className="mt-2 text-xs leading-relaxed opacity-60">{item.text}</p></div>)}</div></div>}</div>
}

function timeAgo(value) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} jam lalu`
  return `${Math.floor(minutes / 1440)} hari lalu`
}

export function DynamicGallery({ variant }) {
  const { invitation } = useInvitationContext()
  const isDark = variant === 'delta-gray'
  const [wishes, setWishes] = useState([])
  const [wishName, setWishName] = useState('')
  const [message, setMessage] = useState('')
  const [rsvpName, setRsvpName] = useState('')
  const [attending, setAttending] = useState(true)
  const [guestCount, setGuestCount] = useState(1)
  const [notice, setNotice] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)
  useEffect(() => {
    if (!invitation.id) return
    supabase.from('invitation_wishes').select('id,name,message,created_at').eq('invitation_id', invitation.id).order('created_at', { ascending: false }).limit(50).then(({ data }) => setWishes(data || []))
  }, [invitation.id])
  async function sendRsvp(event) {
    event.preventDefault(); if (!invitation.id || !rsvpName.trim()) return
    setSending(true); setNotice('')
    const { error } = await supabase.from('invitation_rsvps').insert({ invitation_id: invitation.id, name: rsvpName.trim(), attending, guest_count: attending ? guestCount : 0 })
    setSending(false); setNotice(error ? 'Gagal mengirim konfirmasi. Silakan coba lagi.' : 'Konfirmasi kehadiran telah diterima. Terima kasih!')
  }
  async function sendWish(event) {
    event.preventDefault(); if (!invitation.id || !wishName.trim() || !message.trim()) return
    setSending(true); setNotice('')
    const { data, error } = await supabase.from('invitation_wishes').insert({ invitation_id: invitation.id, name: wishName.trim(), message: message.trim() }).select('id,name,message,created_at').single()
    setSending(false)
    if (error) setNotice('Gagal mengirim ucapan. Silakan coba lagi.')
    else { setWishes((current) => [data, ...current]); setWishName(''); setMessage(''); setNotice('Ucapan berhasil dikirim.'); setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50) }
  }
  const card = isDark ? 'bg-black/65 border-white/15 text-white' : 'bg-white/90 border-blush/20 text-dark'
  return <div className={`${isDark ? 'bg-[#333] text-white' : 'bg-cream text-dark'} min-h-full pb-20`}><div className="px-4 py-14"><h2 className="mb-8 text-center font-serif text-4xl">Our Gallery</h2><div className="grid grid-cols-2 gap-2">{invitation.media.galleryUrls.map((url, index) => <div key={`${url}-${index}`} className={`${index % 3 === 0 ? 'row-span-2 h-[280px]' : 'h-[136px]'} rounded-xl bg-cover bg-center shadow`} style={{ backgroundImage: `url(${url})` }} />)}</div></div><div className="relative bg-cover bg-center px-4 py-16" style={{ backgroundImage: `url(${invitation.media.rsvpBackgroundUrl})` }}><div className="absolute inset-0 bg-black/55" /><div className="relative mx-auto max-w-md space-y-12"><section><h3 className="mb-6 text-center font-serif text-3xl text-white">Konfirmasi Kehadiran</h3><form onSubmit={sendRsvp} className={`${card} space-y-4 rounded-2xl border p-6 backdrop-blur-md`}><input value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} maxLength={100} required placeholder="Nama lengkap" className="w-full rounded-xl border border-current/15 bg-transparent px-4 py-3 text-sm" /><div className="flex gap-3">{[true, false].map((value) => <button key={String(value)} type="button" onClick={() => setAttending(value)} className={`flex-1 rounded-xl border py-3 text-sm ${attending === value ? 'bg-sage text-white' : 'border-current/15'}`}>{value ? 'Hadir' : 'Tidak Hadir'}</button>)}</div>{attending && <div className="flex items-center justify-between"><span className="text-sm">Jumlah tamu</span><input type="number" min="1" max="10" value={guestCount} onChange={(event) => setGuestCount(Math.min(10, Math.max(1, Number(event.target.value))))} className="w-20 rounded-lg border border-current/15 bg-transparent px-3 py-2" /></div>}<button disabled={sending || !invitation.id} className="w-full rounded-xl bg-sage py-3 text-sm font-semibold text-white disabled:opacity-50">{invitation.id ? 'Kirim Konfirmasi' : 'Dinonaktifkan pada preview'}</button></form></section><section><h3 className="mb-6 text-center font-serif text-3xl text-white">Wishes &amp; Prayers</h3><div ref={listRef} className="mb-4 max-h-80 space-y-3 overflow-y-auto">{wishes.map((wish) => <article key={wish.id} className={`${card} rounded-2xl border p-5 backdrop-blur-md`}><div className="flex justify-between gap-3"><strong className="text-sm">{wish.name}</strong><span className="text-[10px] opacity-50">{timeAgo(wish.created_at)}</span></div><p className="mt-3 text-sm opacity-75">{wish.message}</p></article>)}</div><form onSubmit={sendWish} className={`${card} space-y-3 rounded-2xl border p-5 backdrop-blur-md`}><input value={wishName} onChange={(event) => setWishName(event.target.value)} maxLength={100} required placeholder="Nama Anda" className="w-full rounded-xl border border-current/15 bg-transparent px-4 py-3 text-sm" /><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} required placeholder="Tuliskan ucapan & doa…" className="w-full resize-none rounded-xl border border-current/15 bg-transparent px-4 py-3 text-sm" /><button disabled={sending || !invitation.id} className="w-full rounded-xl bg-sage py-3 text-sm font-semibold text-white disabled:opacity-50">Kirim Ucapan</button></form>{notice && <p className="mt-4 rounded-xl bg-black/60 p-3 text-center text-xs text-white">{notice}</p>}</section></div></div></div>
}

export function DynamicClosing({ variant }) {
  const { invitation } = useInvitationContext()
  const isDark = variant === 'delta-gray'
  return <div className={`${isDark ? 'text-white' : 'bg-cream text-dark'} relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 text-center`}>{isDark && <><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${invitation.media.coverImageUrl})` }} /><div className="absolute inset-0 bg-black/70" /></>}<div className="relative z-10 mx-auto max-w-xl"><p className="font-serif text-lg leading-relaxed opacity-80">{invitation.closingText}</p><p className="my-10 font-serif text-xl text-blush-dark">{invitation.closingGreeting}</p><h2 className="mb-8 font-serif text-3xl">Kami yang berbahagia</h2><div className="flex flex-col justify-center gap-8 md:flex-row"><div><p className="font-serif text-lg">{invitation.brideFamilyTitle}</p><p className="mt-1 text-sm opacity-60">{invitation.brideFamilyDetail}</p></div><div><p className="font-serif text-lg">{invitation.groomFamilyTitle}</p><p className="mt-1 text-sm opacity-60">{invitation.groomFamilyDetail}</p></div></div>{invitation.media.musicCredit && <p className="mt-16 text-xs italic opacity-50">Music: {invitation.media.musicCredit}</p>}</div></div>
}
