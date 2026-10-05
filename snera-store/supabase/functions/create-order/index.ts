// Supabase Edge Function: create-order
// Server-side order creation & price validation.
// Calculates GST (prices GST-excluded), shipping fees, coupon discount, creates order record.
// For online payments, creates Razorpay order.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") ?? "";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      items,
      shipping_address,
      customer_name,
      customer_email,
      customer_phone,
      payment_method,
      coupon_code,
      user_id,
    } = body;

    // 1. Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Cart is empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customer_name || !customer_phone || !shipping_address) {
      return new Response(
        JSON.stringify({ error: "Customer name, phone, and address are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payMethod = (payment_method || "cod").toLowerCase();
    if (!["cod", "online", "razorpay"].includes(payMethod)) {
      return new Response(
        JSON.stringify({ error: "Invalid payment method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch Store Settings
    const { data: storeSettings } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const codEnabled = storeSettings?.cod_enabled ?? true;
    const gstRate = Number(storeSettings?.gst_rate ?? 5.00);
    const freeShippingThreshold = Number(storeSettings?.free_shipping_threshold ?? 999.00);

    if (payMethod === "cod" && !codEnabled) {
      return new Response(
        JSON.stringify({ error: "Cash on Delivery (COD) is currently disabled" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Re-verify prices & stock strictly from Database
    const productIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, name, price, stock, sku, free_shipping, status")
      .in("id", productIds);

    if (prodErr || !dbProducts || dbProducts.length !== productIds.length) {
      return new Response(
        JSON.stringify({ error: "One or more products are invalid or no longer exist" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));
    let subtotal = 0;
    let allItemsFreeShipping = true;
    const verifiedItems: any[] = [];

    for (const item of items) {
      const dbProd = productMap.get(item.id);
      const qty = Math.max(1, Number(item.quantity) || 1);

      if (!dbProd || dbProd.status !== "active") {
        return new Response(
          JSON.stringify({ error: `Product "${dbProd?.name || item.id}" is inactive` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (dbProd.stock < qty) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for "${dbProd.name}". Available: ${dbProd.stock}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!dbProd.free_shipping) {
        allItemsFreeShipping = false;
      }

      const itemTotal = Number(dbProd.price) * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        product_id: dbProd.id,
        name: dbProd.name,
        price: Number(dbProd.price),
        sku: dbProd.sku,
        quantity: qty,
        total: itemTotal,
      });
    }

    // 4. Coupon validation
    let discount = 0;
    if (coupon_code && typeof coupon_code === "string") {
      const cleanCode = coupon_code.trim().toUpperCase();
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", cleanCode)
        .eq("status", "active")
        .maybeSingle();

      if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) >= new Date())) {
        if (coupon.min_order === 0 || subtotal >= Number(coupon.min_order)) {
          if (coupon.type === "percent") {
            discount = (subtotal * Number(coupon.value)) / 100;
          } else if (coupon.type === "flat") {
            discount = Number(coupon.value);
          }
          if (discount > subtotal) discount = subtotal;
        }
      }
    }

    // 5. Calculate GST & Shipping
    // Prices are GST-excluded per user requirement (added on top)
    const discountedSubtotal = subtotal - discount;
    const gstAmount = (discountedSubtotal * gstRate) / 100;

    let shippingFee = 0;
    if (subtotal < freeShippingThreshold && !allItemsFreeShipping) {
      shippingFee = 100; // Standard shipping flat rate if threshold not met
    }

    const grandTotal = Math.round((discountedSubtotal + gstAmount + shippingFee) * 100) / 100;

    // 6. Create Order Row in Database (status: 'pending')
    const { data: newOrder, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user_id || null,
          customer_name,
          customer_email: customer_email || null,
          customer_phone,
          shipping_address,
          items: verifiedItems,
          subtotal: Math.round(subtotal * 100) / 100,
          gst: Math.round(gstAmount * 100) / 100,
          shipping: shippingFee,
          discount: Math.round(discount * 100) / 100,
          total: grandTotal,
          status: "pending",
          payment_status: "pending",
          payment_method: payMethod,
        },
      ])
      .select()
      .single();

    if (orderErr || !newOrder) {
      return new Response(
        JSON.stringify({ error: "Failed to create order record: " + orderErr?.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert Order Items line entries
    const orderItemRows = verifiedItems.map((v) => ({
      order_id: newOrder.id,
      product_id: v.product_id,
      product_name: v.name,
      sku: v.sku,
      price: v.price,
      quantity: v.quantity,
      total: v.total,
    }));
    await supabase.from("order_items").insert(orderItemRows);

    // 7. Payment Execution
    if (payMethod === "cod") {
      // For COD, reduce stock atomically immediately
      for (const item of verifiedItems) {
        await supabase.rpc("reduce_stock_atomic", {
          p_product_id: item.product_id,
          p_qty: item.quantity,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          order_id: newOrder.order_id,
          id: newOrder.id,
          total: grandTotal,
          payment_method: "cod",
          status: "pending",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For Online Payments: Create Razorpay Order
    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({
          error: "Razorpay credentials are not configured on the server",
          order_id: newOrder.order_id,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rzpAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${rzpAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(grandTotal * 100), // amount in paise
        currency: "INR",
        receipt: newOrder.order_id,
        notes: {
          order_db_id: newOrder.id,
          customer_phone,
        },
      }),
    });

    const rzpOrderData = await rzpRes.json();
    if (!rzpRes.ok) {
      return new Response(
        JSON.stringify({ error: "Razorpay order creation failed: " + (rzpOrderData.error?.description || "Unknown error") }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save Razorpay order_id to database row
    await supabase
      .from("orders")
      .update({ razorpay_order_id: rzpOrderData.id })
      .eq("id", newOrder.id);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: newOrder.order_id,
        id: newOrder.id,
        total: grandTotal,
        payment_method: "online",
        razorpay_order_id: rzpOrderData.id,
        razorpay_key_id: razorpayKeyId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
