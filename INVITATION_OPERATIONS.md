# Invitation operations

## One-time setup

1. Open the Supabase SQL Editor and run `supabase-schema.sql`.
2. Confirm that `templates`, `invitations`, `invitation_rsvps`, and `invitation_wishes` exist.
3. Confirm that Storage contains the public `invitation-assets` bucket.
4. Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured in the Vercel project.
5. If you already had invitation rows before this setup, open `invitations` and set `status` to `published` only for invitations that should stay publicly visible.

## Create a customer invitation

1. In Storage, create a folder named after the invitation slug, for example `siti-nur`, and upload the couple's images and optional music.
2. Copy each public asset URL.
3. In Table Editor → `invitations`, create a row. Use a lowercase hyphenated slug, select one of the three template IDs, and leave `status` as `draft`.
4. Fill the couple, date, copy, media, and family fields. `events` and `love_story` are JSON arrays; `gallery_urls` is a PostgreSQL text array.
5. Test the design with `/preview/pink-flower`, `/preview/delta-gray`, or `/preview/javanese`. Draft customer rows deliberately return the public not-found page.
6. Change `status` to `published`, then verify `https://lembaranbaru.com/undangan/{slug}`.
7. Share personalized guest links as `https://lembaranbaru.com/undangan/{slug}?to=Nama+Tamu`.

Example `events` value:

```json
[
  {"name":"Akad Nikah","dateLabel":"Sabtu, 24 Oktober 2026","timeLabel":"Pukul 08:00 WIB","venue":"Masjid Istiqlal","address":"Jakarta Pusat","mapUrl":"https://maps.google.com/..."},
  {"name":"Resepsi","dateLabel":"Sabtu, 24 Oktober 2026","timeLabel":"Pukul 11:00 WIB","venue":"Graha Cempaka","address":"Jakarta","mapUrl":"https://maps.google.com/..."}
]
```

Example `love_story` value:

```json
[{"title":"Pertama Bertemu","year":"2020","text":"Cerita singkat pasangan."}]
```

## Publishing and responses

- `draft` rows are not readable with the anonymous website key.
- RSVP records are stored in `invitation_rsvps` and wishes in `invitation_wishes`, each linked by `invitation_id`.
- To take an invitation offline without deleting data, change it back to `draft`.
- Existing standalone Vercel projects still use their legacy response tables and are not changed by this migration.
