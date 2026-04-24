import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
type CouponInsert = Database["public"]["Tables"]["coupons"]["Insert"];

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const addProduct = async (product: ProductInsert) => {
    const { error } = await supabase.from("products").insert(product);
    if (!error) await fetchProducts();
    return error;
  };

  const updateProduct = async (id: string, updates: Partial<ProductInsert>) => {
    const { error } = await supabase.from("products").update(updates).eq("id", id);
    if (!error) await fetchProducts();
    return error;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) await fetchProducts();
    return error;
  };

  useEffect(() => { fetchProducts(); }, []);
  return { products, loading, addProduct, updateProduct, deleteProduct, refetch: fetchProducts };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) await fetchOrders();
    return error;
  };

  const updateTrackingId = async (id: string, tracking_id: string, tracking_url?: string) => {
    const updates: { tracking_id: string; tracking_url?: string } = { tracking_id };
    if (tracking_url !== undefined) updates.tracking_url = tracking_url;
    const { error } = await supabase.from("orders").update(updates).eq("id", id);
    if (!error) await fetchOrders();
    return error;
  };

  useEffect(() => { fetchOrders(); }, []);
  return { orders, loading, updateOrderStatus, updateTrackingId, refetch: fetchOrders };
};

export const useAdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  };

  const addCoupon = async (coupon: CouponInsert) => {
    const { error } = await supabase.from("coupons").insert(coupon);
    if (!error) await fetchCoupons();
    return error;
  };

  const deleteCoupon = async (id: string) => {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (!error) await fetchCoupons();
    return error;
  };

  const toggleCoupon = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
    if (!error) await fetchCoupons();
    return error;
  };

  useEffect(() => { fetchCoupons(); }, []);
  return { coupons, loading, addCoupon, deleteCoupon, toggleCoupon, refetch: fetchCoupons };
};

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("total_amount, status"),
        supabase.from("products").select("id"),
      ]);
      const orders = ordersRes.data || [];
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + Number(o.total_amount), 0),
        totalProducts: productsRes.data?.length || 0,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
      });
    };
    fetch();
  }, []);

  return stats;
};
