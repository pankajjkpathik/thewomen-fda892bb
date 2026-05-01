import { useEffect, useState } from "react";
import { useAdminStats } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, IndianRupee, Clock, CreditCard, Scissors, Users } from "lucide-react";

const AdminDashboard = () => {
  const stats = useAdminStats();
  const [extra, setExtra] = useState({ paidRevenue: 0, paidCount: 0, pendingPayments: 0, tailoringPending: 0, customers: 0 });

  useEffect(() => {
    (async () => {
      const [paidRes, tailRes, custRes] = await Promise.all([
        supabase.from("orders").select("total_amount, payment_status"),
        supabase.from("tailoring_requests").select("id, status"),
        supabase.rpc("admin_list_customers"),
      ]);
      if (custRes.error) console.error("admin_list_customers error:", custRes.error);
      const paid = (paidRes.data || []).filter((o) => o.payment_status === "paid");
      const pending = (paidRes.data || []).filter((o) => o.payment_status === "pending");
      const tailoringPending = (tailRes.data || []).filter((t) => t.status === "pending").length;
      setExtra({
        paidRevenue: paid.reduce((s, o) => s + Number(o.total_amount), 0),
        paidCount: paid.length,
        pendingPayments: pending.length,
        tailoringPending,
        customers: (custRes.data || []).length,
      });
    })();
  }, []);

  const cards = [
    { label: "Paid Revenue", value: `₹${extra.paidRevenue.toLocaleString()}`, icon: IndianRupee },
    { label: "Total Sales", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CreditCard },
    { label: "Total Orders", value: String(stats.totalOrders), icon: ShoppingCart },
    { label: "Pending Orders", value: String(stats.pendingOrders), icon: Clock },
    { label: "Customers", value: String(extra.customers), icon: Users },
    { label: "Pending Payments", value: String(extra.pendingPayments), icon: CreditCard },
    { label: "Products", value: String(stats.totalProducts), icon: Package },
    { label: "Paid Orders", value: String(extra.paidCount), icon: IndianRupee },
    { label: "Tailoring Pending", value: String(extra.tailoringPending), icon: Scissors },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl lg:text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-muted-foreground">{card.label}</span>
              <card.icon size={20} className="text-accent" />
            </div>
            <p className="font-heading text-2xl">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-body text-sm">
          <a href="/admin/products" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">Add New Product</a>
          <a href="/admin/orders" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">View Orders</a>
          <a href="/admin/customers" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">View Customers</a>
          <a href="/admin/tailoring" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">Tailoring Requests</a>
          <a href="/admin/coupons" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">Create Coupon</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
