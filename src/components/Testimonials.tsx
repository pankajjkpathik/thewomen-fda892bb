import { motion } from "framer-motion";

const testimonials = [
  { name: "Priya S.", text: "The quality is exceptional. Every piece feels like it was made just for me.", location: "Mumbai" },
  { name: "Ananya R.", text: "I've received so many compliments wearing The Women. Absolutely love the designs!", location: "Delhi" },
  { name: "Meera K.", text: "From casual to festive, their collection covers everything. My go-to brand now.", location: "Bangalore" },
];

const Testimonials = () => (
  <section className="bg-cream py-16 lg:py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-body mb-2">What They Say</p>
        <h2 className="font-heading text-3xl lg:text-4xl">Our Women Speak</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="text-center px-6"
          >
            <p className="font-heading text-lg italic leading-relaxed mb-6">"{t.text}"</p>
            <p className="font-body text-sm font-semibold">{t.name}</p>
            <p className="font-body text-xs text-muted-foreground">{t.location}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
