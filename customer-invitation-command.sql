-- Contoh satu command untuk membuat undangan pelanggan.
-- 1. Upload media ke Storage: invitation-assets/customers/{slug}/
-- 2. Ganti seluruh data dan URL contoh di bawah.
-- 3. Jalankan setelah invitation-lifecycle.sql berhasil.

SELECT * FROM public.create_customer_invitation(
  p_slug          => 'siti-nur-alfatihana',
  p_template_slug => 'pink-flower',
  p_expires_at    => '2027-10-24 23:59:59+07'::timestamptz,
  p_data           => $data$
  {
    "couple_name": "Siti & Nur",
    "title": "Pernikahan Siti & Nur",
    "bride_short_name": "Siti",
    "bride_full_name": "Siti Aisyah",
    "bride_parents": "Putri dari Bapak Ahmad dan Ibu Aminah",
    "bride_photo_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/bride.webp",
    "groom_short_name": "Nur",
    "groom_full_name": "Nur Rahman",
    "groom_parents": "Putra dari Bapak Hasan dan Ibu Fatimah",
    "groom_photo_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/groom.webp",
    "wedding_at": "2026-10-24T08:00:00+07:00",
    "timezone": "Asia/Jakarta",
    "location_label": "Jakarta, Indonesia",
    "quote_text": "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.",
    "quote_source": "Q.S. Ar-Rum: 21",
    "intro_text": "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i.",
    "events": [
      {
        "name": "Akad Nikah",
        "dateLabel": "Sabtu, 24 Oktober 2026",
        "timeLabel": "Pukul 08.00 WIB",
        "venue": "Masjid Istiqlal",
        "address": "Jakarta Pusat",
        "mapUrl": "https://maps.google.com/"
      }
    ],
    "love_story": [
      {"title": "Pertama Bertemu", "year": "2020", "text": "Kami mulai saling mengenal."}
    ],
    "cover_image_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/cover.webp",
    "secondary_image_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/secondary.webp",
    "event_image_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/event.webp",
    "rsvp_background_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/rsvp.webp",
    "gallery_urls": [
      "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/gallery/01.webp",
      "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/gallery/02.webp"
    ],
    "music_url": "https://PROJECT.supabase.co/storage/v1/object/public/invitation-assets/customers/siti-nur-alfatihana/music.mp3",
    "music_credit": "Lagu pilihan mempelai",
    "closing_text": "Merupakan kehormatan bagi kami apabila Anda berkenan hadir.",
    "closing_greeting": "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    "bride_family_title": "Keluarga mempelai wanita",
    "bride_family_detail": "Bapak Ahmad & Ibu Aminah",
    "groom_family_title": "Keluarga mempelai pria",
    "groom_family_detail": "Bapak Hasan & Ibu Fatimah"
  }
  $data$::jsonb
);

-- Nonaktifkan sekarang tanpa menghapus data:
-- SELECT * FROM public.archive_customer_invitation('siti-nur-alfatihana');

-- Perpanjang dan aktifkan kembali:
-- SELECT * FROM public.extend_customer_invitation(
--   'siti-nur-alfatihana',
--   '2028-10-24 23:59:59+07'::timestamptz
-- );
