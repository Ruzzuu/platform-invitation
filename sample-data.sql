-- Insert sample wedding invitation templates
-- All prices set to 80000 as requested

INSERT INTO templates (name, subtitle, style, price, price_display, is_featured, slug, images, badge) VALUES
-- Minimalist Style
('Minimalist Elegance', 'Clean and sophisticated design for modern couples', 'Minimalist', 80000, 'Rp 80.000', true, 'minimalist-elegance', '["/gambar1.webp", "/gambar2.webp", "/gambar3.webp"]', 'Best Seller'),
('Pure Simplicity', 'Less is more with this timeless design', 'Minimalist', 80000, 'Rp 80.000', true, 'pure-simplicity', '["/gambar4.webp", "/gambar5.webp"]', 'Popular'),
('Modern Minimal', 'Contemporary design with clean lines', 'Minimalist', 80000, 'Rp 80.000', false, 'modern-minimal', '["/gambar6.webp"]', 'New'),

-- Floral Style
('Romantic Garden', 'Beautiful floral accents for a romantic touch', 'Floral', 80000, 'Rp 80.000', true, 'romantic-garden', '["/flower1.webp", "/flower2.webp"]', 'Best Seller'),
('Botanical Beauty', 'Elegant botanical illustrations', 'Floral', 80000, 'Rp 80.000', true, 'botanical-beauty', '["/flower3.webp", "/flower4.webp"]', null),
('Wildflowers', 'Free-spirited wildflower design', 'Floral', 80000, 'Rp 80.000', false, 'wildflowers', '["/flower5.webp"]', 'New'),

-- Classic Style
('Classic Beauty', 'Timeless elegance for traditional weddings', 'Classic', 80000, 'Rp 80.000', true, 'classic-beauty', '["/classicdark1.webp", "/classicdark2.webp"]', 'Best Seller'),
('Heritage', 'Vintage-inspired classic design', 'Classic', 80000, 'Rp 80.000', false, 'heritage', '["/classicdark3.webp", "/classicdark4.webp"]', null),
('Elegant Script', 'Beautiful typography with classic elements', 'Classic', 80000, 'Rp 80.000', false, 'elegant-script', '["/classicdark5.webp"]', 'New'),

-- Modern Style
('Modern Luxe', 'Contemporary design with luxurious details', 'Modern', 80000, 'Rp 80.000', true, 'modern-luxe', '["/gambar7.webp", "/gambar8.webp"]', 'Best Seller'),
('Urban Chic', 'Sophisticated city-inspired design', 'Modern', 80000, 'Rp 80.000', false, 'urban-chic', '["/gambar9.webp"]', null),
('Bold & Beautiful', 'Make a statement with this bold design', 'Modern', 80000, 'Rp 80.000', false, 'bold-beautiful', '["/gambar10.webp"]', 'Popular'),

-- Rustic Style
('Rustic Charm', 'Warm and inviting countryside design', 'Rustic', 80000, 'Rp 80.000', true, 'rustic-charm', '["/gambar11.webp"]', 'Best Seller'),
('Woodland Wedding', 'Forest-inspired natural elements', 'Rustic', 80000, 'Rp 80.000', false, 'woodland-wedding', '["/gambar12.webp"]', null),
('Country Garden', 'Pastoral beauty with rustic touches', 'Rustic', 80000, 'Rp 80.000', false, 'country-garden', '["/gambar13.webp"]', 'New'),

-- Bohemian Style
('Boho Dreams', 'Free-spirited and artistic design', 'Bohemian', 80000, 'Rp 80.000', true, 'boho-dreams', '["/gambar14.webp"]', 'Best Seller'),
('Dreamy Bohemian', 'Soft colors with bohemian flair', 'Bohemian', 80000, 'Rp 80.000', false, 'dreamy-bohemian', '["/gambar15.webp"]', null),
('Earthy Elements', 'Natural textures and warm tones', 'Bohemian', 80000, 'Rp 80.000', false, 'earthy-elements', '["/gambar1.webp"]', 'Popular');

-- Verify insertion
SELECT 
  style, 
  COUNT(*) as template_count,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_count
FROM templates 
GROUP BY style 
ORDER BY style;
