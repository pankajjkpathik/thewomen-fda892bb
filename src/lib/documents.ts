import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { supabase } from "@/integrations/supabase/client";

export type InvoiceSettings = {
  business_name?: string | null;
  legal_name?: string | null;
  gstin?: string | null;
  tax_percentage?: number | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  invoice_prefix?: string | null;
  next_invoice_number?: number | null;
  terms_and_conditions?: string | null;
  footer_note?: string | null;
  logo_url?: string | null;
};

export type OrderForDoc = {
  id: string;
  total_amount: number;
  shipping_amount?: number | null;
  discount_amount?: number | null;
  coupon_code?: string | null;
  status: string;
  payment_method?: string | null;
  payment_status?: string | null;
  created_at: string;
  shipping_name?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_pincode?: string | null;
  shipping_phone?: string | null;
  billing_name?: string | null;
  tracking_id?: string | null;
};

export type OrderItem = {
  product_name: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unit_price: number;
};

const loadImageAsDataUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const barcodeDataUrl = (text: string) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "CODE128", width: 2, height: 60, displayValue: true, fontSize: 14, margin: 4 });
  return canvas.toDataURL("image/png");
};

export const fetchInvoiceSettings = async (): Promise<InvoiceSettings> => {
  const { data } = await supabase.from("invoice_settings" as any).select("*").limit(1).maybeSingle();
  return (data as any) || {};
};

export const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data } = await supabase.from("order_items").select("product_name,size,color,quantity,unit_price").eq("order_id", orderId);
  return (data as any) || [];
};

export const generateInvoicePDF = async (order: OrderForDoc, items: OrderItem[], settings: InvoiceSettings) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // Logo
  if (settings.logo_url) {
    const dataUrl = await loadImageAsDataUrl(settings.logo_url);
    if (dataUrl) {
      try { doc.addImage(dataUrl, "PNG", 40, y, 90, 60); } catch { /* ignore */ }
    }
  }

  // Business identity
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(settings.business_name || "The Women", pageWidth - 40, y + 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const headerLines = [
    settings.legal_name,
    [settings.address_line1, settings.address_line2].filter(Boolean).join(", "),
    [settings.city, settings.state, settings.pincode].filter(Boolean).join(", "),
    settings.country,
    settings.gstin ? `GSTIN: ${settings.gstin}` : "",
    settings.contact_email,
    settings.contact_phone,
  ].filter(Boolean) as string[];
  headerLines.forEach((l, i) => doc.text(l, pageWidth - 40, y + 30 + i * 11, { align: "right" }));

  y += 110;
  doc.setDrawColor(180);
  doc.line(40, y, pageWidth - 40, y);
  y += 20;

  // Invoice meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TAX INVOICE", 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const invNo = `${settings.invoice_prefix || "INV-"}${(settings.next_invoice_number ?? 1).toString().padStart(4, "0")}`;
  doc.text(`Invoice #: ${invNo}`, pageWidth - 40, y - 8, { align: "right" });
  doc.text(`Order #: ${order.id.slice(0, 8).toUpperCase()}`, pageWidth - 40, y + 6, { align: "right" });
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString("en-IN")}`, pageWidth - 40, y + 20, { align: "right" });

  y += 36;
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 40, y);
  doc.setFont("helvetica", "normal");
  const billLines = [
    order.shipping_name || order.billing_name || "",
    order.shipping_address || "",
    [order.shipping_city, order.shipping_state, order.shipping_pincode].filter(Boolean).join(", "),
    order.shipping_phone ? `Phone: ${order.shipping_phone}` : "",
  ].filter(Boolean);
  billLines.forEach((l, i) => doc.text(l, 40, y + 14 + i * 12));
  y += 14 + billLines.length * 12 + 16;

  // Items table
  doc.setFont("helvetica", "bold");
  doc.setFillColor(245, 235, 245);
  doc.rect(40, y, pageWidth - 80, 22, "F");
  doc.text("Item", 48, y + 14);
  doc.text("Variant", 280, y + 14);
  doc.text("Qty", 380, y + 14);
  doc.text("Price", 430, y + 14);
  doc.text("Total", pageWidth - 48, y + 14, { align: "right" });
  y += 22;

  doc.setFont("helvetica", "normal");
  let subtotal = 0;
  items.forEach((it) => {
    const lineTotal = it.quantity * Number(it.unit_price);
    subtotal += lineTotal;
    const variant = [it.size, it.color].filter(Boolean).join(" / ") || "-";
    doc.text(doc.splitTextToSize(it.product_name, 220), 48, y + 14);
    doc.text(variant, 280, y + 14);
    doc.text(String(it.quantity), 380, y + 14);
    doc.text(`Rs. ${Number(it.unit_price).toFixed(2)}`, 430, y + 14);
    doc.text(`Rs. ${lineTotal.toFixed(2)}`, pageWidth - 48, y + 14, { align: "right" });
    y += 22;
    doc.setDrawColor(230);
    doc.line(40, y, pageWidth - 40, y);
  });

  // Totals
  y += 14;
  const total = Number(order.total_amount);
  const discount = Number(order.discount_amount || 0);
  const shipping = Number(order.shipping_amount || 0);
  const taxPct = Number(settings.tax_percentage || 0);
  const taxableBase = subtotal - discount;
  const taxAmount = taxPct > 0 ? (taxableBase * taxPct) / (100 + taxPct) : 0;

  const rightCol = pageWidth - 48;
  const labelCol = pageWidth - 200;
  const row = (label: string, val: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, labelCol, y);
    doc.text(val, rightCol, y, { align: "right" });
    y += 16;
  };
  row("Subtotal", `Rs. ${subtotal.toFixed(2)}`);
  if (discount > 0) row(`Discount${order.coupon_code ? ` (${order.coupon_code})` : ""}`, `- Rs. ${discount.toFixed(2)}`);
  if (shipping > 0) row("Shipping", `Rs. ${shipping.toFixed(2)}`);
  if (taxAmount > 0) row(`Incl. GST (${taxPct}%)`, `Rs. ${taxAmount.toFixed(2)}`);
  y += 4;
  doc.setDrawColor(120);
  doc.line(labelCol, y - 8, rightCol, y - 8);
  row("Grand Total", `Rs. ${total.toFixed(2)}`, true);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Payment: ${order.payment_method || "-"} (${order.payment_status || "-"})`, 40, y);
  y += 20;

  if (settings.terms_and_conditions) {
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 40, y); y += 12;
    doc.setFont("helvetica", "normal");
    const t = doc.splitTextToSize(settings.terms_and_conditions, pageWidth - 80);
    doc.text(t, 40, y); y += t.length * 11 + 6;
  }
  if (settings.footer_note) {
    doc.setFont("helvetica", "italic");
    const f = doc.splitTextToSize(settings.footer_note, pageWidth - 80);
    doc.text(f, pageWidth / 2, y + 6, { align: "center" });
  }

  doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);
};

export const generateShippingLabelPDF = async (order: OrderForDoc, settings: InvoiceSettings) => {
  // 4x6 inch label
  const doc = new jsPDF({ unit: "pt", format: [288, 432] });
  const W = 288;
  let y = 14;

  // Header strip
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, W, 50, "F");
  if (settings.logo_url) {
    const dataUrl = await loadImageAsDataUrl(settings.logo_url);
    if (dataUrl) {
      try { doc.addImage(dataUrl, "PNG", 8, 6, 60, 38); } catch { /* ignore */ }
    }
  }
  doc.setTextColor(255, 217, 239);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(settings.business_name || "The Women", W - 10, 22, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Shipping Label", W - 10, 36, { align: "right" });
  doc.setTextColor(0, 0, 0);

  y = 64;
  // From
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("FROM:", 12, y);
  doc.setFont("helvetica", "normal");
  const fromLines = [
    settings.business_name,
    settings.address_line1,
    settings.address_line2,
    [settings.city, settings.state, settings.pincode].filter(Boolean).join(", "),
    settings.contact_phone,
  ].filter(Boolean) as string[];
  fromLines.forEach((l, i) => doc.text(String(l), 12, y + 12 + i * 10));
  y += 12 + fromLines.length * 10 + 10;

  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.line(8, y, W - 8, y);
  y += 12;

  // To (large)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SHIP TO:", 12, y);
  y += 14;
  doc.setFontSize(13);
  doc.text(order.shipping_name || "-", 12, y); y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const addr = doc.splitTextToSize(order.shipping_address || "-", W - 24);
  doc.text(addr, 12, y); y += addr.length * 13;
  const cityLine = [order.shipping_city, order.shipping_state].filter(Boolean).join(", ");
  if (cityLine) { doc.text(cityLine, 12, y); y += 13; }
  if (order.shipping_pincode) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`PIN: ${order.shipping_pincode}`, 12, y + 4); y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  }
  if (order.shipping_phone) { doc.text(`Phone: ${order.shipping_phone}`, 12, y); y += 13; }

  y += 6;
  doc.setLineWidth(1);
  doc.line(8, y, W - 8, y);
  y += 10;

  // Order info row
  doc.setFontSize(8);
  doc.text(`Order: #${order.id.slice(0, 8).toUpperCase()}`, 12, y);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString("en-IN")}`, W - 12, y, { align: "right" });
  y += 11;
  doc.text(`Payment: ${order.payment_method || "-"} (${order.payment_status || "-"})`, 12, y);
  y += 14;

  // Barcode (tracking ID or order id)
  const code = (order.tracking_id && order.tracking_id.trim()) || order.id.replace(/-/g, "").slice(0, 16).toUpperCase();
  try {
    const bc = barcodeDataUrl(code);
    doc.addImage(bc, "PNG", 12, y, W - 24, 70);
    y += 74;
  } catch {
    doc.text(code, W / 2, y + 20, { align: "center" });
    y += 30;
  }

  doc.setFontSize(7);
  doc.setTextColor(90);
  doc.text("Handle with care • Thank you for shopping with us", W / 2, 420, { align: "center" });

  doc.save(`shipping-label-${order.id.slice(0, 8)}.pdf`);
};
