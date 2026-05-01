import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { Tag, Check, X } from "lucide-react";

declare global {
  interface Window { Razorpay: any }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

interface AppliedCoupon {
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [shipping, setShipping] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [validating, setValidating] = useState(false);
  const [shippingConfig, setShippingConfig] = useState<{ default_fee: number; free_shipping_threshold: number; enabled: boolean }>({
    default_fee: 99,
    free_shipping_threshold: 1999,
    enabled: true,
  });

  useEffect(() => {
    supabase
      .from("shipping_settings")
      .select("default_fee, free_shipping_threshold, enabled")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setShippingConfig({
            default_fee: Number(data.default_fee),
            free_shipping_threshold: Number(data.free_shipping_threshold),
            enabled: data.enabled,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?next=/checkout");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data) {
          setShipping((s) => ({
            ...s,
            name: data.full_name || s.name,
            phone: data.phone || s.phone,
            address: data.default_address || s.address,
            city: data.default_city || s.city,
            state: data.default_state || s.state,
            pincode: data.default_pincode || s.pincode,
          }));
        }
      });
    }
  }, [user]);

  // Re-validate coupon when subtotal changes
  useEffect(() => {
    if (coupon) {
      supabase.rpc("validate_coupon", { _code: coupon.code, _order_amount: totalPrice }).then(({ data }) => {
        const row = (data as any[])?.[0];
        if (!row?.is_valid) setCoupon(null);
        else setCoupon({
          code: row.code,
          discount_type: row.discount_type,
          discount_value: Number(row.discount_value),
          discount_amount: Number(row.discount_amount),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice]);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setValidating(true);
    const { data, error } = await supabase.rpc("validate_coupon", { _code: code, _order_amount: totalPrice });
    setValidating(false);
    const row = (data as any[])?.[0];
    if (error || !row?.is_valid) {
      toast({ title: "Coupon invalid", description: row?.message || error?.message || "Could not apply", variant: "destructive" });
      setCoupon(null);
      return;
    }
    setCoupon({
      code: row.code,
      discount_type: row.discount_type,
      discount_value: Number(row.discount_value),
      discount_amount: Number(row.discount_amount),
    });
    toast({ title: "Coupon applied", description: `${row.code} — you saved ₹${Number(row.discount_amount).toLocaleString()}` });
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
  };

  const shippingFee = !shippingConfig.enabled
    ? 0
    : shippingConfig.free_shipping_threshold > 0 && totalPrice >= shippingConfig.free_shipping_threshold
    ? 0
    : shippingConfig.default_fee;
  const discountAmount = coupon?.discount_amount || 0;
  const grandTotal = Math.max(0, totalPrice - discountAmount + shippingFee);

  const handlePay = async () => {
    if (!user) return;
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }
    for (const k of ["name", "phone", "address", "city", "state", "pincode"] as const) {
      if (!shipping[k]) {
        toast({ title: "Address incomplete", description: `Please fill ${k}`, variant: "destructive" });
        return;
      }
    }
    setSubmitting(true);
    const ok = await loadRazorpayScript();
    if (!ok) {
      toast({ title: "Failed to load Razorpay", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
      body: {
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          product_image: i.product.image,
          size: i.size,
          quantity: i.quantity,
          unit_price: i.product.price,
        })),
        shipping,
        coupon_code: coupon?.code || null,
      },
    });
    if (error || !data?.razorpay_order_id) {
      toast({ title: "Could not start checkout", description: error?.message || data?.error, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      name: "The Women",
      description: "Order payment",
      order_id: data.razorpay_order_id,
      prefill: { name: shipping.name, email: user.email, contact: shipping.phone },
      theme: { color: "#1a1a1a" },
      handler: async (resp: any) => {
        const { data: vData, error: vErr } = await supabase.functions.invoke("verify-razorpay-payment", {
          body: {
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
            order_id: data.order_id,
          },
        });
        if (vErr || !vData?.verified) {
          toast({ title: "Payment verification failed", variant: "destructive" });
        } else {
          toast({ title: "Payment successful", description: "Your order is confirmed." });
          clearCart();
          navigate("/account?tab=orders");
        }
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    });
    rzp.open();
  };

  if (authLoading || !user) return <div className="container mx-auto px-4 py-20 text-center font-body text-muted-foreground">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
      <SEO title="Checkout | The Women" description="Secure checkout for your order at The Women." />
      <h1 className="font-heading text-3xl mb-8">Checkout</h1>
      {items.length === 0 ? (
        <p className="font-body text-muted-foreground">Your bag is empty. <a href="/shop" className="underline">Continue shopping</a>.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-heading text-xl">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3 font-body">
              <div className="col-span-2"><Label>Full name</Label><Input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} /></div>
              <div><Label>Pincode</Label><Input value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })} /></div>
              <div className="col-span-2"><Label>Address</Label><Input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} /></div>
              <div><Label>City</Label><Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} /></div>
              <div><Label>State</Label><Input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} /></div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h2 className="font-heading text-xl mb-4">Order Summary</h2>
            <div className="space-y-3 font-body text-sm border-b border-border pb-4">
              {items.map((i) => (
                <div key={`${i.product.id}-${i.size}`} className="flex justify-between">
                  <span>{i.product.name} ({i.size}) × {i.quantity}</span>
                  <span>₹{(i.product.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="py-4 border-b border-border">
              <Label className="font-body text-xs text-muted-foreground flex items-center gap-1 mb-2"><Tag size={12} /> Have a coupon code?</Label>
              {coupon ? (
                <div className="flex items-center justify-between bg-accent/10 border border-accent/30 rounded px-3 py-2">
                  <div className="flex items-center gap-2 text-sm font-body">
                    <Check size={14} className="text-accent" />
                    <span className="font-semibold">{coupon.code}</span>
                    <span className="text-muted-foreground text-xs">
                      ({coupon.discount_type === "percentage" ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`})
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive" aria-label="Remove coupon">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="text-sm" />
                  <Button variant="outline" size="sm" onClick={applyCoupon} disabled={validating || !couponCode}>
                    {validating ? "..." : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2 font-body text-sm py-4 border-b border-border">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Coupon ({coupon!.code})</span>
                  <span>− ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span></div>
            </div>
            <div className="flex justify-between font-heading text-lg pt-4">
              <span>Total</span><span>₹{grandTotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <p className="text-xs text-accent font-body mt-2 text-right">You save ₹{discountAmount.toLocaleString()}!</p>
            )}
            <Button variant="hero" size="lg" className="w-full mt-6" onClick={handlePay} disabled={submitting}>
              {submitting ? "Processing…" : `Pay ₹${grandTotal.toLocaleString()} with Razorpay`}
            </Button>
            <p className="text-xs text-muted-foreground font-body mt-3 text-center">Test Mode — use Razorpay test cards.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
