import React, { useState, useEffect } from 'react';
import logoImg from '../../images/ymbgo_logo.png';

const navLinks = [
  { label: 'Home', href: 'home' },
  { label: 'Routes', href: 'routes' },
  { label: 'Fleet', href: 'fleet' },
  { label: 'Schedule', href: 'schedule' },
  // { label: 'Tracking', href: 'tracking' },
  { label: 'Reviews', href: 'reviews' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-md">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img src={logoImg} style={{ height: '70px' }} alt="YMB GoExpress" className="h-9 w-auto" />
          {/* <span className="font-bold text-[#0D5C63] text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            YMB <span className="text-[#E8762C]">GoExpress</span>
          </span> */}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeSection === href
                  ? 'bg-[#0D7377] text-white'
                  : 'text-[#374151] hover:text-[#0D7377]'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('booking')}
            className="ml-3 bg-[#E8762C] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d4681f] transition-all"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-[#0D7377]" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-2">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className={`text-left px-4 py-2 rounded-lg text-sm font-medium ${
                activeSection === href
                  ? 'bg-[#0D7377] text-white'
                  : 'text-[#374151] hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('booking')}
            className="mt-2 bg-[#E8762C] text-white px-5 py-2 rounded-full text-sm font-semibold"
          >
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
}
