import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import GlowingButton from './ui/GlowingButton.jsx';
import { cn } from '../lib/utils';

const navLinks = [
  { label: 'Home', href: 'home' },
  { label: 'Routes', href: 'routes' },
  { label: 'Fleet', href: 'fleet' },
  { label: 'Schedule', href: 'schedule' },
  { label: 'Reviews', href: 'reviews' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>


      {/* Main Nav */}
      <nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-brand-charcoal/95 backdrop-blur-xl shadow-2xl border-b border-brand-gold/10'
            : 'bg-brand-charcoal'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <img src="/images/ymbgo_logo.png" alt="YMB GoExpress" className="h-12 w-auto" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative',
                  activeSection === href
                    ? 'text-brand-gold'
                    : 'text-brand-offwhite/60 hover:text-brand-offwhite'
                )}
              >
                {label}
                {activeSection === href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <GlowingButton onClick={() => scrollTo('booking')} size="sm">
              Book Now
            </GlowingButton>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-brand-offwhite/80 hover:text-brand-offwhite p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-brand-charcoal border-t border-brand-gold/10 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map(({ label, href }) => (
                  <button
                    key={href}
                    onClick={() => scrollTo(href)}
                    className={cn(
                      'text-left px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      activeSection === href
                        ? 'bg-brand-red/10 text-brand-gold'
                        : 'text-brand-offwhite/60 hover:text-brand-offwhite hover:bg-brand-charcoal/50'
                    )}
                  >
                    {label}
                  </button>
                ))}
                <div className="pt-3 flex items-center gap-3 text-brand-offwhite/50 text-xs px-4 border-t border-brand-gold/5 mt-2">
                  <Phone size={12} className="text-brand-gold" />
                  <a href="tel:9755254050" className="hover:text-brand-offwhite">9755254050</a>
                  <span>•</span>
                  <a href="tel:9755124554" className="hover:text-brand-offwhite">9755124554</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
