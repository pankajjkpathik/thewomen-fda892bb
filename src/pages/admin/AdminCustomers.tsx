import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Search } from "lucide-react";

interface Customer {
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("admin_list_customers");
      if (!error && data) setCustomers(data as Customer[]);
      setLoading(false);
    })();
  }, []);

  const filtered = customers.filter((c) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      c.email?.toLowerCase().includes(s) ||
      c.full_name?.toLowerCase().includes(s) ||
      c.phone?.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl">Customers</h1>
          <p className="font-body text-sm text-muted-foreground">{customers.length} total</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No customers found.</td></tr>
              )}
              {filtered.map((c) => (
                <tr key={c.user_id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">{c.full_name || <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                      <Mail size={14} />{c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {c.phone ? (
                      <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                        <Phone size={14} />{c.phone}
                      </a>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">{c.order_count}</td>
                  <td className="px-4 py-3">₹{Number(c.total_spent).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
