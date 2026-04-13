import { useState } from "react";
import { useAdminCoupons } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminCoupons = () => {
  const { coupons, loading, addCoupon, deleteCoupon, toggleCoupon } = useAdminCoupons();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "flat",
    discount_value: 0,
    min_order_amount: 0,
    max_uses: null as number | null,
    expires_at: "",
  });

  const handleSubmit = async () => {
    if (!form.code || !form.discount_value) {
      toast.error("Code and discount value are required");
      return;
    }
    const error = await addCoupon({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_order_amount: form.min_order_amount || 0,
      max_uses: form.max_uses,
      expires_at: form.expires_at || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Coupon created");
      setOpen(false);
      setForm({ code: "", discount_type: "percentage", discount_value: 0, min_order_amount: 0, max_uses: null, expires_at: "" });
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteCoupon(id);
    if (error) toast.error(error.message);
    else toast.success("Coupon deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl lg:text-3xl">Coupons</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus size={16} /> Create Coupon</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-background">
            <DialogHeader>
              <DialogTitle className="font-heading">New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 font-body text-sm">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Coupon Code *</label>
                <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Discount Type</label>
                  <Select value={form.discount_type} onValueChange={(v: "percentage" | "flat") => setForm((p) => ({ ...p, discount_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Value *</label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm((p) => ({ ...p, discount_value: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min Order Amount</label>
                  <Input type="number" value={form.min_order_amount} onChange={(e) => setForm((p) => ({ ...p, min_order_amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max Uses</label>
                  <Input type="number" value={form.max_uses || ""} onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value ? Number(e.target.value) : null }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Expiry Date</label>
                <Input type="date" value={form.expires_at} onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="hero" onClick={handleSubmit}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-body">No coupons yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-2">Code</th>
                <th className="py-3 px-2">Discount</th>
                <th className="py-3 px-2">Min Order</th>
                <th className="py-3 px-2">Usage</th>
                <th className="py-3 px-2">Expires</th>
                <th className="py-3 px-2">Active</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-2 font-semibold">{c.code}</td>
                  <td className="py-3 px-2">
                    {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${Number(c.discount_value).toLocaleString()}`}
                  </td>
                  <td className="py-3 px-2">₹{Number(c.min_order_amount || 0).toLocaleString()}</td>
                  <td className="py-3 px-2">{c.used_count || 0}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="py-3 px-2">
                    <Switch checked={c.is_active ?? false} onCheckedChange={(v) => toggleCoupon(c.id, v)} />
                  </td>
                  <td className="py-3 px-2">
                    <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
