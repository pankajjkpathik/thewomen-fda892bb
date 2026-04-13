import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { motion } from "framer-motion";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");

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
  }, [selectedCategory, sortBy, filterParam]);

  const pageTitle = filterParam === "new" ? "New Arrivals" : filterParam === "bestseller" ? "Best Sellers" : selectedCategory !== "All" ? selectedCategory : "All Collections";

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-heading text-3xl lg:text-4xl mb-2">{pageTitle}</h1>
        <p className="font-body text-sm text-muted-foreground">{filtered.length} products</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <h3 className="font-heading text-sm tracking-widest uppercase mb-4">Categories</h3>
          <div className="flex flex-row lg:flex-col flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`text-sm font-body text-left py-1 transition-colors ${selectedCategory === "All" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            {categories.slice(0, 5).map((cat) => (
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

        {/* Grid */}
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
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
