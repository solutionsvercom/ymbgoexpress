import React from 'react';

const deals = [
  { icon: '🌙', title: 'Overnight Special', desc: 'Book any overnight route and get 15% off on your first journey with us.', badge: 'LIMITED' },
  { icon: '👨‍👩‍👧‍👦', title: 'Family Pack', desc: 'Travel with 4+ passengers and enjoy flat ₹200 off per person on any route.', badge: 'LIMITED' },
  { icon: '🔄', title: 'Round Trip Saver', desc: 'Book a round trip and save up to 20% on your return journey fare.', badge: 'LIMITED' },
];

export default function DealsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#0D5C63] to-[#0D7377]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">SPECIAL OFFERS</span>
        <h2 className="text-white text-3xl md:text-4xl font-bold mt-2 mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Limited Time Deals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-left hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">{deal.icon}</div>
              <span className="bg-[#E8762C] text-white text-xs px-2 py-0.5 rounded-full font-bold mb-3 inline-block">{deal.badge}</span>
              <h3 className="text-white font-bold text-lg mb-2">{deal.title}</h3>
              <p className="text-white/70 text-sm mb-4">{deal.desc}</p>
              <button className="bg-[#E8762C] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#d4681f] transition-all">
                Grab Deal
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
