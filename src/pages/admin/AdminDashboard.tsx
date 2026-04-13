import { useAdminStats } from "@/hooks/useAdmin";
import { Package, ShoppingCart, IndianRupee, Clock } from "lucide-react";

const statCards = [
  { key: "totalRevenue" as const, label: "Total Revenue", icon: IndianRupee, format: (v: number) => `₹${v.toLocaleString()}` },
  { key: "totalOrders" as const, label: "Total Orders", icon: ShoppingCart, format: (v: number) => String(v) },
  { key: "totalProducts" as const, label: "Products", icon: Package, format: (v: number) => String(v) },
  { key: "pendingOrders" as const, label: "Pending Orders", icon: Clock, format: (v: number) => String(v) },
];

const AdminDashboard = () => {
  const stats = useAdminStats();

  return (
    <div>
      <h1 className="font-heading text-2xl lg:text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.key} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-muted-foreground">{card.label}</span>
              <card.icon size={20} className="text-accent" />
            </div>
            <p className="font-heading text-2xl">{card.format(stats[card.key])}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-sm">
          <a href="/admin/products" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">
            Add New Product
          </a>
          <a href="/admin/orders" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">
            View Orders
          </a>
          <a href="/admin/coupons" className="p-4 border border-border rounded hover:bg-muted transition-colors text-center">
            Create Coupon
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
