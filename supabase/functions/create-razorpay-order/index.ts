// Create Razorpay order — requires authenticated user
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RZP_KEY = Deno.env.get("RAZORPAY_KEY_ID");
    const RZP_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RZP_KEY || !RZP_SECRET) throw new Error("Razorpay keys not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const user = userData.user;

    const body = await req.json();
    const items = body.items as Array<{ product_id: string; product_name: string; product_image?: string; size?: string; color?: string; quantity: number; unit_price: number }>;
    const shipping = body.shipping;
    const couponCode: string | null = body.coupon_code || null;
    if (!Array.isArray(items) || items.length === 0) throw new Error("Cart is empty");

    const subtotal = items.reduce((s, i) => s + Number(i.unit_price) * Number(i.quantity), 0);

    // Server-side coupon validation
    let discountAmount = 0;
    let appliedCoupon: string | null = null;
    if (couponCode) {
      const { data: vRows, error: vErr } = await supabase.rpc("validate_coupon", { _code: couponCode, _order_amount: subtotal });
      const v = (vRows as any[])?.[0];
      if (!vErr && v?.is_valid) {
        discountAmount = Number(v.discount_amount) || 0;
        appliedCoupon = v.code;
      }
    }

    // Server-side shipping calculation from admin settings
    let shipping_amount = 0;
    {
      const { data: ship } = await supabase
        .from("shipping_settings")
        .select("default_fee, free_shipping_threshold, enabled")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const fee = Number(ship?.default_fee ?? 99);
      const threshold = Number(ship?.free_shipping_threshold ?? 1999);
      const enabled = ship?.enabled ?? true;
      if (!enabled) shipping_amount = 0;
      else if (threshold > 0 && subtotal >= threshold) shipping_amount = 0;
      else shipping_amount = fee;
    }
    const total = Math.max(0, Math.round((subtotal - discountAmount + shipping_amount) * 100) / 100);
    const amountPaise = Math.round(total * 100);

    // Create Razorpay order
    const auth = btoa(`${RZP_KEY}:${RZP_SECRET}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt: `tw_${Date.now()}` }),
    });
    const rzpOrder = await rzpRes.json();
    if (!rzpRes.ok) throw new Error(`Razorpay error: ${JSON.stringify(rzpOrder)}`);

    // Persist DB order (pending). validate_order_insert trigger will re-check coupon.
    const { data: order, error: orderErr } = await supabase.from("orders").insert({
      user_id: user.id,
      status: "pending",
      total_amount: total,
      discount_amount: discountAmount,
      shipping_amount,
      coupon_code: appliedCoupon,
      payment_method: "razorpay",
      payment_status: "pending",
      razorpay_order_id: rzpOrder.id,
      shipping_name: shipping?.name,
      shipping_address: shipping?.address,
      shipping_city: shipping?.city,
      shipping_state: shipping?.state,
      shipping_pincode: shipping?.pincode,
      shipping_phone: shipping?.phone,
      billing_name: shipping?.name,
      billing_address: shipping?.address,
      billing_city: shipping?.city,
      billing_state: shipping?.state,
      billing_pincode: shipping?.pincode,
      billing_phone: shipping?.phone,
    }).select().single();
    if (orderErr) throw orderErr;

    const itemsRows = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      product_image: i.product_image,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      unit_price: i.unit_price,
    }));
    const { error: itemsErr } = await supabase.from("order_items").insert(itemsRows);
    if (itemsErr) throw itemsErr;

    return new Response(JSON.stringify({
      order_id: order.id,
      razorpay_order_id: rzpOrder.id,
      amount: amountPaise,
      currency: "INR",
      key_id: RZP_KEY,
      discount_amount: discountAmount,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("create-razorpay-order error:", e);
    return new Response(JSON.stringify({ error: e.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
