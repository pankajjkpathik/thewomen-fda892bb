import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

const fallbackImg = "/placeholder.svg";

const normalize = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  image: row.images?.[0] || fallbackImg,
  images: row.images?.length ? row.images : [fallbackImg, fallbackImg, fallbackImg, fallbackImg],
  category: row.category,
  sizes: row.sizes || [],
  colors: row.colors || [],
  fabric: row.fabric || "",
  occasion: row.occasion || "",
  description: row.description || "",
  careInstructions: row.care_instructions || "",
  fit: row.fit || "",
  isNew: !!row.is_new,
  isBestSeller: !!row.is_best_seller,
  inStock: row.in_stock !== false,
});

export const useProducts = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (mounted) {
        setRows(data || []);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const products = useMemo(() => rows.map(normalize), [rows]);
  return { products, loading };
};

export const useProduct = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setProduct(data ? normalize(data) : null);
      setLoading(false);
    });
  }, [id]);
  return { product, loading };
};
