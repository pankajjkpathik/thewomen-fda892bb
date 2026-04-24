import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => (
  <>
    <SEO
      title="The Women | Premium Indian Ethnic Wear"
      description="Shop kurtis, ethnic dresses, co-ord sets and tailor-made pieces from The Women — premium ethnic wear for the modern Indian woman."
      canonical={`${window.location.origin}/`}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "The Women",
        url: window.location.origin,
        logo: `${window.location.origin}/placeholder.svg`,
      }}
    />
    <HeroBanner />
    <CategoryGrid />
    <FeaturedProducts title="New Arrivals" subtitle="Just Dropped" filter="new" />

    {/* Mid-page banner */}
    <section className="relative h-[50vh] overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary-foreground/70 text-xs tracking-[0.3em] uppercase font-body mb-4">
            Limited Edition
          </p>
          <h2 className="text-primary-foreground font-heading text-4xl lg:text-6xl mb-6">
            The Festive Edit
          </h2>
          <p className="text-primary-foreground/80 font-body max-w-md mx-auto mb-8">
            Handcrafted pieces designed for celebrations. Discover our exclusive festive collection.
          </p>
          <Button variant="gold" size="lg" className="px-10">
            Shop Festive
          </Button>
        </motion.div>
      </div>
    </section>

    <FeaturedProducts title="Best Sellers" subtitle="Most Loved" filter="bestseller" />
    <Testimonials />

    {/* Newsletter */}
    <section className="container mx-auto px-4 py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-body mb-2">Newsletter</p>
        <h2 className="font-heading text-3xl lg:text-4xl mb-4">Join The Women</h2>
        <p className="font-body text-muted-foreground mb-8">
          Be the first to know about new collections, exclusive offers, and styling inspiration.
        </p>
        <div className="flex gap-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <Button variant="hero" className="px-8 rounded-none">
            Subscribe
          </Button>
        </div>
      </motion.div>
    </section>
  </>
);

export default Index;
