-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  style TEXT CHECK (style IN ('Minimalist', 'Floral', 'Classic', 'Modern', 'Rustic', 'Bohemian')),
  price INTEGER DEFAULT 80000,
  price_display TEXT DEFAULT 'Rp 80.000',
  is_featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter table
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Public templates are viewable by everyone"
  ON templates FOR SELECT
  USING (true);

CREATE POLICY "Newsletter inserts are allowed"
  ON newsletter FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_style ON templates(style);
CREATE INDEX IF NOT EXISTS idx_templates_is_featured ON templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
