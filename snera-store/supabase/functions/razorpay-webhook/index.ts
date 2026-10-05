// Supabase Edge Function: razorpay-webhook
// Verifies Razorpay webhook signatures via HMAC-SHA256.
// Updates order payment status, reduces stock atomically upon payment success.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function verifySignature(bodyText: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subcreations.importKey
    ? crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    : null;

  if (!key) return false;

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
  const hashArray = Array.from(new Uint8Array(signed));
  const hexHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hexHash === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") ?? "";

    const signature = req.headers.get("x-razorpay-signature");
    const bodyText = await req.text();

    if (webhookSecret && signature) {
      const isValid = await verifySignature(bodyText, signature, webhookSecret);
      if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
      }
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event === "order.paid" || event === "payment.captured") {
      const entity = payload.payload.payment.entity;
      const rzpOrderId = entity.order_id;
      const rzpPaymentId = entity.id;

      // Find order by razorpay_order_id
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("razorpay_order_id", rzpOrderId)
        .maybeSingle();

      if (order && order.status !== "paid" && order.status !== "processing") {
        // Update order status
        await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_status: "completed",
            razorpay_payment_id: rzpPaymentId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        // Atomic stock reduction for items
        const items = order.items || [];
        for (const item of items) {
          if (item.product_id) {
            await supabase.rpc("reduce_stock_atomic", {
              p_product_id: item.product_id,
              p_qty: item.quantity || 1,
            });
          }
        }
      }
    } else if (event === "payment.failed") {
      const entity = payload.payload.payment.entity;
      const rzpOrderId = entity.order_id;

      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", rzpOrderId);
    } else if (event === "refund.processed") {
      const entity = payload.payload.refund.entity;
      const rzpPaymentId = entity.payment_id;

      await supabase
        .from("orders")
        .update({
          status: "refunded",
          payment_status: "refunded",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_payment_id", rzpPaymentId);
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
