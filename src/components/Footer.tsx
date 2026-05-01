import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone } from "lucide-react";
import twLogo from "@/assets/tw-logo-transparent.png";

const Footer = () => (
  <footer className="bg-brand-dark text-brand-pink">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" aria-label="The Women — Home" className="inline-block mb-4">
            <img
              src={twLogo}
              alt="The Women by Anamika Pathik"
              className="h-20 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p className="font-body text-sm opacity-80 leading-relaxed mb-5">
            Premium Indian ethnic wear crafted with love. Celebrating the grace, beauty, and strength of every woman.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/thewomen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-brand-pink/30 flex items-center justify-center hover:bg-brand-pink hover:text-brand-dark transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://facebook.com/thewomen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-brand-pink/30 flex items-center justify-center hover:bg-brand-pink hover:text-brand-dark transition-colors"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://youtube.com/@thewomen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-brand-pink/30 flex items-center justify-center hover:bg-brand-pink hover:text-brand-dark transition-colors"
            >
              <Youtube size={16} />
            </a>
            <a
              href="https://twitter.com/thewomen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-9 h-9 rounded-full border border-brand-pink/30 flex items-center justify-center hover:bg-brand-pink hover:text-brand-dark transition-colors"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm tracking-widest uppercase mb-4">Shop</h4>
          <div className="flex flex-col gap-2 font-body text-sm opacity-80">
            <Link to="/shop?category=Kurtis" className="hover:opacity-100 hover:text-brand-pink transition-opacity">Kurtis</Link>
            <Link to="/shop?category=Ethnic Dresses" className="hover:opacity-100 transition-opacity">Ethnic Dresses</Link>
            <Link to="/shop?category=Ethnic Sets with Dupatta" className="hover:opacity-100 transition-opacity">Sets with Dupatta</Link>
            <Link to="/shop?category=Co-ord Sets" className="hover:opacity-100 transition-opacity">Co-ord Sets</Link>
            <Link to="/shop?filter=new" className="hover:opacity-100 transition-opacity">New Arrivals</Link>
            <Link to="/shop?filter=bestseller" className="hover:opacity-100 transition-opacity">Best Sellers</Link>
            <Link to="/tailor-made" className="hover:opacity-100 transition-opacity">Tailor Made</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm tracking-widest uppercase mb-4">Help</h4>
          <div className="flex flex-col gap-2 font-body text-sm opacity-80">
            <Link to="/account" className="hover:opacity-100 transition-opacity">My Account</Link>
            <Link to="/account" className="hover:opacity-100 transition-opacity">Track Order</Link>
            <Link to="/shop" className="hover:opacity-100 transition-opacity">Shipping & Delivery</Link>
            <Link to="/shop" className="hover:opacity-100 transition-opacity">Returns & Exchanges</Link>
            <Link to="/tailor-made" className="hover:opacity-100 transition-opacity">Size Guide</Link>
            <a href="mailto:support@thewomens.online" className="hover:opacity-100 transition-opacity inline-flex items-center gap-2">
              <Mail size={14} /> support@thewomens.online
            </a>
            <a href="tel:+919418269600" className="hover:opacity-100 transition-opacity inline-flex items-center gap-2">
              <Phone size={14} /> +91 94182 69600
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm tracking-widest uppercase mb-4">Stay Connected</h4>
          <p className="font-body text-sm opacity-80 mb-4">
            Subscribe for exclusive offers and new arrivals.
          </p>
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector<HTMLInputElement>('input[type="email"]');
              if (input?.value) input.value = "";
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="flex-1 bg-brand-dark-2 border border-brand-pink/20 px-4 py-2 text-sm font-body text-brand-pink placeholder:text-brand-pink/50 focus:outline-none focus:border-brand-pink/60"
            />
            <button
              type="submit"
              className="bg-brand-pink text-brand-dark px-4 py-2 text-xs tracking-widest uppercase font-body font-semibold hover:opacity-90 transition-opacity"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-brand-pink/15 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-body text-xs opacity-60">
        <span>© 2026 The Women. All rights reserved.</span>
        <span>Crafted with love in India</span>
      </div>
    </div>
  </footer>
);

export default Footer;
