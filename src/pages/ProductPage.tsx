import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Heart, Truck, RotateCcw, Shield } from "lucide-react";
import { motion } from "framer-motion";

const ProductPage = () => {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { products } = useProducts();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center font-body text-muted-foreground">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl mb-4">Product not found</h1>
        <Link to="/shop" className="text-accent underline font-body">Back to shop</Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (product.category === "Tailor Made") return; // tailor made uses its own flow
    if (!selectedSize) return;
    addItem(product, selectedSize);
  };

  const isTailorMade = product.category === "Tailor Made";

  return (
    <div className="container mx-auto px-4 py-6 lg:py-12">
      <nav className="mb-6 font-body text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative overflow-hidden bg-cream rounded group">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110"
              width={600}
              height={800}
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-3 py-1 font-body font-semibold">
                {discount}% Off
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`overflow-hidden rounded border-2 transition-colors ${i === selectedImage ? "border-accent" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full aspect-square object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-body mb-2">{product.category}</p>
          <h1 className="font-heading text-2xl lg:text-3xl mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="font-body text-2xl font-semibold">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="font-body text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="bg-accent/10 text-accent text-xs font-body font-semibold px-2 py-1 rounded">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {!isTailorMade && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm font-semibold">Select Size</span>
                <button onClick={() => setShowSizeChart(!showSizeChart)} className="font-body text-xs text-accent underline">Size Chart</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 h-12 px-3 border font-body text-sm transition-all ${selectedSize === size ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            {isTailorMade ? (
              <Link to={`/tailor-made?product=${product.id}`} className="flex-1">
                <Button variant="hero" size="lg" className="w-full">Customize & Submit Measurements</Button>
              </Link>
            ) : (
              <Button variant="hero" size="lg" className="flex-1" onClick={handleAddToCart} disabled={!selectedSize}>
                {selectedSize ? "Add to Bag" : "Select a Size"}
              </Button>
            )}
            <button className="w-12 h-12 border border-border flex items-center justify-center hover:bg-muted transition-colors" aria-label="Wishlist">
              <Heart size={20} />
            </button>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-3 font-body text-sm"><Truck size={18} className="text-accent" /><span>Free shipping on orders above ₹1,999</span></div>
            <div className="flex items-center gap-3 font-body text-sm"><RotateCcw size={18} className="text-accent" /><span>Easy 7-day returns & exchanges</span></div>
            <div className="flex items-center gap-3 font-body text-sm"><Shield size={18} className="text-accent" /><span>100% Authentic & Quality Assured</span></div>
          </div>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="font-heading text-2xl mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
