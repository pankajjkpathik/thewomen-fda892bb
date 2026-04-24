import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import OrderTimeline from "@/components/OrderTimeline";
import SEO from "@/components/SEO";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AccountPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();

  const [profile, setProfile] = useState({ full_name: "", phone: "", default_address: "", default_city: "", default_state: "", default_pincode: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [tailoring, setTailoring] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login?next=/account");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({
        full_name: data.full_name || "", phone: data.phone || "",
        default_address: data.default_address || "", default_city: data.default_city || "",
        default_state: data.default_state || "", default_pincode: data.default_pincode || "",
      });
    });
    supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      setOrders(data || []);
    });
    supabase.from("tailoring_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      setTailoring(data || []);
    });
  }, [user]);

  // Realtime subscription for live order tracking
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`account-orders-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updated = payload.new as any;
          setOrders((prev) => {
            const idx = prev.findIndex((o) => o.id === updated.id);
            if (idx === -1) return prev;
            const oldStatus = prev[idx].status;
            if (oldStatus !== updated.status) {
              toast({ title: "Order update", description: `Order #${updated.id.slice(0, 8)} is now ${updated.status}.` });
            }
            const next = [...prev];
            next[idx] = { ...prev[idx], ...updated };
            return next;
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newOrder = payload.new as any;
          setOrders((prev) => [{ ...newOrder, order_items: [] }, ...prev]);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...profile }, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated" });
  };

  if (authLoading || !user) return <div className="container mx-auto px-4 py-20 text-center font-body text-muted-foreground">Loading…</div>;

  const defaultTab = params.get("tab") || "profile";

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
      <SEO title="My Account | The Women" description="Manage your profile, orders, and tailoring requests." />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl">My Account</h1>
          <p className="font-body text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut().then(() => navigate("/"))}>Sign out</Button>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="tailoring">Tailoring ({tailoring.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="bg-card border border-border rounded-lg p-6 mt-4">
          <div className="grid grid-cols-2 gap-4 font-body">
            <div className="col-span-2"><Label>Full name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div><Label>Pincode</Label><Input value={profile.default_pincode} onChange={(e) => setProfile({ ...profile, default_pincode: e.target.value })} /></div>
            <div className="col-span-2"><Label>Address</Label><Input value={profile.default_address} onChange={(e) => setProfile({ ...profile, default_address: e.target.value })} /></div>
            <div><Label>City</Label><Input value={profile.default_city} onChange={(e) => setProfile({ ...profile, default_city: e.target.value })} /></div>
            <div><Label>State</Label><Input value={profile.default_state} onChange={(e) => setProfile({ ...profile, default_state: e.target.value })} /></div>
          </div>
          <Button variant="hero" className="mt-4" onClick={saveProfile} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-4">
          {orders.length === 0 && <p className="text-muted-foreground font-body">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="bg-card border border-border rounded-lg p-5 font-body">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)}</p>
                  <p className="font-heading text-lg">₹{Number(o.total_amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColor[o.status] || ""}`}>{o.status}</span>
                  <p className="text-xs text-muted-foreground mt-1">Payment: {o.payment_status}</p>
                </div>
              </div>

              <OrderTimeline
                status={o.status}
                trackingId={o.tracking_id}
                trackingUrl={o.tracking_url}
                shippedAt={o.shipped_at}
                deliveredAt={o.delivered_at}
                createdAt={o.created_at}
                paymentStatus={o.payment_status}
              />

              <div className="pt-3 text-sm space-y-1">
                {o.order_items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between text-muted-foreground">
                    <span>{it.product_name} {it.size ? `(${it.size})` : ""} × {it.quantity}</span>
                    <span>₹{(Number(it.unit_price) * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {Number(o.discount_amount) > 0 && (
                  <div className="flex justify-between text-accent text-xs pt-1">
                    <span>Coupon ({o.coupon_code})</span>
                    <span>− ₹{Number(o.discount_amount).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tailoring" className="space-y-4 mt-4">
          {tailoring.length === 0 && <p className="text-muted-foreground font-body">No tailoring requests yet.</p>}
          {tailoring.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-lg p-5 font-body">
              <div className="flex justify-between mb-2">
                <p className="font-heading text-lg">{t.design_name}</p>
                <span className={`text-xs px-2 py-1 rounded ${statusColor[t.status] || "bg-yellow-100 text-yellow-800"}`}>{t.status}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {t.fabric_preference && <p>Fabric: {t.fabric_preference}</p>}
                {t.color_preference && <p>Color: {t.color_preference}</p>}
                {t.quoted_price && <p className="text-foreground">Quoted: ₹{Number(t.quoted_price).toLocaleString()}</p>}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
