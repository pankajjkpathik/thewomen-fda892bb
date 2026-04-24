import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const TailorMadePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();

  const designs = products.filter((p) => p.category === "Tailor Made");
  const initialId = params.get("product") || "";
  const [selected, setSelected] = useState(initialId);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fabric_preference: "", color_preference: "",
    bust: "", waist: "", hips: "", shoulder: "", sleeve_length: "", kurti_length: "", bottom_length: "",
    notes: "", contact_phone: "", contact_email: "",
  });

  useEffect(() => {
    if (initialId) setSelected(initialId);
  }, [initialId]);

  const submit = async () => {
    if (!user) {
      navigate("/login?next=/tailor-made");
      return;
    }
    if (!selected) {
      toast({ title: "Pick a design first", variant: "destructive" });
      return;
    }
    const product = products.find((p) => p.id === selected);
    if (!product) return;
    setSubmitting(true);
    const num = (v: string) => (v ? Number(v) : null);
    const { error } = await supabase.from("tailoring_requests").insert({
      user_id: user.id,
      product_id: product.id,
      design_name: product.name,
      fabric_preference: form.fabric_preference,
      color_preference: form.color_preference,
      bust: num(form.bust), waist: num(form.waist), hips: num(form.hips),
      shoulder: num(form.shoulder), sleeve_length: num(form.sleeve_length),
      kurti_length: num(form.kurti_length), bottom_length: num(form.bottom_length),
      notes: form.notes,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email || user.email,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted!", description: "Our team will get in touch within 24 hours with a quote." });
      navigate("/account?tab=tailoring");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-body mb-2">Made For You</p>
        <h1 className="font-heading text-3xl lg:text-5xl mb-3">Get Stitched to Your Size</h1>
        <p className="font-body text-muted-foreground max-w-2xl mx-auto">
          Pick a design, share your measurements and fabric preferences. Our master tailors craft each piece to your exact size.
        </p>
      </div>

      {/* Design selection */}
      <h2 className="font-heading text-xl mb-4">1. Choose a Design</h2>
      {loading ? (
        <p className="text-muted-foreground font-body">Loading designs…</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {designs.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className={`text-left rounded overflow-hidden border-2 transition-all ${selected === d.id ? "border-accent shadow-lg" : "border-transparent hover:border-border"}`}
            >
              <img src={d.image} alt={d.name} className="w-full aspect-[3/4] object-cover" loading="lazy" />
              <div className="p-3 bg-card">
                <p className="font-heading text-sm">{d.name.replace(" (Tailor Made)", "")}</p>
                <p className="font-body text-xs text-muted-foreground">Starting ₹{d.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!user && !authLoading && (
        <div className="bg-muted rounded-lg p-6 text-center font-body mb-8">
          <p className="mb-3">Please sign in to submit your measurements.</p>
          <Link to="/login?next=/tailor-made"><Button variant="hero">Sign in to continue</Button></Link>
        </div>
      )}

      {user && (
        <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
          <h2 className="font-heading text-xl mb-4">2. Your Preferences</h2>
          <div className="grid lg:grid-cols-2 gap-4 mb-6 font-body">
            <div><Label>Fabric Preference</Label><Input value={form.fabric_preference} onChange={(e) => setForm({ ...form, fabric_preference: e.target.value })} placeholder="e.g. Silk, Cotton, Georgette" /></div>
            <div><Label>Color Preference</Label><Input value={form.color_preference} onChange={(e) => setForm({ ...form, color_preference: e.target.value })} placeholder="e.g. Maroon" /></div>
          </div>

          <h2 className="font-heading text-xl mb-4">3. Measurements (in inches)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 font-body">
            {[
              ["bust","Bust"],["waist","Waist"],["hips","Hips"],["shoulder","Shoulder"],
              ["sleeve_length","Sleeve length"],["kurti_length","Kurti/Top length"],["bottom_length","Bottom length"],
            ].map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input type="number" step="0.1" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>

          <h2 className="font-heading text-xl mb-4">4. Contact & Notes</h2>
          <div className="grid lg:grid-cols-2 gap-4 mb-4 font-body">
            <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder={user.email || ""} /></div>
          </div>
          <Label>Notes (optional)</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requests…" rows={3} className="font-body" />

          <Button variant="hero" size="lg" className="mt-6 w-full lg:w-auto" onClick={submit} disabled={submitting || !selected}>
            {submitting ? "Submitting…" : "Submit Tailoring Request"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TailorMadePage;
