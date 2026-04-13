import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [
  {
    image: hero1,
    subtitle: "New Collection 2026",
    title: "Elegance\nRedefined",
    cta: "Shop Now",
    href: "/shop?filter=new",
  },
  {
    image: hero2,
    subtitle: "Festive Edit",
    title: "Celebrate\nin Style",
    cta: "Explore",
    href: "/shop?category=Festive Collection",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden bg-cream">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slide.image}
          alt={slide.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <p className="text-primary-foreground/80 text-xs tracking-[0.3em] uppercase font-body mb-4">
              {slide.subtitle}
            </p>
            <h1 className="text-primary-foreground font-heading text-5xl lg:text-7xl leading-[1.1] whitespace-pre-line mb-8">
              {slide.title}
            </h1>
            <Link to={slide.href}>
              <Button variant="gold" size="lg" className="px-10">
                {slide.cta}
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-primary-foreground w-6" : "bg-primary-foreground/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
