import React, { useState } from 'react';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20book%20a%20bus%20ticket"
      target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
    >
      {hovered && (
        <span className="bg-white text-gray-700 text-sm px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          Chat with us!
        </span>
      )}
      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform" style={{ animation: 'pulse-wa 2s infinite' }}>
        <i className="fa-brands fa-whatsapp text-white text-2xl"></i>
      </div>
      <style>{`
        @keyframes pulse-wa { 0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); } 50% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); } }
      `}</style>
    </a>
  );
}
