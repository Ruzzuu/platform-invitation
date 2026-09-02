-- Lembaran Baru invitation lifecycle migration
-- Safe to run after supabase-schema.sql. Existing invitations are preserved.

ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS template_slug TEXT;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS couple_name TEXT;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS gift JSONB DEFAULT '{"enabled":false}'::jsonb;

UPDATE public.invitations i
SET template_slug = t.slug
FROM public.templates t
WHERE i.template_id = t.id AND i.template_slug IS NULL;

UPDATE public.invitations
SET couple_name = concat_ws(' & ', bride_short_name, groom_short_name)
WHERE couple_name IS NULL;

UPDATE public.invitations SET is_active = true WHERE is_active IS NULL;
UPDATE public.invitations SET gift = '{"enabled":false}'::jsonb WHERE gift IS NULL;

ALTER TABLE public.invitations DROP CONSTRAINT IF EXISTS invitations_status_check;
ALTER TABLE public.invitations ADD CONSTRAINT invitations_status_check
  CHECK (status IN ('draft', 'published', 'archived')) NOT VALID;

DROP POLICY IF EXISTS "Published invitations are publicly viewable" ON public.invitations;
CREATE POLICY "Published invitations are publicly viewable"
ON public.invitations FOR SELECT
USING (
  status = 'published'
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
);

DROP POLICY IF EXISTS "Public can RSVP to published invitations" ON public.invitation_rsvps;
CREATE POLICY "Public can RSVP to published invitations"
ON public.invitation_rsvps FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = invitation_id
      AND invitations.status = 'published'
      AND invitations.is_active = true
      AND (invitations.expires_at IS NULL OR invitations.expires_at > NOW())
  )
);

DROP POLICY IF EXISTS "Published invitation wishes are publicly viewable" ON public.invitation_wishes;
CREATE POLICY "Published invitation wishes are publicly viewable"
ON public.invitation_wishes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = invitation_id
      AND invitations.status = 'published'
      AND invitations.is_active = true
      AND (invitations.expires_at IS NULL OR invitations.expires_at > NOW())
  )
);

DROP POLICY IF EXISTS "Public can wish published invitations" ON public.invitation_wishes;
CREATE POLICY "Public can wish published invitations"
ON public.invitation_wishes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = invitation_id
      AND invitations.status = 'published'
      AND invitations.is_active = true
      AND (invitations.expires_at IS NULL OR invitations.expires_at > NOW())
  )
);

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
  IF jsonb_typeof(v_events) <> 'array' OR jsonb_typeof(v_love_story) <> 'array' OR jsonb_typeof(v_gallery) <> 'array' THEN
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

CREATE OR REPLACE FUNCTION public.archive_customer_invitation(p_slug TEXT)
RETURNS TABLE(invitation_id UUID, invitation_url TEXT, archived_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id UUID;
  v_archived_at TIMESTAMPTZ := NOW();
BEGIN
  UPDATE public.invitations
  SET status = 'archived', is_active = false, archived_at = v_archived_at
  WHERE slug = lower(btrim(p_slug))
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN RAISE EXCEPTION 'Undangan "%" tidak ditemukan.', p_slug; END IF;
  RETURN QUERY SELECT v_id, 'https://lembaranbaru.com/undangan/' || lower(btrim(p_slug)), v_archived_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.extend_customer_invitation(p_slug TEXT, p_expires_at TIMESTAMPTZ)
RETURNS TABLE(invitation_id UUID, invitation_url TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF p_expires_at IS NULL OR p_expires_at <= NOW() THEN
    RAISE EXCEPTION 'Tanggal perpanjangan harus berada di masa depan.';
  END IF;
  UPDATE public.invitations
  SET status = 'published', is_active = true, expires_at = p_expires_at, archived_at = NULL
  WHERE slug = lower(btrim(p_slug))
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN RAISE EXCEPTION 'Undangan "%" tidak ditemukan.', p_slug; END IF;
  RETURN QUERY SELECT v_id, 'https://lembaranbaru.com/undangan/' || lower(btrim(p_slug)), p_expires_at;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_invitation(TEXT, TEXT, TIMESTAMPTZ, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.archive_customer_invitation(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.extend_customer_invitation(TEXT, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_invitation(TEXT, TEXT, TIMESTAMPTZ, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.archive_customer_invitation(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.extend_customer_invitation(TEXT, TIMESTAMPTZ) TO service_role;

SELECT 'Invitation lifecycle migration completed.' AS result;
