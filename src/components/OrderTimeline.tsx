import { Check, Package, Truck, Home, Clock, ExternalLink } from "lucide-react";

interface Props {
  status: string;
  trackingId?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  paymentStatus?: string;
}

const steps = [
  { key: "processing", label: "Processing", Icon: Package },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: Home },
];

const statusOrder: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

const fmt = (d?: string | null) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

const OrderTimeline = ({ status, trackingId, trackingUrl, shippedAt, deliveredAt, createdAt, paymentStatus }: Props) => {
  const isCancelled = status === "cancelled";
  const currentStep = statusOrder[status] ?? 0;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-destructive font-body text-sm py-3 border-y border-border">
        <Clock size={16} /> This order was cancelled.
      </div>
    );
  }

  const stepDate = (key: string) => {
    if (key === "processing") return fmt(createdAt);
    if (key === "shipped") return fmt(shippedAt);
    if (key === "delivered") return fmt(deliveredAt);
    return null;
  };

  return (
    <div className="py-4 border-y border-border">
      <div className="relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" aria-hidden />
        <div
          className="absolute top-4 left-4 h-0.5 bg-accent transition-all duration-500"
          style={{ width: `calc(${Math.max(0, Math.min(currentStep, 3) - 1) / 2 * 100}% - 16px)` }}
          aria-hidden
        />
        <div className="relative grid grid-cols-3 gap-2">
          {steps.map((s, i) => {
            const reached = currentStep >= i + 1;
            const active = currentStep === i + 1;
            const Icon = reached ? Check : s.Icon;
            return (
              <div key={s.key} className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${reached ? "bg-accent border-accent text-accent-foreground" : "bg-background border-border text-muted-foreground"}`}>
                  <Icon size={14} />
                </div>
                <p className={`text-xs font-body mt-2 ${reached ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                {stepDate(s.key) && reached && <p className="text-[10px] text-muted-foreground">{stepDate(s.key)}</p>}
                {active && !reached && <span className="text-[10px] text-accent">In progress</span>}
              </div>
            );
          })}
        </div>
      </div>

      {trackingId && (
        <div className="mt-4 flex items-center justify-between bg-muted/40 rounded px-3 py-2 text-xs font-body">
          <span className="text-muted-foreground">Tracking ID:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{trackingId}</span>
            {trackingUrl ? (
              <a href={trackingUrl} target="_blank" rel="noreferrer" className="text-accent inline-flex items-center gap-1 hover:underline">
                Track <ExternalLink size={11} />
              </a>
            ) : (
              <a
                href={`https://www.google.com/search?q=track+${encodeURIComponent(trackingId)}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent inline-flex items-center gap-1 hover:underline"
              >
                Track <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      )}

      {paymentStatus && paymentStatus !== "paid" && (
        <p className="text-xs text-muted-foreground font-body mt-2">Payment: <span className="capitalize">{paymentStatus}</span></p>
      )}
    </div>
  );
};

export default OrderTimeline;
