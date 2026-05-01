import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminInvoiceSettings = () => {
  const { toast } = useToast();
  const [row, setRow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("invoice_settings" as any).select("*").limit(1).maybeSingle().then(({ data }) => {
      setRow(data || {});
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: any) => setRow((r: any) => ({ ...r, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { id, updated_at, ...payload } = row || {};
    const { error } = id
      ? await supabase.from("invoice_settings" as any).update(payload).eq("id", id)
      : await supabase.from("invoice_settings" as any).insert(payload);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Invoice settings saved" });
  };

  if (loading) return <p className="font-body text-muted-foreground">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl mb-2">Invoice Settings</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">Business details used on invoices, receipts and customer-facing documents.</p>

      <div className="bg-card border border-border rounded-lg p-6 space-y-5 font-body">
        <h2 className="font-heading text-xl">Business identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Business name (display)</Label><Input value={row?.business_name || ""} onChange={(e) => set("business_name", e.target.value)} /></div>
          <div><Label>Legal name</Label><Input value={row?.legal_name || ""} onChange={(e) => set("legal_name", e.target.value)} /></div>
          <div><Label>GSTIN</Label><Input value={row?.gstin || ""} onChange={(e) => set("gstin", e.target.value)} /></div>
          <div><Label>Tax %</Label><Input type="number" value={row?.tax_percentage ?? 0} onChange={(e) => set("tax_percentage", Number(e.target.value))} /></div>
          <div><Label>Contact email</Label><Input value={row?.contact_email || ""} onChange={(e) => set("contact_email", e.target.value)} /></div>
          <div><Label>Contact phone</Label><Input value={row?.contact_phone || ""} onChange={(e) => set("contact_phone", e.target.value)} /></div>
        </div>

        <h2 className="font-heading text-xl pt-4 border-t border-border">Registered address</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Label>Address line 1</Label><Input value={row?.address_line1 || ""} onChange={(e) => set("address_line1", e.target.value)} /></div>
          <div className="col-span-2"><Label>Address line 2</Label><Input value={row?.address_line2 || ""} onChange={(e) => set("address_line2", e.target.value)} /></div>
          <div><Label>City</Label><Input value={row?.city || ""} onChange={(e) => set("city", e.target.value)} /></div>
          <div><Label>State</Label><Input value={row?.state || ""} onChange={(e) => set("state", e.target.value)} /></div>
          <div><Label>Pincode</Label><Input value={row?.pincode || ""} onChange={(e) => set("pincode", e.target.value)} /></div>
          <div><Label>Country</Label><Input value={row?.country || ""} onChange={(e) => set("country", e.target.value)} /></div>
        </div>

        <h2 className="font-heading text-xl pt-4 border-t border-border">Numbering</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Invoice prefix</Label><Input value={row?.invoice_prefix || ""} onChange={(e) => set("invoice_prefix", e.target.value)} placeholder="INV-" /></div>
          <div><Label>Next invoice #</Label><Input type="number" value={row?.next_invoice_number ?? 1} onChange={(e) => set("next_invoice_number", Number(e.target.value))} /></div>
        </div>

        <div><Label>Terms & conditions</Label><Textarea rows={4} value={row?.terms_and_conditions || ""} onChange={(e) => set("terms_and_conditions", e.target.value)} /></div>
        <div><Label>Footer note</Label><Textarea rows={2} value={row?.footer_note || ""} onChange={(e) => set("footer_note", e.target.value)} /></div>

        <Button variant="hero" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
};

export default AdminInvoiceSettings;
