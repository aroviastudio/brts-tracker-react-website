// Supabase Edge Function: cancel-order
// Server-side cancellation handler.
// Restores inventory stock and initiates Razorpay online refund if paid.

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
    const { order_id, cancel_reason } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order record
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${order_id},order_id.eq.${order_id}`)
      .maybeSingle();

    if (error || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check cancellation eligibility
    const cancellableStatuses = ["pending", "paid", "processing"];
    if (!cancellableStatuses.includes(order.status)) {
      return new Response(
        JSON.stringify({
          error: `Order cannot be cancelled because it is already ${order.status}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Restore stock for all items
    const items = order.items || [];
    for (const item of items) {
      if (item.product_id) {
        const qty = Number(item.quantity) || 1;
        // Fetch current stock and add back
        const { data: prod } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .maybeSingle();

        if (prod) {
          await supabase
            .from("products")
            .update({ stock: (prod.stock || 0) + qty, updated_at: new Date().toISOString() })
            .eq("id", item.product_id);
        }
      }
    }

    // 2. Razorpay Refund if online payment was completed
    let refundIssued = false;
    if (
      order.payment_status === "completed" &&
      order.razorpay_payment_id &&
      razorpayKeyId &&
      razorpayKeySecret
    ) {
      try {
        const rzpAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
        const rzpRes = await fetch(
          `https://api.razorpay.com/v1/payments/${order.razorpay_payment_id}/refund`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${rzpAuth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notes: {
                reason: cancel_reason || "Customer requested cancellation",
              },
            }),
          }
        );

        if (rzpRes.ok) {
          refundIssued = true;
        }
      } catch (e) {
        console.error("Razorpay refund trigger error:", e);
      }
    }

    // 3. Update Order record
    const { error: updateErr } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        payment_status: refundIssued ? "refunded" : order.payment_status,
        cancel_reason: cancel_reason || "Customer requested cancellation",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateErr) {
      return new Response(
        JSON.stringify({ error: "Failed to update order status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order cancelled successfully" + (refundIssued ? " and refund initiated." : "."),
        order_id: order.order_id,
        refund_initiated: refundIssued,
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
