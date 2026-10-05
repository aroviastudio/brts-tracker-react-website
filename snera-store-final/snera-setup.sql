-- ==============================================================================
-- SNERA STORE — COMPLETE DATABASE SETUP & MIGRATION SCRIPT
-- File: snera-setup.sql
-- Database: Supabase / PostgreSQL (Project: yduueujrykugmzvbnndu)
-- ==============================================================================
-- Idempotent script: Safe to run multiple times in Supabase SQL Editor.
-- Covers all tables, RLS policies, atomic inventory management, 
-- security-definer order placement, admin checks, and storage bucket.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & HELPER FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sequence for readable, sequential order identifiers
CREATE SEQUENCE IF NOT EXISTS order_id_seq START WITH 1000;

CREATE OR REPLACE FUNCTION public.generate_readable_order_id()
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  RETURN 'SN-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_id_seq')::text, 6, '0');
END;
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
  avatar_url text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

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

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_in_shop boolean DEFAULT true;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_in_home boolean DEFAULT true;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

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
  length text DEFAULT '5.5 meters',
  blouse_piece text DEFAULT 'Included (0.8m Unstitched)',
  image_url text,
  images text[] DEFAULT '{}'::text[],
  recommended_ids uuid[] DEFAULT '{}'::uuid[],
  is_featured boolean DEFAULT false,
  free_shipping boolean DEFAULT true,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_price numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS length text DEFAULT '5.5 meters';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS blouse_piece text DEFAULT 'Included (0.8m Unstitched)';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fabric text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS occasion text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS free_shipping boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Ensure image_url is populated from images array if missing
UPDATE public.products
SET image_url = images[1]
WHERE (image_url IS NULL OR image_url = '') AND array_length(images, 1) > 0;

-- Ensure images array contains image_url if images is empty
UPDATE public.products
SET images = ARRAY[image_url]
WHERE (images IS NULL OR array_length(images, 1) IS NULL) AND image_url IS NOT NULL AND image_url != '';

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

-- Insert welcome coupon if not exists
INSERT INTO public.coupons (code, type, value, min_order, max_uses, status)
VALUES ('WELCOME10', 'percent', 10.00, 1500.00, 500, 'active')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. ORDERS & DATA CONVERSION
-- ------------------------------------------------------------------------------
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
  total_amount numeric(10,2),
  status text NOT NULL DEFAULT 'pending',
  payment_status text DEFAULT 'pending',
  payment_method text DEFAULT 'cod',
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

-- Safely add total and total_amount columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_id text UNIQUE DEFAULT generate_readable_order_id();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total numeric(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount numeric(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal numeric(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS gst numeric(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping numeric(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount numeric(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cod';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancel_reason text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Data conversion 1: total_amount to total (and sync both)
UPDATE public.orders SET total = total_amount WHERE (total IS NULL OR total = 0) AND total_amount IS NOT NULL AND total_amount > 0;
UPDATE public.orders SET total_amount = total WHERE (total_amount IS NULL OR total_amount = 0) AND total IS NOT NULL AND total > 0;

-- Data conversion 2: convert uppercase/mixed status to lowercase safely
UPDATE public.orders SET status = lower(status) WHERE status != lower(status);
UPDATE public.orders SET payment_status = lower(payment_status) WHERE payment_status != lower(payment_status);
UPDATE public.orders SET payment_method = lower(payment_method) WHERE payment_method != lower(payment_method);

-- ------------------------------------------------------------------------------
-- 8. ORDER ITEMS (Line item records for analytics and order tracking)
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
  support_email text DEFAULT 'support@snerafashion.com',
  support_phone text DEFAULT '+91 98765 43210',
  gst_rate numeric(5,2) DEFAULT 5.00,
  gst_inclusive boolean DEFAULT false,
  free_shipping_threshold numeric(10,2) DEFAULT 999.00,
  cod_enabled boolean DEFAULT true,
  cod_fee numeric(10,2) DEFAULT 0.00,
  online_payment_enabled boolean DEFAULT false, -- Razorpay toggle: false = Coming Soon
  return_window_days integer DEFAULT 7,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS online_payment_enabled boolean DEFAULT false;
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS support_email text DEFAULT 'support@snerafashion.com';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS support_phone text DEFAULT '+91 98765 43210';

INSERT INTO public.store_settings (id, store_name, support_email, support_phone, gst_rate, gst_inclusive, free_shipping_threshold, cod_enabled, online_payment_enabled, return_window_days)
VALUES (1, 'Snera Store', 'support@snerafashion.com', '+91 98765 43210', 5.00, false, 999.00, true, false, 7)
ON CONFLICT (id) DO UPDATE SET
  support_email = EXCLUDED.support_email,
  support_phone = EXCLUDED.support_phone;

-- ------------------------------------------------------------------------------
-- 13. ATOMIC STOCK REDUCTION & CANCEL ORDER FUNCTIONS
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
-- 14. SECURITY-DEFINER PLACE_ORDER FUNCTION (Enforces server pricing & stock lock)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.place_order(
  p_items jsonb,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_payment_method text DEFAULT 'cod',
  p_coupon_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item jsonb;
  v_prod_id uuid;
  v_prod_qty integer;
  v_prod RECORD;
  v_subtotal numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_gst numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_total numeric(10,2) := 0;
  v_gst_rate numeric(5,2) := 5.00;
  v_free_ship_thresh numeric(10,2) := 999.00;
  v_cod_enabled boolean := true;
  v_online_enabled boolean := false;
  v_coupon RECORD;
  v_order_id text;
  v_order_uuid uuid;
  v_enriched_items jsonb := '[]'::jsonb;
BEGIN
  -- Basic customer validation
  IF p_customer_name IS NULL OR trim(p_customer_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Customer name is required.');
  END IF;
  IF p_customer_phone IS NULL OR trim(p_customer_phone) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Customer phone number is required.');
  END IF;
  IF jsonb_array_length(p_items) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cart is empty.');
  END IF;

  -- Load store settings
  SELECT gst_rate, free_shipping_threshold, cod_enabled, online_payment_enabled
  INTO v_gst_rate, v_free_ship_thresh, v_cod_enabled, v_online_enabled
  FROM public.store_settings
  WHERE id = 1;

  -- Verify payment method availability
  p_payment_method := lower(trim(p_payment_method));
  IF p_payment_method = 'online' AND (v_online_enabled IS NOT TRUE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Online payment is coming soon. Please select Cash on Delivery.');
  END IF;
  IF p_payment_method = 'cod' AND (v_cod_enabled IS NOT TRUE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cash on Delivery is currently disabled.');
  END IF;

  -- Verify each product, check stock with lock, recalculate server subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_prod_id := (v_item->>'product_id')::uuid;
    v_prod_qty := COALESCE((v_item->>'quantity')::integer, 1);
    IF v_prod_qty <= 0 THEN v_prod_qty := 1; END IF;

    SELECT id, name, sku, price, stock, status, image_url, images
    INTO v_prod
    FROM public.products
    WHERE id = v_prod_id
    FOR UPDATE;

    IF v_prod.id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'A product in your cart no longer exists.');
    END IF;

    IF v_prod.status != 'active' THEN
      RETURN jsonb_build_object('success', false, 'error', 'The saree "' || v_prod.name || '" is currently unavailable.');
    END IF;

    IF v_prod.stock < v_prod_qty THEN
      RETURN jsonb_build_object('success', false, 'error', 'Insufficient stock for "' || v_prod.name || '". Only ' || v_prod.stock || ' piece(s) remaining.');
    END IF;

    v_subtotal := v_subtotal + (v_prod.price * v_prod_qty);
    
    -- Append verified item snapshot
    v_enriched_items := v_enriched_items || jsonb_build_object(
      'product_id', v_prod.id,
      'name', v_prod.name,
      'sku', v_prod.sku,
      'price', v_prod.price,
      'quantity', v_prod_qty,
      'total', (v_prod.price * v_prod_qty),
      'image', COALESCE(v_prod.image_url, v_prod.images[1], '')
    );
  END LOOP;

  -- Coupon validation & discount calculation
  IF p_coupon_code IS NOT NULL AND trim(p_coupon_code) != '' THEN
    SELECT * INTO v_coupon
    FROM public.coupons
    WHERE code = upper(trim(p_coupon_code))
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
    FOR UPDATE;

    IF v_coupon.id IS NOT NULL THEN
      IF (v_coupon.max_uses = 0 OR v_coupon.used_count < v_coupon.max_uses) AND (v_subtotal >= v_coupon.min_order) THEN
        IF v_coupon.type = 'percent' THEN
          v_discount := round((v_subtotal * (v_coupon.value / 100.0)), 2);
        ELSE
          v_discount := v_coupon.value;
        END IF;
        IF v_discount > v_subtotal THEN v_discount := v_subtotal; END IF;

        -- Update coupon usage
        UPDATE public.coupons SET used_count = used_count + 1 WHERE id = v_coupon.id;
      END IF;
    END IF;
  END IF;

  -- Calculate GST (5% excluded) and shipping
  v_gst := round(((v_subtotal - v_discount) * (v_gst_rate / 100.0)), 2);
  IF v_subtotal >= v_free_ship_thresh THEN
    v_shipping := 0.00;
  ELSE
    v_shipping := 100.00;
  END IF;

  v_total := round((v_subtotal - v_discount) + v_gst + v_shipping, 2);
  v_order_id := public.generate_readable_order_id();
  v_order_uuid := gen_random_uuid();

  -- Insert order
  INSERT INTO public.orders (
    id, order_id, user_id, customer_name, customer_email, customer_phone,
    items, subtotal, gst, shipping, discount, total, total_amount,
    status, payment_status, payment_method, shipping_address
  ) VALUES (
    v_order_uuid, v_order_id, auth.uid(), p_customer_name, p_customer_email, p_customer_phone,
    v_enriched_items, v_subtotal, v_gst, v_shipping, v_discount, v_total, v_total,
    'pending', 'pending', p_payment_method, p_shipping_address
  );

  -- Insert order line items & atomically reduce product stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_enriched_items) LOOP
    INSERT INTO public.order_items (
      order_id, product_id, product_name, sku, price, quantity, total
    ) VALUES (
      v_order_uuid,
      (v_item->>'product_id')::uuid,
      v_item->>'name',
      v_item->>'sku',
      (v_item->>'price')::numeric,
      (v_item->>'quantity')::integer,
      (v_item->>'total')::numeric
    );

    UPDATE public.products
    SET stock = stock - (v_item->>'quantity')::integer,
        updated_at = now()
    WHERE id = (v_item->>'product_id')::uuid;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_uuid', v_order_uuid,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'gst', v_gst,
    'shipping', v_shipping,
    'total', v_total
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 15. CANCEL ORDER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_order(
  p_order_id uuid,
  p_reason text DEFAULT 'Customer requested cancellation'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found.');
  END IF;

  -- Allow user who placed order or admin
  IF v_order.user_id != auth.uid() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are not authorized to cancel this order.');
  END IF;

  IF lower(v_order.status) NOT IN ('pending', 'processing') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order cannot be cancelled in its current state (' || v_order.status || ').');
  END IF;

  UPDATE public.orders
  SET status = 'cancelled',
      cancel_reason = p_reason,
      cancelled_at = now(),
      updated_at = now()
  WHERE id = p_order_id;

  -- Restore stock for items
  FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
    IF v_item.product_id IS NOT NULL THEN
      UPDATE public.products
      SET stock = stock + v_item.quantity,
          updated_at = now()
      WHERE id = v_item.product_id;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ------------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
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

-- Coupons RLS (Admins manage coupons; active coupon read for validation)
CREATE POLICY "Public Read Active Coupons" ON public.coupons FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admin Write Coupons" ON public.coupons FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- User Profiles RLS
CREATE POLICY "Users Read Own Profile" ON public.user_profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users Insert Own Profile" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users Update Own Profile" ON public.user_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admin Manage Profiles" ON public.user_profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Orders RLS:
-- Customers can only SELECT their own orders. Orders are created via place_order() security definer.
-- Admins can view and update all orders.
CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admin Manage All Orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Order Items RLS
CREATE POLICY "Users Read Own Order Items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admin Manage Order Items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Addresses RLS
CREATE POLICY "Users Manage Own Addresses" ON public.addresses FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin Manage Addresses" ON public.addresses FOR ALL TO authenticated USING (public.is_admin());

-- Wishlist RLS
CREATE POLICY "Users Manage Own Wishlist" ON public.wishlist FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Reviews RLS
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (approved = true OR public.is_admin());
CREATE POLICY "Users Insert Own Reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin Manage Reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Store Settings RLS
CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin Manage Store Settings" ON public.store_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 17. STORAGE BUCKET ("product-images")
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;

CREATE POLICY "Public Read Product Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin Upload Product Images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Update Product Images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Delete Product Images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());

COMMIT;
