-- ==============================================================================
-- SNERA STORE — DATABASE MIGRATION SCRIPT (PHASE 2)
-- Idempotent SQL script for Supabase / PostgreSQL
-- ==============================================================================
-- BEFORE RUNNING THIS SCRIPT:
-- 1. Take a database backup in Supabase: Dashboard -> Database -> Backups
--    or run: pg_dump -h <host> -U postgres -d postgres > snera_backup.sql
-- 2. Open Supabase SQL Editor and run this complete file.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & HELPER FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin verification helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- ------------------------------------------------------------------------------
-- 2. ADMIN USERS & USER PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  show_in_shop boolean DEFAULT true,
  show_in_home boolean DEFAULT true,
  display_order integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Safely add/ensure category columns
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_in_shop boolean DEFAULT true;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_in_home boolean DEFAULT true;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  compare_price numeric(10,2),
  sku text,
  stock integer DEFAULT 0,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name text,
  fabric text,
  color text,
  occasion text,
  length text,
  blouse_piece text,
  image_url text,
  images text[] DEFAULT '{}'::text[],
  recommended_ids uuid[] DEFAULT '{}'::uuid[],
  is_featured boolean DEFAULT false,
  free_shipping boolean DEFAULT true,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Safely add/ensure product columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_price numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS length text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS blouse_piece text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fabric text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS occasion text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS recommended_ids uuid[] DEFAULT '{}'::uuid[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS free_shipping boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ------------------------------------------------------------------------------
-- 5. PRODUCT COLOURS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_colours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  color_name text NOT NULL,
  color_code text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. COUPONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percent', 'flat')),
  value numeric(10,2) NOT NULL,
  min_order numeric(10,2) DEFAULT 0,
  max_uses integer DEFAULT 0,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 7. ORDERS & ORDER NUMBER GENERATOR
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS order_id_seq START WITH 1000;

CREATE OR REPLACE FUNCTION generate_readable_order_id()
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  RETURN 'SN-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_id_seq')::text, 6, '0');
END;
$$;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE DEFAULT generate_readable_order_id(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  items jsonb DEFAULT '[]'::jsonb,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  gst numeric(10,2) NOT NULL DEFAULT 0,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text DEFAULT 'cod' CHECK (payment_method IN ('cod', 'online', 'razorpay')),
  razorpay_order_id text,
  razorpay_payment_id text,
  shipping_address jsonb DEFAULT '{}'::jsonb,
  cancel_reason text,
  cancelled_at timestamptz,
  awb text,
  courier text,
  tracking_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Migrate total_amount to total if total_amount exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total numeric(10,2);
    UPDATE public.orders SET total = total_amount WHERE total IS NULL AND total_amount IS NOT NULL;
  END IF;
END $$;

-- Convert legacy uppercase statuses to lowercase safely
UPDATE public.orders SET status = lower(status) WHERE status != lower(status);

-- ------------------------------------------------------------------------------
-- 8. ORDER ITEMS (for line item analytics & reporting)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  sku text,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 9. ADDRESSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 10. WISHLIST
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ------------------------------------------------------------------------------
-- 11. REVIEWS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 12. STORE SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name text DEFAULT 'Snera Store',
  support_email text DEFAULT 'support@snerastore.com',
  support_phone text,
  gst_rate numeric(5,2) DEFAULT 5.00,
  gst_inclusive boolean DEFAULT false, -- Prices are GST-excluded
  free_shipping_threshold numeric(10,2) DEFAULT 999.00,
  cod_enabled boolean DEFAULT true,
  cod_fee numeric(10,2) DEFAULT 0.00,
  return_window_days integer DEFAULT 7,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.store_settings (id, store_name, gst_rate, gst_inclusive, cod_enabled, return_window_days)
VALUES (1, 'Snera Store', 5.00, false, true, 7)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 13. ATOMIC STOCK REDUCTION (Prevents overselling single saree pieces)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reduce_stock_atomic(p_product_id uuid, p_qty integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current_stock integer;
BEGIN
  SELECT stock INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF v_current_stock IS NULL OR v_current_stock < p_qty THEN
    RETURN false;
  END IF;

  UPDATE public.products
  SET stock = stock - p_qty,
      updated_at = now()
  WHERE id = p_product_id;

  RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies safely
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Categories RLS
CREATE POLICY "Public Read Active Categories" ON public.categories FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admin Write Categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products RLS
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admin Write Products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Product Colours RLS
CREATE POLICY "Public Read Product Colours" ON public.product_colours FOR SELECT USING (true);
CREATE POLICY "Admin Write Product Colours" ON public.product_colours FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Coupons RLS (No public select policy; validation handled server-side or via function)
CREATE POLICY "Admin All Coupons" ON public.coupons FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Profiles RLS
CREATE POLICY "Users Read Own Profile" ON public.user_profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users Update Own Profile" ON public.user_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Orders & Order Items RLS
CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users Read Own Order Items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admin All Order Items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Addresses RLS
CREATE POLICY "Users Manage Own Addresses" ON public.addresses FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin Manage Addresses" ON public.addresses FOR ALL TO authenticated USING (public.is_admin());

-- Wishlist RLS
CREATE POLICY "Users Manage Own Wishlist" ON public.wishlist FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Reviews RLS
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (approved = true OR public.is_admin());
CREATE POLICY "Users Insert Own Reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin Moderate Reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Store Settings RLS
CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin Write Store Settings" ON public.store_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 15. STORAGE BUCKET ("product-images")
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;

CREATE POLICY "Public Read Product Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin Upload Product Images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Delete Product Images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());

COMMIT;
