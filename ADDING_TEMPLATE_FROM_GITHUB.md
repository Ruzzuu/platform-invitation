# Menambahkan template dari GitHub dengan aman

Panduan ini memakai `invitation-mahogony` sebagai contoh. Repository asli dan deployment client tetap berdiri sendiri; project itu hanya menjadi referensi desain.

## 1. Clone ke folder sementara

Jangan clone repository template ke dalam atau menimpa `platform-invitation`.

```bash
git clone --depth 1 https://github.com/Ruzzuu/invitation-mahogony.git /tmp/invitation-mahogony-reference
```

Perintah tersebut membuat salinan kerja sementara. Mengubah salinan ini tidak mengubah GitHub maupun website client sampai Anda sengaja melakukan commit dan push ke repository asal.

## 2. Port desain ke platform

Yang dipindahkan ke platform adalah struktur tampilan dan interaksinya. Semua bagian berikut harus diubah menjadi data dinamis dari `InvitationContext`:

- nama dan biodata kedua mempelai;
- tanggal, lokasi, rangkaian acara, dan tautan peta;
- foto, galeri, dan musik;
- cerita, kutipan, serta teks penutup;
- rekening hadiah (opsional);
- RSVP dan ucapan yang harus memakai `invitation_id`.

Jangan menyalin `.env`, Supabase key, rekening, atau foto client lama.

## 3. Daftarkan renderer

Tambahkan renderer ke `src/invitations/templateRegistry.jsx` dan data preview netral ke `src/invitations/invitationData.js`. Untuk Mahogany, renderer key resminya adalah `mahogany`; alias `mahogony` tetap diterima untuk menghindari salah eja.

## 4. Uji lokal

```bash
npm run dev
```

Buka:

- `http://localhost:5173/preview/mahogany`
- `http://localhost:5173/preview/pink-flower`
- `http://localhost:5173/preview/delta-gray`
- `http://localhost:5173/preview/javanese`

Lalu pastikan build produksi berhasil:

```bash
npm run build
```

## 5. Simpan dan deploy code

Periksa perubahan sebelum commit:

```bash
git status
git diff --check
git add src public/templates/mahogany tailwind.config.js
git commit -m "add Mahogany invitation template"
git push
```

Jika Vercel terhubung ke branch tersebut, push akan membuat deployment baru. Tunggu sampai status deployment `Ready`, lalu tes `/preview/mahogany` pada domain produksi.

## 6. Daftarkan template di Supabase

Setelah code produksi berhasil, buka Supabase SQL Editor, salin seluruh isi `mahogany-template.sql`, lalu klik **Run**. File ini:

- tidak menghapus undangan client;
- menambah dukungan gift opsional;
- memperbarui command pembuatan undangan;
- menambah Mahogany ke katalog sebagai template biasa, bukan featured.

Hasil terakhir harus menampilkan satu baris dengan `slug = mahogany` dan `renderer_key = mahogany`.

Katalog memakai `catalog_visible`: row produk yang dilihat pengunjung terpisah dari row teknis renderer. Jangan menghapus row teknis karena undangan customer lama dapat mereferensikannya.

## 7. Buat undangan customer Mahogany

Upload media customer ke bucket:

```text
invitation-assets/customers/{slug}/
```

Salin `customer-invitation-command.sql`, ganti `p_template_slug` menjadi `mahogany`, ganti semua data/URL, dan jalankan satu kali. Link customer tetap berbentuk:

```text
https://lembaranbaru.com/undangan/{slug}
```

Nama template tidak perlu ada di URL. Dengan begitu, template customer bisa diganti di database tanpa mengubah link yang sudah disebarkan.

Untuk menampilkan hadiah digital, isi:

```json
"gift": {
  "enabled": true,
  "bank_name": "Nama bank",
  "account_number": "Nomor rekening",
  "account_holder": "Nama pemilik rekening"
}
```

Gunakan `"enabled": false` jika bagian hadiah tidak dibutuhkan.
