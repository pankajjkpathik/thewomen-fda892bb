import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminPaymentSettings = () => {
  const { toast } = useToast();
  const [row, setRow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("payment_settings" as any).select("*").limit(1).maybeSingle().then(({ data }) => {
      setRow(data || {});
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: string) => setRow((r: any) => ({ ...r, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { id, updated_at, ...payload } = row || {};
    const { error } = id
      ? await supabase.from("payment_settings" as any).update(payload).eq("id", id)
      : await supabase.from("payment_settings" as any).insert(payload);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Payment settings saved" });
  };

  if (loading) return <p className="font-body text-muted-foreground">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl mb-2">Payment & Banking</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Razorpay credentials are stored as secure backend secrets. This page records public/business banking details for invoices and payouts reference.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 space-y-5 font-body">
        <h2 className="font-heading text-xl">Razorpay</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Razorpay Key ID (publishable)</Label><Input value={row?.razorpay_key_id || ""} onChange={(e) => set("razorpay_key_id", e.target.value)} placeholder="rzp_live_xxxx" /></div>
          <div><Label>Mode</Label><Input value={row?.razorpay_mode || ""} onChange={(e) => set("razorpay_mode", e.target.value)} placeholder="test or live" /></div>
        </div>
        <p className="text-xs text-muted-foreground">The secret key is stored separately as a protected backend secret and is never displayed here.</p>

        <h2 className="font-heading text-xl pt-4 border-t border-border">Bank Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Label>Account holder name</Label><Input value={row?.bank_account_holder || ""} onChange={(e) => set("bank_account_holder", e.target.value)} /></div>
          <div><Label>Bank name</Label><Input value={row?.bank_name || ""} onChange={(e) => set("bank_name", e.target.value)} /></div>
          <div><Label>Account number</Label><Input value={row?.bank_account_number || ""} onChange={(e) => set("bank_account_number", e.target.value)} /></div>
          <div><Label>IFSC code</Label><Input value={row?.bank_ifsc || ""} onChange={(e) => set("bank_ifsc", e.target.value)} /></div>
          <div><Label>UPI ID</Label><Input value={row?.upi_id || ""} onChange={(e) => set("upi_id", e.target.value)} /></div>
          <div className="col-span-2"><Label>PAN</Label><Input value={row?.pan_number || ""} onChange={(e) => set("pan_number", e.target.value)} /></div>
          <div className="col-span-2"><Label>Notes</Label><Textarea value={row?.notes || ""} onChange={(e) => set("notes", e.target.value)} /></div>
        </div>

        <Button variant="hero" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
};

export default AdminPaymentSettings;
