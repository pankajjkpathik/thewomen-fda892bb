import { Link } from "react-router-dom";
import twLogo from "@/assets/tw-logo.png";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="bg-background rounded-md p-3 inline-block mb-4">
            <img
              src={twLogo}
              alt="The Women by Anamika Pathik"
              className="h-16 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="font-body text-sm opacity-80 leading-relaxed">
            Premium Indian ethnic wear crafted with love. Celebrating the grace, beauty, and strength of every woman.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm tracking-widest uppercase mb-4">Shop</h4>
          <div className="flex flex-col gap-2 font-body text-sm opacity-80">
            <Link to="/shop?category=Kurtis" className="hover:opacity-100 transition-opacity">Kurtis</Link>
            <Link to="/shop?category=Ethnic Dresses" className="hover:opacity-100 transition-opacity">Ethnic Dresses</Link>
            <Link to="/shop?category=Ethnic Sets with Dupatta" className="hover:opacity-100 transition-opacity">Sets with Dupatta</Link>
            <Link to="/shop?category=Co-ord Sets" className="hover:opacity-100 transition-opacity">Co-ord Sets</Link>
            <Link to="/shop?filter=new" className="hover:opacity-100 transition-opacity">New Arrivals</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm tracking-widest uppercase mb-4">Help</h4>
          <div className="flex flex-col gap-2 font-body text-sm opacity-80">
            <span>Shipping & Delivery</span>
            <span>Returns & Exchanges</span>
            <span>Size Guide</span>
            <span>Track Order</span>
            <span>Contact Us</span>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm tracking-widest uppercase mb-4">Stay Connected</h4>
          <p className="font-body text-sm opacity-80 mb-4">
            Subscribe for exclusive offers and new arrivals.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-2 text-sm font-body text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none"
            />
            <button className="bg-accent text-accent-foreground px-4 py-2 text-xs tracking-widest uppercase font-body font-semibold hover:bg-gold-light transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center font-body text-xs opacity-60">
        © 2026 The Women. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
