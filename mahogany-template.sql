-- Lembaran Baru: correct duplicate catalog entries, register Mahogany,
-- add optional digital gift, and restrict public invitation reads.
-- Safe to run more than once. Customer invitations are never deleted here.

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS gift JSONB DEFAULT '{"enabled":false}'::jsonb;

UPDATE public.invitations
SET gift = '{"enabled":false}'::jsonb
WHERE gift IS NULL;

CREATE OR REPLACE FUNCTION public.create_customer_invitation(
  p_slug TEXT,
  p_template_slug TEXT,
  p_expires_at TIMESTAMPTZ,
  p_data JSONB
)
RETURNS TABLE(invitation_id UUID, invitation_url TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_template_id UUID;
  v_invitation_id UUID;
  v_bride_short TEXT;
  v_groom_short TEXT;
  v_events JSONB;
  v_love_story JSONB;
  v_gallery JSONB;
  v_gift JSONB;
BEGIN
  p_slug := lower(btrim(p_slug));
  p_template_slug := lower(btrim(p_template_slug));

  IF p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' OR char_length(p_slug) NOT BETWEEN 3 AND 100 THEN
    RAISE EXCEPTION 'Slug harus 3-100 karakter: huruf kecil, angka, dan tanda hubung.';
  END IF;
  IF p_expires_at IS NULL OR p_expires_at <= NOW() THEN
    RAISE EXCEPTION 'expires_at harus berupa tanggal di masa depan.';
  END IF;
  IF p_data IS NULL OR jsonb_typeof(p_data) <> 'object' THEN
    RAISE EXCEPTION 'p_data harus berupa JSON object.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.invitations WHERE slug = p_slug) THEN
    RAISE EXCEPTION 'Slug "%" sedang dipakai. Pilih slug lain atau tunggu sampai data lama dihapus.', p_slug;
  END IF;

  SELECT id INTO v_template_id
  FROM public.templates
  WHERE slug = p_template_slug AND renderer_key IS NOT NULL;
  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Template "%" tidak ditemukan atau belum memiliki renderer_key.', p_template_slug;
  END IF;

  v_bride_short := nullif(btrim(p_data->>'bride_short_name'), '');
  v_groom_short := nullif(btrim(p_data->>'groom_short_name'), '');
  IF v_bride_short IS NULL OR v_groom_short IS NULL THEN
    RAISE EXCEPTION 'bride_short_name dan groom_short_name wajib diisi.';
  END IF;
  IF nullif(btrim(p_data->>'bride_full_name'), '') IS NULL
    OR nullif(btrim(p_data->>'bride_parents'), '') IS NULL
    OR nullif(btrim(p_data->>'groom_full_name'), '') IS NULL
    OR nullif(btrim(p_data->>'groom_parents'), '') IS NULL
    OR nullif(btrim(p_data->>'wedding_at'), '') IS NULL THEN
    RAISE EXCEPTION 'Nama lengkap, orang tua kedua mempelai, dan wedding_at wajib diisi.';
  END IF;

  v_events := COALESCE(p_data->'events', '[]'::jsonb);
  v_love_story := COALESCE(p_data->'love_story', '[]'::jsonb);
  v_gallery := COALESCE(p_data->'gallery_urls', '[]'::jsonb);
  v_gift := COALESCE(p_data->'gift', '{"enabled":false}'::jsonb);
  IF jsonb_typeof(v_events) <> 'array'
    OR jsonb_typeof(v_love_story) <> 'array'
    OR jsonb_typeof(v_gallery) <> 'array' THEN
    RAISE EXCEPTION 'events, love_story, dan gallery_urls harus berupa JSON array.';
  END IF;
  IF jsonb_typeof(v_gift) <> 'object' THEN
    RAISE EXCEPTION 'gift harus berupa JSON object.';
  END IF;

  INSERT INTO public.invitations (
    template_id, template_slug, slug, status, couple_name, is_active, title,
    bride_short_name, bride_full_name, bride_parents, bride_photo_url,
    groom_short_name, groom_full_name, groom_parents, groom_photo_url,
    wedding_at, timezone, location_label, quote_text, quote_source, intro_text,
    events, love_story, cover_image_url, secondary_image_url, event_image_url,
    rsvp_background_url, gallery_urls, music_url, music_credit, closing_text,
    closing_greeting, bride_family_title, bride_family_detail,
    groom_family_title, groom_family_detail, gift, expires_at, archived_at
  ) VALUES (
    v_template_id, p_template_slug, p_slug, 'published',
    COALESCE(nullif(btrim(p_data->>'couple_name'), ''), v_bride_short || ' & ' || v_groom_short),
    true,
    COALESCE(nullif(btrim(p_data->>'title'), ''), 'Pernikahan ' || v_bride_short || ' & ' || v_groom_short),
    v_bride_short, btrim(p_data->>'bride_full_name'), btrim(p_data->>'bride_parents'), nullif(btrim(p_data->>'bride_photo_url'), ''),
    v_groom_short, btrim(p_data->>'groom_full_name'), btrim(p_data->>'groom_parents'), nullif(btrim(p_data->>'groom_photo_url'), ''),
    (p_data->>'wedding_at')::timestamptz,
    COALESCE(nullif(btrim(p_data->>'timezone'), ''), 'Asia/Jakarta'),
    COALESCE(p_data->>'location_label', ''),
    nullif(p_data->>'quote_text', ''), nullif(p_data->>'quote_source', ''), nullif(p_data->>'intro_text', ''),
    v_events, v_love_story,
    nullif(btrim(p_data->>'cover_image_url'), ''), nullif(btrim(p_data->>'secondary_image_url'), ''),
    nullif(btrim(p_data->>'event_image_url'), ''), nullif(btrim(p_data->>'rsvp_background_url'), ''),
    ARRAY(SELECT jsonb_array_elements_text(v_gallery)),
    nullif(btrim(p_data->>'music_url'), ''), nullif(p_data->>'music_credit', ''),
    nullif(p_data->>'closing_text', ''), nullif(p_data->>'closing_greeting', ''),
    nullif(p_data->>'bride_family_title', ''), nullif(p_data->>'bride_family_detail', ''),
    nullif(p_data->>'groom_family_title', ''), nullif(p_data->>'groom_family_detail', ''),
    v_gift, p_expires_at, NULL
  )
  RETURNING id INTO v_invitation_id;

  RETURN QUERY SELECT v_invitation_id, 'https://lembaranbaru.com/undangan/' || p_slug;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_invitation(TEXT, TEXT, TIMESTAMPTZ, JSONB)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_invitation(TEXT, TEXT, TIMESTAMPTZ, JSONB)
TO service_role;

-- Remove permissive public read policies left by older schemas. Policies for
-- private database roles are preserved. Supabase Table Editor uses postgres
-- and is not affected by this public API policy.
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'invitations'
      AND cmd = 'SELECT'
      AND roles && ARRAY['public', 'anon', 'authenticated']::name[]
  LOOP
    EXECUTE format('DROP POLICY %I ON public.invitations', policy_row.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Published invitations are publicly viewable" ON public.invitations;
CREATE POLICY "Published invitations are publicly viewable"
ON public.invitations
FOR SELECT
TO anon, authenticated
USING (
  status = 'published'
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
);

DO $$
DECLARE
  images_type TEXT;
BEGIN
  SELECT udt_name INTO images_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'templates'
    AND column_name = 'images';

  IF images_type = '_text' THEN
    UPDATE public.templates SET
      name = 'Classic Dark',
      subtitle = 'Undangan digital elegan dengan tema gelap minimalis',
      description = 'Undangan digital modern dengan nuansa gelap dan tipografi elegan.',
      style = 'Modern',
      is_featured = true,
      images = ARRAY['/classicdark1.webp', '/classicdark2.webp', '/classicdark3.webp', '/classicdark4.webp', '/classicdark5.webp', '/classicdark6.webp', '/classicdark7.webp', '/classicdark8.webp', '/classicdark9.webp']
    WHERE slug = 'delta-gray';

    UPDATE public.templates SET
      name = 'Romantic Floral',
      subtitle = 'Undangan digital romantis dengan dekorasi bunga',
      description = 'Undangan lembut dengan ilustrasi bunga dan animasi pembuka.',
      style = 'Floral',
      is_featured = true,
      images = ARRAY['/flower1.webp', '/flower2.webp', '/flower3.webp', '/flower4.webp', '/flower5.webp', '/flower6.webp', '/flower7.webp', '/flower8.webp', '/flower9.webp']
    WHERE slug = 'pink-flower';

    UPDATE public.templates SET
      name = 'Javanese Gold',
      subtitle = 'Undangan digital tradisional Jawa dengan aksen emas',
      description = 'Undangan bernuansa Jawa klasik dengan ornamen wayang dan aksen emas.',
      style = 'Classic',
      is_featured = true,
      images = ARRAY['/jawa1.webp', '/jawa2.webp', '/jawa3.webp', '/jawa4.webp', '/jawa5.webp', '/jawa6.webp', '/jawa7.webp', '/jawa8.webp', '/jawa9.webp', '/jawa10.webp']
    WHERE slug = 'javanese';

    INSERT INTO public.templates (
      name, subtitle, description, style, slug, renderer_key,
      is_featured, images
    ) VALUES (
      'Mahogany',
      'Elegant mahogany invitation',
      'An elegant ivory and mahogany invitation with editorial photography.',
      'Classic',
      'mahogany',
      'mahogany',
      false,
      ARRAY[
        '/templates/mahogany/walk.jpg',
        '/templates/mahogany/couple.jpg',
        '/templates/mahogany/rings.jpg'
      ]
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      subtitle = EXCLUDED.subtitle,
      description = EXCLUDED.description,
      style = EXCLUDED.style,
      renderer_key = EXCLUDED.renderer_key,
      is_featured = EXCLUDED.is_featured,
      images = EXCLUDED.images;
  ELSIF images_type = 'jsonb' THEN
    UPDATE public.templates SET
      name = 'Classic Dark',
      subtitle = 'Undangan digital elegan dengan tema gelap minimalis',
      description = 'Undangan digital modern dengan nuansa gelap dan tipografi elegan.',
      style = 'Modern',
      is_featured = true,
      images = '["/classicdark1.webp", "/classicdark2.webp", "/classicdark3.webp", "/classicdark4.webp", "/classicdark5.webp", "/classicdark6.webp", "/classicdark7.webp", "/classicdark8.webp", "/classicdark9.webp"]'::jsonb
    WHERE slug = 'delta-gray';

    UPDATE public.templates SET
      name = 'Romantic Floral',
      subtitle = 'Undangan digital romantis dengan dekorasi bunga',
      description = 'Undangan lembut dengan ilustrasi bunga dan animasi pembuka.',
      style = 'Floral',
      is_featured = true,
      images = '["/flower1.webp", "/flower2.webp", "/flower3.webp", "/flower4.webp", "/flower5.webp", "/flower6.webp", "/flower7.webp", "/flower8.webp", "/flower9.webp"]'::jsonb
    WHERE slug = 'pink-flower';

    UPDATE public.templates SET
      name = 'Javanese Gold',
      subtitle = 'Undangan digital tradisional Jawa dengan aksen emas',
      description = 'Undangan bernuansa Jawa klasik dengan ornamen wayang dan aksen emas.',
      style = 'Classic',
      is_featured = true,
      images = '["/jawa1.webp", "/jawa2.webp", "/jawa3.webp", "/jawa4.webp", "/jawa5.webp", "/jawa6.webp", "/jawa7.webp", "/jawa8.webp", "/jawa9.webp", "/jawa10.webp"]'::jsonb
    WHERE slug = 'javanese';

    INSERT INTO public.templates (
      name, subtitle, description, style, slug, renderer_key,
      is_featured, images
    ) VALUES (
      'Mahogany',
      'Elegant mahogany invitation',
      'An elegant ivory and mahogany invitation with editorial photography.',
      'Classic',
      'mahogany',
      'mahogany',
      false,
      '["/templates/mahogany/walk.jpg", "/templates/mahogany/couple.jpg", "/templates/mahogany/rings.jpg"]'::jsonb
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      subtitle = EXCLUDED.subtitle,
      description = EXCLUDED.description,
      style = EXCLUDED.style,
      renderer_key = EXCLUDED.renderer_key,
      is_featured = EXCLUDED.is_featured,
      images = EXCLUDED.images;
  ELSE
    RAISE EXCEPTION 'Tipe kolom templates.images tidak didukung: %', images_type;
  END IF;
END $$;

-- Delete only duplicate product rows that are not referenced by any invitation.
-- Referenced legacy rows stay in the database, but the storefront hides them
-- because they do not have renderer_key.
DELETE FROM public.templates AS legacy
WHERE legacy.slug IN ('classic-dark', 'romantic-floral', 'javanese-gold')
  AND NOT EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.template_id = legacy.id
       OR invitations.template_slug = legacy.slug
  );

SELECT slug, renderer_key, name, is_featured, images
FROM public.templates
WHERE renderer_key IS NOT NULL
ORDER BY created_at, slug;

SELECT slug AS retained_legacy_slug
FROM public.templates
WHERE slug IN ('classic-dark', 'romantic-floral', 'javanese-gold')
ORDER BY slug;

SELECT policyname, roles, cmd, qual AS using_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'invitations'
  AND cmd = 'SELECT'
ORDER BY policyname;
