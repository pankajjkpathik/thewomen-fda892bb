import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  title: string;
  subtitle: string;
  filter: "new" | "bestseller" | "all";
}

const FeaturedProducts = ({ title, subtitle, filter }: FeaturedProductsProps) => {
  let filtered = products;
  if (filter === "new") filtered = products.filter((p) => p.isNew);
  if (filter === "bestseller") filtered = products.filter((p) => p.isBestSeller);

  return (
    <section className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-body mb-2">{subtitle}</p>
        <h2 className="font-heading text-3xl lg:text-4xl">{title}</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {filtered.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/shop">
          <Button variant="outline-dark" size="lg" className="px-10">
            View All
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
