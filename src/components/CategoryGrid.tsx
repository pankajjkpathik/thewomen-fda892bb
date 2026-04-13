import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import categoryKurtis from "@/assets/category-kurtis.jpg";
import categoryFestive from "@/assets/category-festive.jpg";
import categorySets from "@/assets/category-sets.jpg";
import categoryCoords from "@/assets/category-coords.jpg";

const categories = [
  { name: "Kurtis", image: categoryKurtis, href: "/shop?category=Kurtis" },
  { name: "Festive", image: categoryFestive, href: "/shop?category=Festive Collection" },
  { name: "Ethnic Sets", image: categorySets, href: "/shop?category=Ethnic Sets with Dupatta" },
  { name: "Co-ords", image: categoryCoords, href: "/shop?category=Co-ord Sets" },
];

const CategoryGrid = () => (
  <section className="container mx-auto px-4 py-16 lg:py-24">
    <div className="text-center mb-12">
      <p className="text-xs tracking-[0.3em] uppercase text-accent font-body mb-2">Curated For You</p>
      <h2 className="font-heading text-3xl lg:text-4xl">Shop by Category</h2>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <Link to={cat.href} className="group block relative overflow-hidden rounded">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={600}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
              <h3 className="text-primary-foreground font-heading text-lg lg:text-xl">{cat.name}</h3>
              <p className="text-primary-foreground/70 text-xs tracking-widest uppercase font-body mt-1 group-hover:text-primary-foreground transition-colors">
                Explore →
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
