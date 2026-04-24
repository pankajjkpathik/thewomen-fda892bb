import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";

const categoryList = ["Kurtis", "Ethnic Dresses", "Co-ord Sets", "Tailor Made"];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");
  const { products, loading } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = [...products];
    if (filterParam === "new") result = result.filter((p) => p.isNew);
    if (filterParam === "bestseller") result = result.filter((p) => p.isBestSeller);
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, selectedCategory, sortBy, filterParam]);

  const pageTitle = filterParam === "new" ? "New Arrivals" : filterParam === "bestseller" ? "Best Sellers" : selectedCategory !== "All" ? selectedCategory : "All Collections";

  const seoTitle = `${pageTitle} | The Women`;
  const seoDescription = selectedCategory !== "All"
    ? `Shop ${selectedCategory.toLowerCase()} from The Women — premium Indian ethnic wear hand-picked for the modern woman.`
    : `Discover The Women's curated edit of kurtis, ethnic dresses, co-ord sets and tailor made pieces.`;
  const canonical = `${window.location.origin}/shop${selectedCategory !== "All" ? `?category=${encodeURIComponent(selectedCategory)}` : ""}`;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <SEO title={seoTitle} description={seoDescription} canonical={canonical} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-heading text-3xl lg:text-4xl mb-2">{pageTitle}</h1>
        <p className="font-body text-sm text-muted-foreground">{filtered.length} products</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <h3 className="font-heading text-sm tracking-widest uppercase mb-4">Categories</h3>
          <div className="flex flex-row lg:flex-col flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`text-sm font-body text-left py-1 transition-colors ${selectedCategory === "All" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-body text-left py-1 transition-colors ${selectedCategory === cat ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-border px-3 py-2 font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent rounded"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          {loading ? (
            <p className="text-muted-foreground font-body">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
