-- Lembaran Baru unified storefront + multi-tenant invitations
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  style TEXT,
  price INTEGER DEFAULT 80000 CHECK (price >= 0),
  price_display TEXT DEFAULT 'Rp 80.000',
  is_featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  renderer_key TEXT UNIQUE,
  images JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  formats JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(2,1) DEFAULT 5 CHECK (rating BETWEEN 0 AND 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  demo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe additions for projects that already have the original templates table.
ALTER TABLE templates ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE templates ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS style TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 80000;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS price_display TEXT DEFAULT 'Rp 80.000';
ALTER TABLE templates ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS renderer_key TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS formats JSONB DEFAULT '[]'::jsonb;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 5;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE templates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE templates SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE templates SET price = 80000 WHERE price IS NULL;
UPDATE templates SET price_display = 'Rp 80.000' WHERE price_display IS NULL;
UPDATE templates SET is_featured = false WHERE is_featured IS NULL;
UPDATE templates SET rating = 5 WHERE rating IS NULL;
UPDATE templates SET review_count = 0 WHERE review_count IS NULL;
UPDATE templates SET created_at = NOW() WHERE created_at IS NULL;
UPDATE templates SET updated_at = NOW() WHERE updated_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_id_unique ON templates(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_slug_unique ON templates(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_templates_renderer_key ON templates(renderer_key) WHERE renderer_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
  template_slug TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK (slug = lower(slug) AND slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 100),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  couple_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  bride_short_name TEXT NOT NULL CHECK (char_length(bride_short_name) BETWEEN 1 AND 80),
  bride_full_name TEXT NOT NULL CHECK (char_length(bride_full_name) BETWEEN 1 AND 160),
  bride_parents TEXT NOT NULL CHECK (char_length(bride_parents) <= 500),
  bride_photo_url TEXT,
  groom_short_name TEXT NOT NULL CHECK (char_length(groom_short_name) BETWEEN 1 AND 80),
  groom_full_name TEXT NOT NULL CHECK (char_length(groom_full_name) BETWEEN 1 AND 160),
  groom_parents TEXT NOT NULL CHECK (char_length(groom_parents) <= 500),
  groom_photo_url TEXT,
  wedding_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  location_label TEXT NOT NULL DEFAULT '',
  quote_text TEXT,
  quote_source TEXT,
  intro_text TEXT,
  events JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(events) = 'array'),
  love_story JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(love_story) = 'array'),
  cover_image_url TEXT,
  secondary_image_url TEXT,
  event_image_url TEXT,
  rsvp_background_url TEXT,
  gallery_urls TEXT[] NOT NULL DEFAULT '{}',
  music_url TEXT,
  music_credit TEXT,
  closing_text TEXT,
  closing_greeting TEXT,
  bride_family_title TEXT,
  bride_family_detail TEXT,
  groom_family_title TEXT,
  groom_family_detail TEXT,
  gift JSONB NOT NULL DEFAULT '{"enabled":false}'::jsonb CHECK (jsonb_typeof(gift) = 'object'),
  expires_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safe additions for projects that already have an older invitations table.
-- These keep existing rows and only add the columns needed by the unified app.
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES templates(id) ON DELETE RESTRICT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS template_slug TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS couple_name TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_short_name TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_full_name TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_parents TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_photo_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_short_name TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_full_name TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_parents TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_photo_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS wedding_at TIMESTAMPTZ;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Jakarta';
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS location_label TEXT DEFAULT '';
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS quote_text TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS quote_source TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS intro_text TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]'::jsonb;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS love_story JSONB DEFAULT '[]'::jsonb;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS secondary_image_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS event_image_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS rsvp_background_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS music_url TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS music_credit TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS closing_text TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS closing_greeting TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_family_title TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS bride_family_detail TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_family_title TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS groom_family_detail TEXT;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS gift JSONB DEFAULT '{"enabled":false}'::jsonb;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE invitations SET status = 'draft' WHERE status IS NULL;
UPDATE invitations SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE invitations i SET template_slug = t.slug FROM templates t WHERE i.template_id = t.id AND i.template_slug IS NULL;
UPDATE invitations SET couple_name = concat_ws(' & ', bride_short_name, groom_short_name) WHERE couple_name IS NULL;
UPDATE invitations SET is_active = true WHERE is_active IS NULL;
UPDATE invitations SET timezone = 'Asia/Jakarta' WHERE timezone IS NULL;
UPDATE invitations SET location_label = '' WHERE location_label IS NULL;
UPDATE invitations SET events = '[]'::jsonb WHERE events IS NULL;
UPDATE invitations SET love_story = '[]'::jsonb WHERE love_story IS NULL;
UPDATE invitations SET gift = '{"enabled":false}'::jsonb WHERE gift IS NULL;
UPDATE invitations SET gallery_urls = '{}' WHERE gallery_urls IS NULL;
UPDATE invitations SET created_at = NOW() WHERE created_at IS NULL;
UPDATE invitations SET updated_at = NOW() WHERE updated_at IS NULL;

ALTER TABLE invitations DROP CONSTRAINT IF EXISTS invitations_status_check;
ALTER TABLE invitations ADD CONSTRAINT invitations_status_check
  CHECK (status IN ('draft', 'published', 'archived')) NOT VALID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_slug_unique ON invitations(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_id_unique ON invitations(id);
CREATE INDEX IF NOT EXISTS idx_invitations_public_slug ON invitations(slug) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_invitations_template_id ON invitations(template_id);

-- New scoped response tables intentionally leave legacy rsvp/wishes untouched.
CREATE TABLE IF NOT EXISTS invitation_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  attending BOOLEAN NOT NULL,
  guest_count SMALLINT NOT NULL DEFAULT 1 CHECK (guest_count BETWEEN 0 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((attending AND guest_count >= 1) OR (NOT attending AND guest_count = 0))
);

CREATE TABLE IF NOT EXISTS invitation_wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  message TEXT NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitation_rsvps_invitation ON invitation_rsvps(invitation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitation_wishes_invitation ON invitation_wishes(invitation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_invitations_updated_at ON invitations;
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON templates;
CREATE POLICY "Public templates are viewable by everyone" ON templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Published invitations are publicly viewable" ON invitations;
CREATE POLICY "Published invitations are publicly viewable" ON invitations FOR SELECT USING (
  status = 'published'
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > NOW())
);
DROP POLICY IF EXISTS "Public can RSVP to published invitations" ON invitation_rsvps;
CREATE POLICY "Public can RSVP to published invitations" ON invitation_rsvps FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM invitations
  WHERE invitations.id = invitation_id
    AND invitations.status = 'published'
    AND invitations.is_active = true
    AND (invitations.expires_at IS NULL OR invitations.expires_at > NOW())
));
DROP POLICY IF EXISTS "Published invitation wishes are publicly viewable" ON invitation_wishes;
CREATE POLICY "Published invitation wishes are publicly viewable" ON invitation_wishes FOR SELECT USING (EXISTS (
  SELECT 1 FROM invitations
  WHERE invitations.id = invitation_id
    AND invitations.status = 'published'
    AND invitations.is_active = true
    AND (invitations.expires_at IS NULL OR invitations.expires_at > NOW())
));
DROP POLICY IF EXISTS "Public can wish published invitations" ON invitation_wishes;
CREATE POLICY "Public can wish published invitations" ON invitation_wishes FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM invitations
  WHERE invitations.id = invitation_id
    AND invitations.status = 'published'
    AND invitations.is_active = true
    AND (invitations.expires_at IS NULL OR invitations.expires_at > NOW())
));
DROP POLICY IF EXISTS "Newsletter inserts are allowed" ON newsletter;
CREATE POLICY "Newsletter inserts are allowed" ON newsletter FOR INSERT WITH CHECK (char_length(email) BETWEEN 3 AND 320);

-- Public customer media. Uploads remain dashboard/admin-only.
INSERT INTO storage.buckets (id, name, public) VALUES ('invitation-assets', 'invitation-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;
DROP POLICY IF EXISTS "Public invitation assets are readable" ON storage.objects;
CREATE POLICY "Public invitation assets are readable" ON storage.objects FOR SELECT USING (bucket_id = 'invitation-assets');

-- Register the three renderers. Existing matching rows are updated safely.
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
    INSERT INTO templates (name, subtitle, description, style, slug, renderer_key, is_featured, images)
    VALUES
      ('Classic Dark', 'Undangan digital elegan dengan tema gelap minimalis', 'Undangan digital modern dengan nuansa gelap dan tipografi elegan.', 'Modern', 'delta-gray', 'delta-gray', true, ARRAY['/classicdark1.webp', '/classicdark2.webp', '/classicdark3.webp', '/classicdark4.webp', '/classicdark5.webp', '/classicdark6.webp', '/classicdark7.webp', '/classicdark8.webp', '/classicdark9.webp']),
      ('Romantic Floral', 'Undangan digital romantis dengan dekorasi bunga', 'Undangan lembut dengan ilustrasi bunga dan animasi pembuka.', 'Floral', 'pink-flower', 'pink-flower', true, ARRAY['/flower1.webp', '/flower2.webp', '/flower3.webp', '/flower4.webp', '/flower5.webp', '/flower6.webp', '/flower7.webp', '/flower8.webp', '/flower9.webp']),
      ('Javanese Gold', 'Undangan digital tradisional Jawa dengan aksen emas', 'Undangan bernuansa Jawa klasik dengan ornamen wayang dan aksen emas.', 'Classic', 'javanese', 'javanese', true, ARRAY['/jawa1.webp', '/jawa2.webp', '/jawa3.webp', '/jawa4.webp', '/jawa5.webp', '/jawa6.webp', '/jawa7.webp', '/jawa8.webp', '/jawa9.webp', '/jawa10.webp']),
      ('Mahogany', 'Elegant mahogany invitation', 'An elegant ivory and mahogany invitation with editorial photography.', 'Classic', 'mahogany', 'mahogany', false, ARRAY['/templates/mahogany/walk.jpg', '/templates/mahogany/couple.jpg', '/templates/mahogany/rings.jpg'])
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, renderer_key = EXCLUDED.renderer_key, description = EXCLUDED.description, subtitle = EXCLUDED.subtitle, style = EXCLUDED.style, images = EXCLUDED.images;
  ELSE
    INSERT INTO templates (name, subtitle, description, style, slug, renderer_key, is_featured, images)
    VALUES
      ('Classic Dark', 'Undangan digital elegan dengan tema gelap minimalis', 'Undangan digital modern dengan nuansa gelap dan tipografi elegan.', 'Modern', 'delta-gray', 'delta-gray', true, '["/classicdark1.webp", "/classicdark2.webp", "/classicdark3.webp", "/classicdark4.webp", "/classicdark5.webp", "/classicdark6.webp", "/classicdark7.webp", "/classicdark8.webp", "/classicdark9.webp"]'::jsonb),
      ('Romantic Floral', 'Undangan digital romantis dengan dekorasi bunga', 'Undangan lembut dengan ilustrasi bunga dan animasi pembuka.', 'Floral', 'pink-flower', 'pink-flower', true, '["/flower1.webp", "/flower2.webp", "/flower3.webp", "/flower4.webp", "/flower5.webp", "/flower6.webp", "/flower7.webp", "/flower8.webp", "/flower9.webp"]'::jsonb),
      ('Javanese Gold', 'Undangan digital tradisional Jawa dengan aksen emas', 'Undangan bernuansa Jawa klasik dengan ornamen wayang dan aksen emas.', 'Classic', 'javanese', 'javanese', true, '["/jawa1.webp", "/jawa2.webp", "/jawa3.webp", "/jawa4.webp", "/jawa5.webp", "/jawa6.webp", "/jawa7.webp", "/jawa8.webp", "/jawa9.webp", "/jawa10.webp"]'::jsonb),
      ('Mahogany', 'Elegant mahogany invitation', 'An elegant ivory and mahogany invitation with editorial photography.', 'Classic', 'mahogany', 'mahogany', false, '["/templates/mahogany/walk.jpg", "/templates/mahogany/couple.jpg", "/templates/mahogany/rings.jpg"]'::jsonb)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, renderer_key = EXCLUDED.renderer_key, description = EXCLUDED.description, subtitle = EXCLUDED.subtitle, style = EXCLUDED.style, images = EXCLUDED.images;
  END IF;
END $$;

-- No sample invitation is inserted here. Existing projects can have additional
-- required legacy columns (for example template_slug), so customer invitations
-- should be created after the migration using the Table Editor/admin workflow.
