import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

const fallbackImg = "/placeholder.svg";

export const variantKey = (size?: string, color?: string) => {
  if (size && color) return `${size}|${color}`;
  return size || color || "default";
};

export const isVariantAvailable = (p: Product, size?: string, color?: string) => {
  if (!p.inStock) return false;
  const map = p.variantStock || {};
  // If product has any variant_stock entries, check the specific key
  if (Object.keys(map).length > 0) {
    const exact = map[variantKey(size, color)];
    if (typeof exact === "number") return exact > 0;
    // Fallback: try size-only key
    if (size && typeof map[size] === "number") return (map[size] as number) > 0;
    // No entry → treat as out of stock when variant tracking is enabled
    return false;
  }
  // No per-variant tracking → fall back to overall stockQuantity / inStock
  if (typeof p.stockQuantity === "number") return p.stockQuantity > 0;
  return true;
};

const normalize = (row: any): Product => {
  const images: string[] = row.images?.length ? row.images : [];
  const defaultIdx = Math.max(0, Math.min(row.default_image_index || 0, Math.max(0, images.length - 1)));
  const orderedImages = images.length
    ? [images[defaultIdx], ...images.filter((_, i) => i !== defaultIdx)]
    : [fallbackImg, fallbackImg, fallbackImg, fallbackImg];
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    image: orderedImages[0],
    images: orderedImages,
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
    variantStock: (row.variant_stock as Record<string, number>) || {},
    stockQuantity: typeof row.stock_quantity === "number" ? row.stock_quantity : undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
  };
};

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
