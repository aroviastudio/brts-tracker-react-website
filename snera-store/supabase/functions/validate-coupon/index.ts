// Supabase Edge Function: validate-coupon
// Validates a promo coupon against the database server-side.

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { code, subtotal } = await req.json();

    if (!code || typeof code !== "string") {
      return new Response(
        JSON.stringify({ valid: false, message: "Coupon code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const orderSubtotal = Number(subtotal) || 0;

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", cleanCode)
      .eq("status", "active")
      .maybeSingle();

    if (error || !coupon) {
      return new Response(
        JSON.stringify({ valid: false, message: "Invalid or expired coupon code" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Expiry check
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, message: "Coupon code has expired" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Usage limit check
    if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ valid: false, message: "Coupon usage limit reached" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Minimum order amount check
    if (coupon.min_order > 0 && orderSubtotal < coupon.min_order) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: `Minimum order value for this coupon is ₹${coupon.min_order}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.type === "percent") {
      discount = (orderSubtotal * Number(coupon.value)) / 100;
    } else if (coupon.type === "flat") {
      discount = Number(coupon.value);
    }

    if (discount > orderSubtotal) {
      discount = orderSubtotal;
    }

    return new Response(
      JSON.stringify({
        valid: true,
        coupon: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discount: Math.round(discount * 100) / 100,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ valid: false, message: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
