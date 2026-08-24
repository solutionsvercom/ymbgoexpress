import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-charcoal border-t border-brand-gold/15 text-brand-offwhite pt-16 pb-8 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10 mb-12">
        
        {/* Brand details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img src="/images/ymbgo_logo.png" alt="YMB GoExpress" className="h-10 w-auto" />
            <div className="font-display font-bold text-lg leading-tight text-brand-offwhite">
              YMB <span className="text-gradient-gold">GO EXPRESS</span>
            </div>
          </div>
          <p className="text-xs text-brand-offwhite/50 leading-relaxed font-medium">
            Madhya Bharat’s premium private sleeper & seater coaches. Driven by Comfort, Powered by Trust.
          </p>
          <p className="text-brand-red font-display italic text-xs font-bold">
            सफ़र आपका, ज़िम्मेदारी हमारी
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">Travel Menu</h4>
          <ul className="space-y-2.5 text-xs text-brand-offwhite/50">
            {[
              ['Explore Routes', 'routes'],
              ['Weekly Timetable', 'schedule'],
              ['Luxury Fleet', 'fleet'],
              ['Instant Booking', 'booking']
            ].map(([l, h]) => (
              <li key={l}>
                <button onClick={() => scrollTo(h)} className="hover:text-brand-gold transition-colors font-medium">
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-display font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5 text-xs text-brand-offwhite/50">
            {[
              ['About Joon Holidays', 'about'],
              ['Passenger Reviews', 'reviews'],
              ['Limited-Time Deals', 'deals'],
              ['Contact Helpdesk', 'contact']
            ].map(([l, h]) => (
              <li key={l}>
                <button onClick={() => scrollTo(h)} className="hover:text-brand-gold transition-colors font-medium">
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Helpdesk */}
        <div>
          <h4 className="font-display font-bold text-sm text-brand-gold mb-4 uppercase tracking-wider">Booking Office</h4>
          <ul className="space-y-3 text-xs text-brand-offwhite/50">
            <li className="flex items-start gap-2.5">
              <Phone size={14} className="text-brand-red shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <a href="tel:9755254050" className="hover:text-brand-gold block font-bold text-brand-offwhite/80">97552 54050</a>
                <a href="tel:9755124554" className="hover:text-brand-gold block">97551 24554</a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} className="text-brand-gold shrink-0" />
              <a href="mailto:ymbgoexpress@gmail.com" className="hover:text-brand-gold">ymbgoexpress@gmail.com</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-brand-red shrink-0 mt-0.5" />
              <span>Indore, Madhya Pradesh, India</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright area */}
      <div className="max-w-7xl mx-auto px-6 border-t border-brand-gold/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <p className="text-[10px] text-brand-offwhite/40">
          © {new Date().getFullYear()} Joon Holidays (YMB GoExpress). All rights reserved.
        </p>
        <p className="text-[10px] text-brand-offwhite/30">
          Also Bookable on: <span className="text-brand-offwhite/50 font-semibold">RedBus</span> • <span className="text-brand-offwhite/50 font-semibold">AbhiBus</span>
          {' · '}
          <a href="/admin/login" className="hover:text-brand-gold">Staff login</a>
        </p>
      </div>
    </footer>
  );
}
