const DEFAULT_QUOTE = 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup agar kamu merasa tenteram di sampingnya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.'

const ASSETS = {
  'delta-gray': '/templates/delta-gray',
  'pink-flower': '/templates/pink-flower',
  javanese: '/templates/javanese',
}

export function templateAsset(rendererKey, file) {
  return `${ASSETS[rendererKey] || ASSETS['pink-flower']}/${file}`
}

export function createSampleInvitation(rendererKey = 'pink-flower') {
  const isDark = rendererKey === 'delta-gray'
  const isJavanese = rendererKey === 'javanese'
  const base = ASSETS[rendererKey] || ASSETS['pink-flower']
  const bride = isJavanese ? 'Endah' : isDark ? 'Putri' : 'Milea'
  const groom = isJavanese ? 'Gilang' : isDark ? 'Anto' : 'Dilan'

  return {
    id: null,
    slug: 'contoh-undangan',
    status: 'preview',
    rendererKey,
    title: `Pernikahan ${bride} & ${groom}`,
    bride: { shortName: bride, fullName: `${bride} Angelina`, parents: 'Putri dari Bapak Ahmad dan Ibu Aminah', photoUrl: isDark ? `${base}/perempuan.webp` : `${base}/wanita.webp` },
    groom: { shortName: groom, fullName: `${groom} Renaldi`, parents: 'Putra dari Bapak Hasan dan Ibu Fatimah', photoUrl: isDark ? `${base}/laki.webp` : `${base}/pria.webp` },
    weddingAt: '2026-10-24T08:00:00+07:00',
    timezone: 'Asia/Jakarta',
    locationLabel: 'Jakarta, Indonesia',
    quoteText: DEFAULT_QUOTE,
    quoteSource: 'Q.S. Ar-Rum : 21',
    introText: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami.',
    events: [
      { name: 'Akad Nikah', dateLabel: 'Sabtu, 24 Oktober 2026', timeLabel: 'Pukul 08:00 WIB', venue: 'Masjid Istiqlal', address: 'Jakarta Pusat', mapUrl: 'https://maps.google.com/' },
      { name: 'Resepsi', dateLabel: 'Sabtu, 24 Oktober 2026', timeLabel: 'Pukul 11:00 WIB', venue: 'Graha Cempaka', address: 'Jakarta', mapUrl: 'https://maps.google.com/' },
    ],
    loveStory: [
      { title: 'Pertama Bertemu', year: '2018', text: 'Kami pertama kali bertemu dan mulai saling mengenal.' },
      { title: 'Menjalin Hubungan', year: '2020', text: 'Perjalanan bersama membuat kami semakin yakin satu sama lain.' },
      { title: 'Lamaran', year: '2025', text: 'Kedua keluarga bertemu dan merestui langkah kami.' },
      { title: 'Menikah', year: '2026', text: 'Kami mengikat janji suci dan memulai perjalanan baru.' },
    ],
    media: {
      coverImageUrl: isDark ? `${base}/foto.webp` : `${base}/pose1.webp`,
      secondaryImageUrl: isDark ? `${base}/foto.webp` : `${base}/pose2.webp`,
      eventImageUrl: isDark ? `${base}/foto.webp` : `${base}/pose3.webp`,
      rsvpBackgroundUrl: isDark ? `${base}/foto.webp` : `${base}/pose3.webp`,
      musicUrl: isDark ? `${base}/Nadhif Basalamah kota ini tak sama tanpamu.mp3` : isJavanese ? `${base}/Epic Orchestra Java Cinematic Javanese Orchestra Background Music.mp3` : '',
      musicCredit: isJavanese ? 'Javanese Cinematic Orchestra' : 'Lagu pilihan mempelai',
      galleryUrls: isDark
        ? [`${base}/foto.webp`, `${base}/laki.webp`, `${base}/perempuan.webp`]
        : [`${base}/pose1.webp`, `${base}/pose2.webp`, `${base}/pose3.webp`, `${base}/pria.webp`, `${base}/wanita.webp`],
    },
    closingText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan do'a restu kepada putra-putri kami.",
    closingGreeting: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    brideFamilyTitle: 'Keluarga mempelai wanita',
    brideFamilyDetail: 'Bapak Ahmad & Ibu Aminah',
    groomFamilyTitle: 'Keluarga mempelai pria',
    groomFamilyDetail: 'Bapak Hasan & Ibu Fatimah',
  }
}

export function normalizeInvitationRow(row) {
  const rendererKey = row.templates?.renderer_key || row.renderer_key || 'pink-flower'
  const fallback = createSampleInvitation(rendererKey)
  return {
    ...fallback,
    id: row.id,
    slug: row.slug,
    status: row.status,
    rendererKey,
    title: row.title || fallback.title,
    bride: {
      shortName: row.bride_short_name,
      fullName: row.bride_full_name,
      parents: row.bride_parents,
      photoUrl: row.bride_photo_url || fallback.bride.photoUrl,
    },
    groom: {
      shortName: row.groom_short_name,
      fullName: row.groom_full_name,
      parents: row.groom_parents,
      photoUrl: row.groom_photo_url || fallback.groom.photoUrl,
    },
    weddingAt: row.wedding_at,
    timezone: row.timezone || 'Asia/Jakarta',
    locationLabel: row.location_label,
    quoteText: row.quote_text || DEFAULT_QUOTE,
    quoteSource: row.quote_source || fallback.quoteSource,
    introText: row.intro_text || fallback.introText,
    events: Array.isArray(row.events) ? row.events : fallback.events,
    loveStory: Array.isArray(row.love_story) ? row.love_story : [],
    media: {
      coverImageUrl: row.cover_image_url || fallback.media.coverImageUrl,
      secondaryImageUrl: row.secondary_image_url || fallback.media.secondaryImageUrl,
      eventImageUrl: row.event_image_url || fallback.media.eventImageUrl,
      rsvpBackgroundUrl: row.rsvp_background_url || row.event_image_url || fallback.media.rsvpBackgroundUrl,
      musicUrl: row.music_url || '',
      musicCredit: row.music_credit || '',
      galleryUrls: row.gallery_urls?.length ? row.gallery_urls : fallback.media.galleryUrls,
    },
    closingText: row.closing_text || fallback.closingText,
    closingGreeting: row.closing_greeting || fallback.closingGreeting,
    brideFamilyTitle: row.bride_family_title || fallback.brideFamilyTitle,
    brideFamilyDetail: row.bride_family_detail || fallback.brideFamilyDetail,
    groomFamilyTitle: row.groom_family_title || fallback.groomFamilyTitle,
    groomFamilyDetail: row.groom_family_detail || fallback.groomFamilyDetail,
  }
}

export function formatWeddingDate(invitation) {
  if (!invitation?.weddingAt) return ''
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeZone: invitation.timezone }).format(new Date(invitation.weddingAt))
}

export function calendarUrl(invitation) {
  const start = new Date(invitation.weddingAt)
  const end = new Date(start.getTime() + 6 * 60 * 60 * 1000)
  const compact = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: invitation.title,
    dates: `${compact(start)}/${compact(end)}`,
    details: invitation.introText,
    location: invitation.locationLabel,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
