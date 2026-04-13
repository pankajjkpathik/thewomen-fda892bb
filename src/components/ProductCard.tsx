import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden bg-cream rounded">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={600}
            height={800}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-accent text-accent-foreground text-[10px] tracking-widest uppercase px-2 py-1 font-body font-semibold">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2 py-1 font-body font-semibold">
                {discount}% Off
              </span>
            )}
          </div>
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} className="text-foreground" />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground font-body tracking-wider uppercase">{product.category}</p>
          <h3 className="font-heading text-sm leading-snug">{product.name}</h3>
          <div className="flex items-center gap-2 font-body">
            <span className="font-semibold text-sm">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground text-xs line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
