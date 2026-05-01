import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";

interface ShippingSettings {
  id?: string;
  default_fee: number;
  free_shipping_threshold: number;
  enabled: boolean;
  notes: string | null;
}

const DEFAULTS: ShippingSettings = {
  default_fee: 99,
  free_shipping_threshold: 1999,
  enabled: true,
  notes: "",
};

const AdminShippingSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ShippingSettings>(DEFAULTS);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("shipping_settings")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        toast({ title: "Failed to load settings", description: error.message, variant: "destructive" });
      } else if (data) {
        setSettings({
          id: data.id,
          default_fee: Number(data.default_fee),
          free_shipping_threshold: Number(data.free_shipping_threshold),
          enabled: data.enabled,
          notes: data.notes || "",
        });
      }
      setLoading(false);
    })();
  }, [toast]);

  const save = async () => {
    setSaving(true);
    const payload = {
      default_fee: Number(settings.default_fee) || 0,
      free_shipping_threshold: Number(settings.free_shipping_threshold) || 0,
      enabled: settings.enabled,
      notes: settings.notes,
    };
    const { error } = settings.id
      ? await supabase.from("shipping_settings").update(payload).eq("id", settings.id)
      : await supabase.from("shipping_settings").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Shipping settings saved" });
    }
  };

  if (loading) return <div className="p-8 font-body text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="text-primary" />
        <div>
          <h1 className="font-heading text-2xl">Shipping Charges</h1>
          <p className="font-body text-sm text-muted-foreground">
            Configure default shipping fee and free shipping threshold.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-body">Charge shipping fee</Label>
            <p className="text-xs text-muted-foreground">Turn off to make all orders ship free.</p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Default shipping fee (₹)</Label>
            <Input
              type="number"
              min={0}
              value={settings.default_fee}
              onChange={(e) => setSettings({ ...settings, default_fee: Number(e.target.value) })}
              disabled={!settings.enabled}
            />
          </div>
          <div>
            <Label>Free shipping above (₹)</Label>
            <Input
              type="number"
              min={0}
              value={settings.free_shipping_threshold}
              onChange={(e) =>
                setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
              }
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set to 0 to disable free-shipping threshold.
            </p>
          </div>
        </div>

        <div>
          <Label>Notes (internal)</Label>
          <Textarea
            value={settings.notes || ""}
            onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
            rows={3}
          />
        </div>

        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminShippingSettings;
