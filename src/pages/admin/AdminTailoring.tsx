import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminTailoring = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<Record<string, string>>({});

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from("tailoring_requests").select("*").order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("tailoring_requests").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Status updated"); refresh(); }
  };
  const saveQuote = async (id: string) => {
    const v = Number(quotes[id]);
    if (!v) return;
    const { error } = await supabase.from("tailoring_requests").update({ quoted_price: v }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Quote saved"); refresh(); }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl lg:text-3xl mb-6">Tailoring Requests</h1>
      {loading ? <p className="text-muted-foreground font-body">Loading…</p> :
        requests.length === 0 ? <p className="text-muted-foreground font-body">No requests yet.</p> : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-5 font-body">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-heading text-lg">{r.design_name}</p>
                  <p className="text-xs text-muted-foreground">#{r.id.slice(0, 8)} · {new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">Contact: {r.contact_email || "—"} · {r.contact_phone || "—"}</p>
                </div>
                <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                  <SelectTrigger className="w-40 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["pending","quoted","in_progress","ready","delivered","cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid lg:grid-cols-3 gap-3 text-sm border-t border-border pt-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Preferences</p>
                  <p>Fabric: {r.fabric_preference || "—"}</p>
                  <p>Color: {r.color_preference || "—"}</p>
                  {r.notes && <p className="text-muted-foreground mt-1">"{r.notes}"</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Measurements (in)</p>
                  <p>Bust {r.bust ?? "-"} · Waist {r.waist ?? "-"} · Hips {r.hips ?? "-"}</p>
                  <p>Shoulder {r.shoulder ?? "-"} · Sleeve {r.sleeve_length ?? "-"}</p>
                  <p>Top L {r.kurti_length ?? "-"} · Bottom L {r.bottom_length ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Quote</p>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={r.quoted_price ? `₹${r.quoted_price}` : "Enter quote"}
                      value={quotes[r.id] || ""}
                      onChange={(e) => setQuotes((p) => ({ ...p, [r.id]: e.target.value }))}
                      className="text-xs h-8"
                    />
                    <Button size="sm" onClick={() => saveQuote(r.id)}>Save</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTailoring;
