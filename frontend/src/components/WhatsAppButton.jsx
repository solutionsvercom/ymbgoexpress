import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <a
      href="https://wa.me/919755124554?text=Hi%20Joon%20Holidays%20(YMB%20GoExpress)%2C%20I%20want%20to%20book%20a%20ticket"
      target="_blank" 
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      {hovered && (
        <span className="bg-brand-charcoal border border-brand-gold/15 text-brand-offwhite text-xs font-semibold px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap block animate-scale-in">
          Chat with Booking Office!
        </span>
      )}
      <div 
        className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer relative" 
        style={{ animation: 'pulse-wa 2s infinite' }}
      >
        <MessageCircle className="text-brand-offwhite fill-brand-offwhite" size={24} />
      </div>
      <style>{`
        @keyframes pulse-wa { 
          0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); } 
          50% { box-shadow: 0 0 0 14px rgba(5, 150, 105, 0); } 
        }
      `}</style>
    </a>
  );
}
