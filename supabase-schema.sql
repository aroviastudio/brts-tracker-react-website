-- ==============================================================================
-- BHUVI MEHANDI ARTISTRY - SUPABASE DATABASE SCHEMA
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. DESIGNS TABLE (Portfolio of Mehandi Artworks)
CREATE TABLE IF NOT EXISTS public.mehandi_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'bridal', 'arabic', 'rajasthani', 'engagement', 'feet', 'minimalist'
    image_url TEXT NOT NULL,
    description TEXT,
    price_range TEXT,
    tag TEXT DEFAULT 'Popular',
    featured BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 18,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE (Event & Mehandi Packages)
CREATE TABLE IF NOT EXISTS public.mehandi_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    event_type TEXT NOT NULL,
    price_starting TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    includes TEXT[] DEFAULT '{}',
    image_url TEXT NOT NULL,
    popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INQUIRIES & BOOKINGS TABLE (Customer WhatsApp & Web inquiries)
CREATE TABLE IF NOT EXISTS public.mehandi_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    event_date TEXT NOT NULL,
    event_type TEXT NOT NULL,
    service_name TEXT,
    guests_count INTEGER DEFAULT 1,
    city_venue TEXT,
    message TEXT,
    status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Confirmed', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REVIEWS TABLE (Real Brides Feedback)
CREATE TABLE IF NOT EXISTS public.mehandi_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    location TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    comment TEXT NOT NULL,
    bride_image TEXT,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.mehandi_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehandi_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to designs, services, and reviews
CREATE POLICY "Public can view mehandi designs" 
    ON public.mehandi_designs FOR SELECT USING (true);

CREATE POLICY "Public can insert mehandi designs" 
    ON public.mehandi_designs FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can delete mehandi designs" 
    ON public.mehandi_designs FOR DELETE USING (true);

CREATE POLICY "Public can view mehandi services" 
    ON public.mehandi_services FOR SELECT USING (true);

CREATE POLICY "Public can view mehandi reviews" 
    ON public.mehandi_reviews FOR SELECT USING (true);

-- Allow public to submit inquiries (booking forms)
CREATE POLICY "Anyone can submit an inquiry" 
    ON public.mehandi_inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view inquiries for admin dashboard" 
    ON public.mehandi_inquiries FOR SELECT USING (true);

CREATE POLICY "Public can update inquiries status" 
    ON public.mehandi_inquiries FOR UPDATE USING (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.mehandi_designs (title, category, image_url, description, price_range, tag, featured, likes_count) VALUES
('Royal Marwari Bridal Dulha-Dulhan', 'bridal', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 'Exquisite full arm intricate work featuring dulha-dulhan portraits, royal jharokhas, and shehnai motifs.', '₹7,500 - ₹15,000', 'Bestseller', true, 142),
('Contemporary Arabic Floral Trail', 'arabic', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', 'Bold shaded Arabic roses flowing with delicate lace vine wrist bands and finger mandalas.', '₹1,500 - ₹3,000', 'Trending', true, 89),
('Intricate Lotus & Peacock Feet Art', 'feet', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 'Detailed ankle-to-knee jaali design with blooming lotus motifs and traditional peacock curves.', '₹3,500 - ₹6,000', 'Bridal Special', true, 115),
('Royal Rajasthani Traditional Jaali', 'rajasthani', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 'Heritage Marwari patterns with symmetrical jaal grids, elephant barat, and micro-shading.', '₹5,000 - ₹10,000', 'Traditional', true, 97),
('Minimalist Chic Engagement Henna', 'engagement', 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80', 'Modern negative space wrist mandala with symmetrical finger cuffs, ideal for cocktails & rokas.', '₹2,000 - ₹4,000', 'Modern', false, 64),
('Elegant Bridal Hand & Palm Portrait', 'bridal', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Heartwarming customized initials and wedding ritual moments woven into breathtaking symmetric mandala.', '₹8,000 - ₹16,000', 'Masterpiece', true, 178)
ON CONFLICT DO NOTHING;

INSERT INTO public.mehandi_services (name, category, event_type, price_starting, duration, description, includes, image_url, popular) VALUES
('Royal Luxury Bridal Package', 'Bridal', 'Wedding Day', '₹8,500', '4 - 6 Hours', 'Our signature complete bridal experience. Intricate handcrafted storytelling mehandi customized to your bridal attire.', ARRAY['Full hands both sides up to elbows', 'Both feet up to mid-calf', 'Custom Dulha-Dulhan figurines or portraits', 'Secret groom name & wedding date weaving', '100% Organic homemade henna cones with nilgiri oils', 'Free aftercare herbal balm for deep stain'], 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', true),
('Engagement & Roka Chic Henna', 'Engagement', 'Pre-Wedding', '₹2,500', '1.5 - 2.5 Hours', 'Contemporary elegant designs designed to match diamond rings and modern indo-western silhouettes.', ARRAY['Both hands wrist to mid-forearm', 'Front & back modern floral mandalas', 'Delicate finger lace work', 'Quick-drying organic formulation', 'Aftercare guidance for dark stain'], 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80', false),
('Arabic & Indo-Western Fusion', 'Arabic', 'Cocktail / Reception', '₹1,800', '1 - 2 Hours', 'Fluid, bold shaded Arabic leaves, blooming roses, and negative space geometry for stylish events.', ARRAY['Both hands front & back', 'Bold shaded outlines with fine vines', 'Spacious modern layout', 'Deep stain organic paste'], 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', false),
('Traditional Rajasthani & Marwari', 'Traditional', 'Festivals & Weddings', '₹4,500', '3 - 4 Hours', 'Time-honored Indian royal jaal, peacocks, kalash, shehnai, and miniature detailing.', ARRAY['Palms & full backhands', 'Detailed traditional jaali patterns', 'Peacock & Kalash motifs', 'Long-lasting natural stain guaranteed'], 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', false),
('Baby Shower / Godh Bharai Henna', 'Baby Shower', 'Mom-to-Be Celebrations', '₹2,200', '1.5 - 2 Hours', 'Ultra-gentle 100% certified organic chemical-free henna safe for expectant mothers with symbolic baby motifs.', ARRAY['Mom-to-be hand design', 'Optional cute baby feet/cradle motif', '100% pure Rajasthani Sojat leaf with lavender oil', 'Comfortable seated application pace'], 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', false),
('Sangeet & Family Guest Mehndi Party', 'Group / Party', 'Sangeet Night', '₹1,200/hr or per hand', 'Flexible (2-6 Hours)', 'Speedy yet gorgeous designs for bridesmaids, mothers, sisters, and wedding attendees with multiple artists.', ARRAY['Team of experienced artists available', 'Arabic trails or palm mandalas for guests (5-8 mins/hand)', 'Guest management support', 'All cones and materials included'], 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.mehandi_reviews (client_name, event_type, location, rating, comment, verified) VALUES
('Priyanka Sharma', 'Bridal Mehandi', 'Ahmedabad / Venue', 5.0, 'Bhuvi did my bridal mehandi and I was speechless! The dulha-dulhan portrait was uncanny, and the stain turned almost black-maroon on my wedding day. Everyone kept complimenting my hands!', true),
('Sneha Patel', 'Engagement Mehandi', 'Vadodara', 5.0, 'Booked Bhuvi on WhatsApp after seeing her portfolio. She was extremely punctual, gentle, and the arabic design was so chic and neat. 100% organic henna that smelled wonderful.', true),
('Aayushi Mehta', 'Sangeet & Family Package', 'Surat', 5.0, 'Bhuvi and her assistant covered over 25 family guests during our Sangeet night effortlessly. Fast, super crisp lines, and very polite! Highly recommended for any wedding.', true),
('Radhika Verma', 'Godh Bharai / Baby Shower', 'Gandhinagar', 5.0, 'I was very conscious about skin safety during pregnancy. Bhuvi’s chemical-free henna with lavender and tea tree oil was so soothing. The design was adorable!', true)
ON CONFLICT DO NOTHING;
