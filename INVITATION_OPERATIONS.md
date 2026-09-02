# Operasional undangan pelanggan

## 1. Setup satu kali

1. Jalankan seluruh isi `supabase-schema.sql` di Supabase SQL Editor jika schema utama belum pernah dipasang.
2. Jalankan seluruh isi `invitation-lifecycle.sql`. Migrasi ini tidak menghapus undangan yang sudah ada.
3. Pastikan Storage memiliki bucket publik `invitation-assets`.
4. Pastikan Vercel memiliki `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` untuk Production.
5. Salin `.env.admin.example` menjadi `.env.admin`, lalu isi URL proyek dan service-role key. File ini hanya untuk komputer admin dan sudah diabaikan Git.

Undangan lama sengaja tetap memiliki `expires_at = NULL` agar migrasi tidak tiba-tiba mematikannya. Atur masa aktif undangan lama secara eksplisit:

```sql
UPDATE public.invitations
SET expires_at = '2027-10-24 23:59:59+07'::timestamptz
WHERE slug = 'siti-nur-alfatihana';
```

Jangan memasukkan `SUPABASE_SERVICE_ROLE_KEY` ke Vercel, source code, browser, atau chat. Key tersebut dapat melewati RLS dan hanya dipakai oleh command penghapusan lokal.

## 2. Menerima dan meng-upload media pelanggan

Pelanggan dapat mengirim file lewat WhatsApp atau Google Drive. SQL tidak dapat menerima file foto atau MP3 secara langsung, jadi media di-upload terlebih dahulu:

1. Buka Supabase → Storage → `invitation-assets`.
2. Buat folder `customers/{slug}`, misalnya `customers/siti-nur-alfatihana`.
3. Upload dengan struktur yang konsisten:

```text
customers/siti-nur-alfatihana/
├── cover.webp
├── bride.webp
├── groom.webp
├── secondary.webp
├── event.webp
├── rsvp.webp
├── music.mp3
└── gallery/
    ├── 01.webp
    └── 02.webp
```

4. Untuk setiap file, gunakan menu **Get URL** atau **Copy public URL**.
5. Tempel URL tersebut pada command pembuatan undangan.

Gunakan WebP untuk foto bila memungkinkan. Nama file boleh berbeda, tetapi seluruh media satu pelanggan harus tetap berada dalam folder `customers/{slug}` agar command purge dapat membersihkannya.

## 3. Membuat undangan dengan satu command SQL

1. Buka `customer-invitation-command.sql`.
2. Salin isinya ke Supabase SQL Editor.
3. Ganti slug, template, tanggal masa aktif, teks, acara, dan seluruh URL media.
4. Jalankan command.

Template yang tersedia:

```text
pink-flower
delta-gray
javanese
```

Jika berhasil, hasil query berisi `invitation_id` dan link siap dibagikan:

```text
https://lembaranbaru.com/undangan/{slug}
```

Link tamu yang dipersonalisasi:

```text
https://lembaranbaru.com/undangan/{slug}?to=Nama+Tamu
```

Slug yang masih aktif atau berada dalam masa arsip tidak dapat digunakan ulang. Fungsi akan memberikan error dan tidak mengubah data lain.

## 4. Masa aktif, nonaktif, dan perpanjangan

Undangan otomatis tidak dapat dibuka setelah `expires_at`. RSVP dan ucapan juga otomatis ditutup. Data serta media belum dihapus dan disimpan selama minimal 30 hari.

Untuk menonaktifkan lebih awal:

```sql
SELECT * FROM public.archive_customer_invitation('siti-nur-alfatihana');
```

Untuk memperpanjang sekaligus mengaktifkan kembali:

```sql
SELECT * FROM public.extend_customer_invitation(
  'siti-nur-alfatihana',
  '2028-10-24 23:59:59+07'::timestamptz
);
```

## 5. Menghapus permanen setelah 30 hari

Pastikan `.env.admin` berisi:

```text
SUPABASE_URL=https://PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=KEY_SERVER_ADMIN
```

Jalankan dari folder proyek:

```bash
npm run invitation:purge -- siti-nur-alfatihana
```

Command menampilkan data target dan meminta Anda mengetik ulang slug. Setelah dikonfirmasi, command akan:

1. Menghapus file dalam `invitation-assets/customers/{slug}` serta folder legacy `{slug}`.
2. Menghapus RSVP dan ucapan legacy yang memakai `invitation_slug`.
3. Menghapus baris invitation; RSVP dan ucapan baru ikut terhapus melalui foreign-key cascade.
4. Melepaskan slug agar dapat digunakan pelanggan lain.

Command menolak penghapusan jika masa kedaluwarsa/arsip belum lewat 30 hari. Jika proses gagal sebagian, perbaiki penyebabnya lalu jalankan command yang sama kembali.

## 6. Pemeriksaan cepat

Lihat status satu pelanggan tanpa mengubah data:

```sql
SELECT
  slug,
  status,
  is_active,
  expires_at,
  archived_at,
  CASE
    WHEN status = 'published'
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
    THEN 'online'
    ELSE 'offline'
  END AS website_state
FROM public.invitations
WHERE slug = 'siti-nur-alfatihana';
```
