import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts, isVariantAvailable, variantKey } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import SEO from "@/components/SEO";
import { Heart, Truck, RotateCcw, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProductPage = () => {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { products } = useProducts();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const variantStock = product?.variantStock || {};
  const tracksVariants = useMemo(() => Object.keys(variantStock).length > 0, [variantStock]);

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
  const isTailorMade = product.category === "Tailor Made";

  const variantAvailable = isVariantAvailable(product, selectedSize, selectedColor || undefined);
  const sizeUnavailable = (size: string) => {
    if (!tracksVariants) return false;
    if (selectedColor) return !isVariantAvailable(product, size, selectedColor);
    // any color in stock?
    if (product.colors.length === 0) return !isVariantAvailable(product, size);
    return !product.colors.some((c) => isVariantAvailable(product, size, c));
  };

  const handleAddToCart = () => {
    if (isTailorMade) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor && tracksVariants) {
      toast.error("Please select a color");
      return;
    }
    if (!variantAvailable) {
      toast.error("This variant is out of stock");
      return;
    }
    addItem(product, selectedSize);
  };

  const seoTitle = product.seoTitle || `${product.name} | The Women`;
  const seoDesc = product.seoDescription || product.description?.slice(0, 160) || `Shop ${product.name} from The Women — premium Indian ethnic wear.`;
  const canonical = `${window.location.origin}/product/${product.id}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: "The Women" },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-12">
      <SEO title={seoTitle} description={seoDesc} canonical={canonical} image={product.images[0]} type="product" jsonLd={productJsonLd} />

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

          {!isTailorMade && product.colors.length > 0 && (
            <div className="mb-6">
              <span className="font-body text-sm font-semibold block mb-3">Color {selectedColor && <span className="text-muted-foreground font-normal">— {selectedColor}</span>}</span>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => {
                  const colorOut = tracksVariants && !product.sizes.some((s) => isVariantAvailable(product, s, color));
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={colorOut}
                      className={`px-3 h-10 border font-body text-xs transition-all ${selectedColor === color ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"} ${colorOut ? "opacity-40 line-through cursor-not-allowed" : ""}`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!isTailorMade && (
            <div className="mb-6">
              <span className="font-body text-sm font-semibold block mb-3">Select Size</span>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => {
                  const out = sizeUnavailable(size);
                  return (
                    <button
                      key={size}
                      onClick={() => !out && setSelectedSize(size)}
                      disabled={out}
                      className={`min-w-12 h-12 px-3 border font-body text-sm transition-all ${selectedSize === size ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"} ${out ? "opacity-40 line-through cursor-not-allowed" : ""}`}
                      title={out ? "Out of stock" : ""}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && !variantAvailable && (
                <p className="text-xs text-destructive font-body mt-2">This selection is out of stock.</p>
              )}
            </div>
          )}

          <div className="flex gap-3 mb-8">
            {isTailorMade ? (
              <Link to={`/tailor-made?product=${product.id}`} className="flex-1">
                <Button variant="hero" size="lg" className="w-full">Customize & Submit Measurements</Button>
              </Link>
            ) : (
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize || !variantAvailable || !product.inStock}
              >
                {!product.inStock ? "Out of Stock" : !selectedSize ? "Select a Size" : !variantAvailable ? "Out of Stock" : "Add to Bag"}
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
