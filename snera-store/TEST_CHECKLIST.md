# 🧪 SNERA STORE — PRODUCTION TEST SCRIPT & VERIFICATION CHECKLIST (PHASE 8)

This document provides a step-by-step testing script to verify all production e-commerce flows for **Snera Store**.

---

## 📋 PRE-TEST SETUP

1. **Database Migration**: Ensure `migration.sql` has been executed in Supabase SQL Editor for project `yduueujrykugmzvbnndu`.
2. **Secrets Configured**:
   ```bash
   supabase secrets set --project-ref yduueujrykugmzvbnndu RAZORPAY_KEY_ID="rzp_test_xxxx"
   supabase secrets set --project-ref yduueujrykugmzvbnndu RAZORPAY_KEY_SECRET="yyyy"
   supabase secrets set --project-ref yduueujrykugmzvbnndu RAZORPAY_WEBHOOK_SECRET="zzzz"
   ```
3. **Edge Functions Deployed**:
   `create-order`, `razorpay-webhook`, `cancel-order`, `validate-coupon`.

---

## 🧪 TEST CASE 1: Guest Cash on Delivery (COD) Order
*Goal: Verify guest checkout, pincode auto-fill, COD payment, atomic stock reduction, and order confirmation.*

1. Open **Shop Page** → Add 1 Saree to Cart.
2. Go to **Checkout Page** (`checkout.html`).
3. Enter Details:
   - Name: `Priya Patel`
   - Phone: `9876543210`
   - Email: `priya@example.com`
   - Pincode: `395007` → **Verify**: City (`Surat`) & State (`Gujarat`) auto-fill, serviceability badge turns green (`✓`).
   - Address: `102 Royal Residency, Ring Road`
4. Select Payment Method: **Cash on Delivery (COD)**.
5. Click **Place Order**.
6. **Expected Results**:
   - Order processed successfully without redirecting.
   - Screen updates to **Order Confirmed** showing readable Order ID (e.g. `SN-2026-001001`).
   - `snera_cart` is cleared from `localStorage`.
   - In Supabase Table `orders`: Row created with `status = 'pending'`, `payment_method = 'cod'`, `payment_status = 'pending'`.
   - In Supabase Table `products`: Product `stock` decreased by 1.

---

## 🧪 TEST CASE 2: Logged-in Razorpay Test-Mode Order
*Goal: Verify online payment via Razorpay modal and webhook signature handling.*

1. Log into customer account on storefront.
2. Add a Saree to Cart → Go to Checkout.
3. Verify saved addresses load automatically.
4. Select Payment Method: **Online Payment (Razorpay)**.
5. Click **Place Order**.
6. **Expected Results**:
   - Razorpay Checkout Modal opens overlay.
   - Select Test Payment method (e.g. Test Netbanking / Success UPI).
   - Complete test payment.
7. **Post-Payment Verification**:
   - Webhook `order.paid` fires → Signature verified with HMAC-SHA256.
   - In Supabase Table `orders`: Status changes to `paid`, `payment_status = 'completed'`, `razorpay_payment_id` saved.

---

## 🧪 TEST CASE 3: Failed Payment Handling
*Goal: Ensure failed payments do not reduce stock and prompt customer to retry or switch to COD.*

1. Add Saree to Cart → Go to Checkout → Select **Online Payment**.
2. Click **Place Order** → Razorpay Modal opens.
3. Select **Failure** in Razorpay Test Modal (or close/dismiss modal).
4. **Expected Results**:
   - Razorpay triggers payment failure event / modal dismiss callback.
   - Alert informs user payment was cancelled/failed.
   - Cart remains intact (NOT cleared).
   - In Supabase Table `products`: Product stock is **NOT** reduced.

---

## 🧪 TEST CASE 4: Order Cancellation & Refund Trigger
*Goal: Verify customer order cancellation, inventory stock restoration, and Razorpay online refund API trigger.*

1. Log into Admin Panel (`snera-admin.html`) or customer profile.
2. Select a `paid` order -> Trigger Cancellation (`cancel-order` Edge Function).
3. **Expected Results**:
   - Order status changes to `cancelled`, `cancelled_at` set.
   - In Supabase Table `products`: Product stock is incremented (+1) back to inventory.
   - `cancel-order` invokes Razorpay Refund API → Payment status changes to `refunded`.

---

## 🧪 TEST CASE 5: Coupon Validation & Server Price Safety
*Goal: Verify server-side promo code validation and anti-tampering.*

1. Go to Checkout with subtotal = ₹2,000.
2. Enter Promo Code `WELCOME10` → Click **Apply**.
3. **Expected Results**:
   - Edge Function `validate-coupon` calculates ₹200 (10%) discount.
   - Breakdown shows Subtotal: ₹2,000, Discount: -₹200, GST (5%): ₹90, Grand Total: ₹1,890.
4. Attempt to send fake price in client JSON payload -> Server `create-order` ignores client price and re-reads authoritative DB price.

---

## 🧪 TEST CASE 6: Overselling Protection (Two Buyers on Last Piece)
*Goal: Verify atomic stock locks (`FOR UPDATE`) prevent two users buying the last saree piece.*

1. Set a saree product stock to `1` in `products` table.
2. User A and User B open checkout simultaneously for this saree.
3. User A clicks **Place Order** milliseconds before User B.
4. **Expected Results**:
   - User A's transaction succeeds (`reduce_stock_atomic` returns `true`, stock becomes `0`).
   - User B's transaction receives error: *"Insufficient stock for product. Available: 0"*.
   - Overselling is impossible.

---

## 🧪 TEST CASE 7: Admin Login Gate & Non-Admin Rejection
*Goal: Verify security barrier on the new admin panel.*

1. Open `snera-admin.html` in an incognito window.
2. **Expected Result**: Login Gate screen `#sn-gate` appears, hiding all dashboard sections.
3. Enter credentials of a regular non-admin user.
4. **Expected Result**: Login fails with error: *"Access Denied: Account is not flagged as an admin."* User session is terminated immediately.
5. Enter credentials of a verified admin (`is_admin = true`).
6. **Expected Result**: Access granted, dashboard loads with live metrics.

---

## 🧪 TEST CASE 8: Mobile Layout Verification (360px & 390px)
*Goal: Verify zero horizontal overflow, touch target sizes, and iOS zoom prevention.*

1. Open Chrome DevTools → Toggle Device Toolbar.
2. Test Widths: **360px** (Samsung Galaxy S8/S20) and **390px** (iPhone 12/13/14).
3. **Checklist**:
   - [x] No horizontal scrollbar on any page (`overflow-x: clip`).
   - [x] All form inputs (`.sn-chk-input`, `.sn-input`) have `font-size: 16px` (prevents iOS auto-zoom).
   - [x] Touch targets (buttons, radios, toggles) are at least `44px x 44px`.
   - [x] Tables transform into card view on phones (`max-width: 720px`).
   - [x] Admin sidebar converts to smooth drawer with backdrop overlay.
