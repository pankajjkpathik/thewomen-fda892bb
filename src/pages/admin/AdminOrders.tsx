import { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdmin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const { orders, loading, updateOrderStatus, updateTrackingId } = useAdminOrders();
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const handleStatusChange = async (id: string, status: string) => {
    const error = await updateOrderStatus(id, status);
    if (error) toast.error(error.message);
    else toast.success("Order status updated");
  };

  const handleTrackingSubmit = async (id: string) => {
    const tid = trackingInputs[id];
    if (!tid) return;
    const error = await updateTrackingId(id, tid);
    if (error) toast.error(error.message);
    else toast.success("Tracking ID updated");
  };

  return (
    <div>
      <h1 className="font-heading text-2xl lg:text-3xl mb-6">Orders</h1>

      {loading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-body">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-lg p-4 lg:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                  <p className="font-heading text-lg">₹{Number(order.total_amount).toLocaleString()}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded font-body ${statusColors[order.status] || ""}`}>
                    {order.status}
                  </span>
                  <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                    <SelectTrigger className="w-36 text-xs">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-body text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                  <p>{order.shipping_name || "—"}</p>
                  <p className="text-muted-foreground">{[order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_pincode].filter(Boolean).join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment</p>
                  <p>{order.payment_method || "—"}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${order.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {order.payment_status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tracking ID</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder={order.tracking_id || "Enter tracking ID"}
                      value={trackingInputs[order.id] || ""}
                      onChange={(e) => setTrackingInputs((p) => ({ ...p, [order.id]: e.target.value }))}
                      className="text-xs h-8"
                    />
                    <button
                      onClick={() => handleTrackingSubmit(order.id)}
                      className="text-xs px-3 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                      Save
                    </button>
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

export default AdminOrders;
