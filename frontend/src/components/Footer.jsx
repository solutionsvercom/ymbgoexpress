import React from 'react';
import logoImg from '../../images/ymbgo_logo.png';

const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Footer() {
  return (
    <footer className="bg-[#0D1A1A] text-white pt-12 pb-6">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logoImg} alt="YMB GoExpress" className="h-8 w-auto" />
            <span className="font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              YMB <span className="text-[#E8762C]">GoExpress</span>
            </span>
          </div>
          <p className="text-white/60 text-sm mb-4">Madhya Bharat premium private bus service. Travel in royal comfort.</p>
          <p className="text-[#E8762C] italic text-sm">यात्रा खास, सेवा रॉयल</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Travel</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {[['Routes', 'routes'], ['Schedule', 'schedule'], ['Fleet', 'fleet'], ['Book Now', 'booking']].map(([l, h]) => (
              <li key={l}><button onClick={() => scrollTo(h)} className="hover:text-[#E8762C] transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {[['About', 'about'], ['Reviews', 'reviews'], ['Deals', 'deals'], ['Contact', 'contact']].map(([l, h]) => (
              <li key={l}><button onClick={() => scrollTo(h)} className="hover:text-[#E8762C] transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>📞 +91 97551 24554</li>
            <li>✉️ ymbgoexpress@gmail.com</li>
            <li>📍 Indore, Madhya Pradesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 text-center text-xs text-white/40">
        © 2026 YMB GoExpress. All rights reserved.
      </div>
    </footer>
  );
}
