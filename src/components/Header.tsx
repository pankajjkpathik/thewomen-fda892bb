import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Kurtis", href: "/shop?category=Kurtis" },
  { label: "Ethnic Dresses", href: "/shop?category=Ethnic Dresses" },
  { label: "Sets", href: "/shop?category=Ethnic Sets with Dupatta" },
  { label: "Co-ords", href: "/shop?category=Co-ord Sets" },
  { label: "Festive", href: "/shop?category=Festive Collection" },
  { label: "Best Sellers", href: "/shop?filter=bestseller" },
];

const Header = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs tracking-widest font-body uppercase">
        Free Shipping on Orders Above ₹1,999 | Use Code: THEWOMEN20
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-heading text-2xl lg:text-3xl tracking-wide text-foreground">
            THE WOMEN
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-foreground hover:text-accent transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="hidden sm:block text-foreground hover:text-accent transition-colors" aria-label="Wishlist">
              <Heart size={20} />
            </button>
            <button className="hidden sm:block text-foreground hover:text-accent transition-colors" aria-label="Account">
              <User size={20} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground hover:text-accent transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-body font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-8 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors font-body py-2 border-b border-border"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
