import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Search, Heart, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collection", href: "/catalog" },
    { name: "Designers", href: "#" },
    { name: "Showrooms", href: "#" },
    { name: "About", href: "#" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || !isHome
          ? "bg-white/80 backdrop-blur-md py-4 border-b border-primary/10 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12">
              chair
            </span>
            <h1 className="font-display text-2xl font-bold tracking-widest text-espresso">
              LUXE
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="micro-label hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-primary/5 border border-primary/20 rounded-full py-1.5 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary w-48 font-sans"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-espresso hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <Link to="/cart" className="text-espresso hover:text-primary transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link to="/account" className="text-espresso hover:text-primary transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-espresso text-paper pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-primary mb-8">
              <span className="material-symbols-outlined text-3xl">chair</span>
              <h1 className="font-display text-2xl font-bold tracking-widest text-white">
                LUXE
              </h1>
            </div>
            <p className="font-sans text-slate-400 text-sm max-w-sm mb-10 leading-relaxed">
              Redefining modern living through exceptional craftsmanship and
              avant-garde design. Join our newsletter for exclusive previews and
              design insights.
            </p>
            <form className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-white/5 border border-primary/20 text-white text-[10px] tracking-widest px-4 py-4 w-full focus:outline-none focus:border-primary font-sans"
              />
              <button className="bg-primary text-espresso font-sans font-bold uppercase tracking-widest text-[10px] px-8 py-4 transition-all hover:bg-white">
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <h6 className="font-display text-white text-lg mb-8">Discover</h6>
            <ul className="micro-label text-slate-500 space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Designers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Process</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
            </ul>
          </div>

          <div>
            <h6 className="font-display text-white text-lg mb-8">Customer Care</h6>
            <ul className="micro-label text-slate-500 space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Warranty</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h6 className="font-display text-white text-lg mb-8">Showrooms</h6>
            <ul className="micro-label text-slate-500 space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">New York</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Paris</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Milan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tokyo</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="micro-label text-slate-600">
            © 2024 LUXE ATELIER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">camera</span>
            </a>
            <a href="#" className="text-slate-600 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
