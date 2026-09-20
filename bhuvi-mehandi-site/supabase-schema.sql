-- ==============================================================================
-- BHUVI MEHANDI ATELIER — FULL SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase project SQL Editor (https://supabase.com/dashboard)

-- 1. SITE SETTINGS TABLE (Hero Image, Headline, Phone, Location)
CREATE TABLE IF NOT EXISTS public.mehandi_settings (
    id TEXT PRIMARY KEY DEFAULT 'bhuvi-main-config',
    headline TEXT NOT NULL DEFAULT 'Pure Sojat Henna. Handcrafted for Life''s Sacred Vows.',
    subheadline TEXT NOT NULL DEFAULT '100% Organic Sojat Leaf • Chemical-Free • Guaranteed 48-Hour Deep Mahogany Stain',
    hero_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
    whatsapp_phone TEXT NOT NULL DEFAULT '919876543210',
    studio_location TEXT NOT NULL DEFAULT 'Ahmedabad & Gandhinagar (Pan-India & Destination Travel)',
    admin_pin TEXT NOT NULL DEFAULT '1234',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. EVENT SERVICES TABLE (Celebration Packages)
CREATE TABLE IF NOT EXISTS public.mehandi_services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Bridal', 'Engagement', 'Arabic', 'Traditional', 'Baby Shower', 'Family & Guests'
    event_type TEXT NOT NULL,
    price_starting TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    includes TEXT[] DEFAULT '{}',
    image_url TEXT NOT NULL,
    badge TEXT DEFAULT 'Signature',
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. PORTFOLIO DESIGNS TABLE (Curated Works Gallery)
CREATE TABLE IF NOT EXISTS public.mehandi_designs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'bridal', 'arabic', 'rajasthani', 'feet', 'engagement', 'minimalist'
    image_url TEXT NOT NULL,
    description TEXT,
    price_range TEXT,
    tag TEXT DEFAULT 'Signature',
    is_featured BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. BRIDE REVIEWS TABLE (With Author Token for User-Only Edit/Delete)
CREATE TABLE IF NOT EXISTS public.mehandi_reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_name TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    event_type TEXT NOT NULL,
    location TEXT NOT NULL,
    comment TEXT NOT NULL,
    author_token TEXT NOT NULL, -- Local device token to verify review creator
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. INQUIRIES & BOOKING RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.mehandi_inquiries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    event_date DATE NOT NULL,
    event_type TEXT NOT NULL,
    city_venue TEXT,
    message TEXT,
    status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Confirmed', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — Read-Access for Public, Write for App
-- ==============================================================================
ALTER TABLE public.mehandi_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on settings" ON public.mehandi_settings FOR SELECT USING (true);
CREATE POLICY "Allow update on settings" ON public.mehandi_settings FOR ALL USING (true);

CREATE POLICY "Allow public read on services" ON public.mehandi_services FOR SELECT USING (true);
CREATE POLICY "Allow modify on services" ON public.mehandi_services FOR ALL USING (true);

CREATE POLICY "Allow public read on designs" ON public.mehandi_designs FOR SELECT USING (true);
CREATE POLICY "Allow modify on designs" ON public.mehandi_designs FOR ALL USING (true);

CREATE POLICY "Allow public read on reviews" ON public.mehandi_reviews FOR SELECT USING (true);
CREATE POLICY "Allow insert/modify on reviews" ON public.mehandi_reviews FOR ALL USING (true);

CREATE POLICY "Allow public insert on inquiries" ON public.mehandi_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read/modify on inquiries" ON public.mehandi_inquiries FOR ALL USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Settings
INSERT INTO public.mehandi_settings (id, headline, subheadline, hero_image_url, whatsapp_phone, studio_location, admin_pin)
VALUES (
    'bhuvi-main-config',
    'Pure Sojat Henna. Handcrafted for Life''s Sacred Vows.',
    '100% Organic Sojat Leaf • Chemical-Free • Guaranteed 48-Hour Deep Mahogany Stain',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
    '919876543210',
    'Ahmedabad & Gandhinagar (Pan-India & Destination Travel)',
    '1234'
) ON CONFLICT (id) DO NOTHING;

-- Seed Services
INSERT INTO public.mehandi_services (name, category, event_type, price_starting, duration, description, includes, image_url, badge)
VALUES
(
    'Royal Luxury Bridal Mehandi',
    'Bridal',
    'Wedding Day',
    '₹7,500',
    '4 - 6 Hours',
    'Our crowning jewel bridal service. Handcrafted heirloom storytelling featuring personalized bride-groom portraits, wedding rituals, elephant baraat, and secret groom initials.',
    ARRAY['Full arms to elbows (front & back)', 'Feet artwork up to mid-calf', 'Custom Dulha-Dulhan portrait', 'Symmetrical jaali with lotus & peacock motifs', '100% Organic Nilgiri oil cones', 'Complimentary clove aftercare balm'],
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
    'Most Cherished'
),
(
    'Engagement & Modern Roka Chic',
    'Engagement',
    'Roka / Ring Ceremony',
    '₹2,500',
    '2 - 3 Hours',
    'Contemporary photogenic henna tailored for diamond rings and modern lehengas. Features spacious negative-space mandalas and delicate finger cuffs.',
    ARRAY['Both hands palm & back to mid-forearm', 'Modern floral medallion & lace', 'Ring-accentuating finger detailing', 'Fast-drying organic formulation', 'Sealant spray included'],
    'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=1000&q=85',
    'Modern Chic'
),
(
    'Arabic & Indo-Western Fusion',
    'Arabic',
    'Cocktail / Reception',
    '₹1,800',
    '1.5 - 2 Hours',
    'Striking bold shaded Arabic roses, cascading vine trails, and geometric wrist bands designed for quick, bold aesthetic appeal that pops in photography.',
    ARRAY['Front & back hands bold shaded trails', 'Negative-space contrast technique', 'Antique jewelry style wrist cuffs', 'Pure deep-stain organic cones'],
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85',
    'Bold & Trendy'
),
(
    'Traditional Marwari & Rajasthani Heritage',
    'Traditional',
    'Wedding / Karwa Chauth',
    '₹4,500',
    '3 - 4.5 Hours',
    'Dense, hyper-intricate classical patterns inspired by royal Rajasthan palaces: Kalash, royal peacocks, shehnai, doli, and micro-grid jaali shading.',
    ARRAY['Palms & full back hands to 3/4 forearm', 'Palace arch jharokha & peacocks', 'Micro-jaali shading with ultra-fine cone tip', 'Rich mahogany stain guarantee'],
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    'Heritage Classic'
),
(
    'Mom-to-Be Godh Bharai / Baby Shower',
    'Baby Shower',
    'Godh Bharai / Seemantham',
    '₹2,200',
    '1.5 - 2 Hours',
    'Gentle, 100% skin-safe henna formulated exclusively for mothers-to-be. Infused with gentle Bulgarian lavender and tea tree oils, free from all chemical dyes.',
    ARRAY['Mom-to-be hands with baby blessing motifs', 'Optional belly henna artwork', '100% tested triple-sifted organic henna', 'Relaxed ergonomic application pace'],
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    'Skin-Safe Organic'
),
(
    'Sangeet & Family Guest Mehndi Party',
    'Family & Guests',
    'Sangeet Night / Mehndi Party',
    '₹1,200 / hr',
    '2 - 6 Hours',
    'Speed-artistry for bridesmaids, mothers, and party guests. Impeccable neatness, festive vibe, and quick drying so your guests can dance freely.',
    ARRAY['Multiple professional artists team available', 'Speed application (5-8 mins per side)', 'All organic cones & supplies provided', 'Hourly or per-hand packages'],
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    'Party Favorite'
)
ON CONFLICT DO NOTHING;

-- Seed Designs
INSERT INTO public.mehandi_designs (title, category, image_url, description, price_range, tag)
VALUES
('Royal Dulha-Dulhan Storyline', 'bridal', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 'Elbow-length bridal story with custom portraiture, temple jharokhas, and lotus motifs.', '₹7,500 - ₹12,000', 'Signature'),
('Modern Negative-Space Arabic', 'arabic', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', 'Fluid floral blooms and open skin space framing jewelry and cocktail rings.', '₹1,800 - ₹3,500', 'Trending'),
('Marwari Royal Palace Jaal', 'rajasthani', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 'Dense micro-grid jaali inspired by Jaipur palace jharokhas and peacock arches.', '₹4,500 - ₹7,000', 'Heritage'),
('Bridal Royal Feet & Ankle Cuff', 'feet', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 'Intricate payal-style ankle cuffs with symmetrical toe mandalas up to mid-calf.', '₹2,500 - ₹4,500', 'Bridal Feet'),
('Minimalist Botanical Wrist Cuff', 'minimalist', 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80', 'Delicate wrist bracelet and single finger trail for modern engagements.', '₹1,200 - ₹2,000', 'Minimalist'),
('Sangeet Bridesmaids Floral Grid', 'engagement', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 'Geometric checkered net with shading and dainty rose accents.', '₹2,000 - ₹3,500', 'Party')
ON CONFLICT DO NOTHING;

-- Seed Reviews
INSERT INTO public.mehandi_reviews (client_name, rating, event_type, location, comment, author_token)
VALUES
('Radhika Patel', 5, 'Bridal Mehandi', 'The Leela, Gandhinagar', 'Bhuvi made my wedding henna unforgettable! The portrait of my husband and our puppy was so detailed, and the stain became dark maroon by wedding day.', 'seed-token-1'),
('Pooja Mehta', 5, 'Engagement Ceremony', 'Ahmedabad', 'The Arabic negative-space design was so photogenic with my pastel lehenga. Everyone at the party kept asking who did my henna!', 'seed-token-2'),
('Sneha Desai', 5, 'Mom-to-Be Godh Bharai', 'Surat', 'Completely 100% natural and gentle! The lavender aroma was so calming and my skin had zero irritation. Highly recommended.', 'seed-token-3'),
('Ananya Singhania', 5, 'Destination Wedding', 'Udaipur', 'Bhuvi and her team managed 25 bridesmaids and family members effortlessly. Fast, patient, and neat work. Pure luxury service!', 'seed-token-4')
ON CONFLICT DO NOTHING;
