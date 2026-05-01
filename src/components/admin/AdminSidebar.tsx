import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Tag, ArrowLeft, Scissors, CreditCard, FileText } from "lucide-react";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/tailoring", icon: Scissors, label: "Tailoring" },
  { to: "/admin/coupons", icon: Tag, label: "Coupons" },
  { to: "/admin/payment", icon: CreditCard, label: "Payment & Banking" },
  { to: "/admin/invoice", icon: FileText, label: "Invoice Settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card min-h-screen p-4 hidden lg:block">
      <div className="mb-8">
        <h2 className="font-heading text-lg">Admin Panel</h2>
        <p className="font-body text-xs text-muted-foreground">The Women</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = link.end
            ? location.pathname === link.to
            : location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-8 pt-4 border-t border-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Store
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
