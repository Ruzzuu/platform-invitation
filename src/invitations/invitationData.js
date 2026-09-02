const DEFAULT_QUOTE = 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri, agar kamu merasa tenteram kepadanya. Dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.'

const ASSETS = {
  'delta-gray': '/templates/delta-gray',
  'pink-flower': '/templates/pink-flower',
  javanese: '/templates/javanese',
  mahogany: '/templates/mahogany',
}

const MAHOGANY_SOURCE_ASSETS = '/templates/mahogany/source'

export function templateAsset(rendererKey, file) {
  return `${ASSETS[rendererKey] || ASSETS['pink-flower']}/${file}`
}

export function createSampleInvitation(rendererKey = 'pink-flower') {
  const isDark = rendererKey === 'delta-gray'
  const isJavanese = rendererKey === 'javanese'
  const isMahogany = rendererKey === 'mahogany'
  const base = ASSETS[rendererKey] || ASSETS['pink-flower']
  const bride = isMahogany ? 'Alfa' : isJavanese ? 'Endah' : isDark ? 'Putri' : 'Milea'
  const groom = isMahogany ? 'Rizaldy' : isJavanese ? 'Gilang' : isDark ? 'Anto' : 'Dilan'

  return {
    id: null,
    slug: 'contoh-undangan',
    status: 'preview',
    rendererKey,
    title: `Pernikahan ${bride} & ${groom}`,
    bride: { shortName: bride, fullName: isMahogany ? 'Siti Nur Alfatihana, S.KM.' : `${bride} Angelina`, parents: isMahogany ? 'Putri dari Bpk. Alit Tasrifuddin dan Ibu Riana Resmi' : 'Putri dari Bapak Ahmad dan Ibu Aminah', photoUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/bride.webp` : isDark ? `${base}/perempuan.webp` : `${base}/wanita.webp` },
    groom: { shortName: groom, fullName: isMahogany ? 'Mochammad Rizaldy Irawan, A.Md.' : `${groom} Renaldi`, parents: isMahogany ? 'Putra dari Bpk. Mochamad Erwan Boedi Santoso, S.Sos. dan Ibu Faizah Juniati' : 'Putra dari Bapak Hasan dan Ibu Fatimah', photoUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/groom.webp` : isDark ? `${base}/laki.webp` : `${base}/pria.webp` },
    weddingAt: isMahogany ? '2026-09-05T09:00:00+07:00' : '2026-10-24T08:00:00+07:00',
    timezone: 'Asia/Jakarta',
    locationLabel: isMahogany ? 'Jakarta, Indonesia' : 'Jakarta, Indonesia',
    quoteText: DEFAULT_QUOTE,
    quoteSource: 'Q.S. Ar-Rum : 21',
    introText: isMahogany
      ? 'By the grace of God, we are pleased to announce our wedding to you, our family and friends.'
      : 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami.',
    events: isMahogany
      ? [
          { name: 'Akad Nikah', dateLabel: 'Sabtu, 5 September 2026', timeLabel: 'Pukul 09:00 WIB', venue: 'Lokasi Acara', address: 'Akad nikah dan ramah tamah dilaksanakan di tempat yang sama.', mapUrl: 'https://www.google.com/maps?q=-8.401123,114.273621' },
          { name: 'Ramah Tamah', dateLabel: 'Sabtu, 5 September 2026', timeLabel: 'Pukul 11:00 WIB', venue: 'Lokasi Acara', address: 'Akad nikah dan ramah tamah dilaksanakan di tempat yang sama.', mapUrl: 'https://www.google.com/maps?q=-8.401123,114.273621' },
        ]
      : [
          { name: 'Akad Nikah', dateLabel: 'Sabtu, 24 Oktober 2026', timeLabel: 'Pukul 08:00 WIB', venue: 'Masjid Istiqlal', address: 'Jakarta Pusat', mapUrl: 'https://maps.google.com/' },
          { name: 'Resepsi', dateLabel: 'Sabtu, 24 Oktober 2026', timeLabel: 'Pukul 11:00 WIB', venue: 'Graha Cempaka', address: 'Jakarta', mapUrl: 'https://maps.google.com/' },
        ],
    loveStory: isMahogany
      ? [
          { title: 'First Meet', year: '2022', text: 'Bulan Oktober 2022 pertama kali bertemu ngopi bareng di coffee shop.' },
          { title: 'Relationship', year: '2022', text: '4 Desember 2022 kami memutuskan untuk mencoba mengenal satu sama lain sebagai sepasang kekasih.' },
          { title: 'Engagement', year: '2025', text: '5 September 2025 kami melangkah ke jenjang yang lebih serius.' },
          { title: 'Married', year: '2026', text: 'Dengan izin Allah SWT. dan keluarga, kami memutuskan untuk menikah pada 5 September 2026.' },
        ]
      : [
          { title: 'Pertama Bertemu', year: '2018', text: 'Kami pertama kali bertemu dan mulai saling mengenal.' },
          { title: 'Menjalin Hubungan', year: '2020', text: 'Perjalanan bersama membuat kami semakin yakin satu sama lain.' },
          { title: 'Lamaran', year: '2025', text: 'Kedua keluarga bertemu dan merestui langkah kami.' },
          { title: 'Menikah', year: '2026', text: 'Kami mengikat janji suci dan memulai perjalanan baru.' },
        ],
    media: {
      coverImageUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/together.jpeg` : isDark ? `${base}/foto.webp` : `${base}/pose1.webp`,
      secondaryImageUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/together.jpeg` : isDark ? `${base}/foto.webp` : `${base}/pose2.webp`,
      homeBackgroundUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/together.jpeg` : isDark ? `${base}/foto.webp` : `${base}/pose2.webp`,
      eventImageUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/together.jpeg` : isDark ? `${base}/foto.webp` : `${base}/pose3.webp`,
      rsvpBackgroundUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/together.jpeg` : isDark ? `${base}/foto.webp` : `${base}/pose3.webp`,
      closingBackgroundUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/together.jpeg` : isDark ? `${base}/foto.webp` : `${base}/pose3.webp`,
      musicUrl: isMahogany ? `${MAHOGANY_SOURCE_ASSETS}/wedding-music.mp3` : isDark ? `${base}/Nadhif Basalamah kota ini tak sama tanpamu.mp3` : isJavanese ? `${base}/Epic Orchestra Java Cinematic Javanese Orchestra Background Music.mp3` : '',
      musicCredit: isMahogany ? 'Nadhif Basalamah - Bergema Sampai Selamanya' : isJavanese ? 'Javanese Cinematic Orchestra' : 'Lagu pilihan mempelai',
      galleryUrls: isMahogany
        ? Array.from({ length: 6 }, (_, index) => `${MAHOGANY_SOURCE_ASSETS}/foto${index + 1}.jpeg`)
        : isDark
        ? [`${base}/foto.webp`, `${base}/laki.webp`, `${base}/perempuan.webp`]
        : [`${base}/pose1.webp`, `${base}/pose2.webp`, `${base}/pose3.webp`, `${base}/pria.webp`, `${base}/wanita.webp`],
    },
    closingText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan do'a restu kepada putra-putri kami.",
    closingGreeting: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    brideFamilyTitle: isMahogany ? 'Kel. Bpk. Mochamad Erwan Boedi Santoso, S.Sos.' : 'Keluarga mempelai wanita',
    brideFamilyDetail: isMahogany ? 'Ibu Faizah Juniati' : 'Bapak Ahmad & Ibu Aminah',
    groomFamilyTitle: isMahogany ? 'Kel. Bpk. Alit Tasrifuddin' : 'Keluarga mempelai pria',
    groomFamilyDetail: isMahogany ? 'Ibu Riana Resmi' : 'Bapak Hasan & Ibu Fatimah',
    gift: isMahogany
      ? { enabled: true, bankName: 'Bank Demo', accountNumber: '0000 0000 0000', accountHolder: 'NADIRA ANGELINA' }
      : { enabled: false, bankName: '', accountNumber: '', accountHolder: '' },
  }
}

export function normalizeInvitationRow(row) {
  const rendererKey = row.templates?.renderer_key || row.renderer_key || row.template_slug || 'pink-flower'
  const fallback = createSampleInvitation(rendererKey)
  const gift = row.gift && typeof row.gift === 'object' && !Array.isArray(row.gift) ? row.gift : {}
  const bankName = gift.bank_name || gift.bankName || ''
  const accountNumber = gift.account_number || gift.accountNumber || ''
  const accountHolder = gift.account_holder || gift.accountHolder || ''
  return {
    ...fallback,
    id: row.id,
    slug: row.slug,
    status: row.status,
    rendererKey,
    title: row.title || fallback.title,
    bride: {
      shortName: row.bride_short_name || fallback.bride.shortName,
      fullName: row.bride_full_name || fallback.bride.fullName,
      parents: row.bride_parents || fallback.bride.parents,
      photoUrl: row.bride_photo_url || fallback.bride.photoUrl,
    },
    groom: {
      shortName: row.groom_short_name || fallback.groom.shortName,
      fullName: row.groom_full_name || fallback.groom.fullName,
      parents: row.groom_parents || fallback.groom.parents,
      photoUrl: row.groom_photo_url || fallback.groom.photoUrl,
    },
    weddingAt: row.wedding_at || fallback.weddingAt,
    timezone: row.timezone || 'Asia/Jakarta',
    locationLabel: row.location_label || fallback.locationLabel,
    quoteText: row.quote_text || DEFAULT_QUOTE,
    quoteSource: row.quote_source || fallback.quoteSource,
    introText: row.intro_text || fallback.introText,
    events: Array.isArray(row.events) ? row.events : fallback.events,
    loveStory: Array.isArray(row.love_story) ? row.love_story : [],
    media: {
      coverImageUrl: row.cover_image_url || fallback.media.coverImageUrl,
      secondaryImageUrl: row.secondary_image_url || fallback.media.secondaryImageUrl,
      homeBackgroundUrl: row.home_background_url || row.secondary_image_url || fallback.media.homeBackgroundUrl,
      eventImageUrl: row.event_image_url || fallback.media.eventImageUrl,
      rsvpBackgroundUrl: row.rsvp_background_url || row.event_image_url || fallback.media.rsvpBackgroundUrl,
      closingBackgroundUrl: row.closing_background_url || row.rsvp_background_url || fallback.media.closingBackgroundUrl,
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
    gift: {
      enabled: gift.enabled === true && Boolean(bankName && accountNumber && accountHolder),
      bankName,
      accountNumber,
      accountHolder,
    },
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
