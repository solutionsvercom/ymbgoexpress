import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';
import GlowingButton from './ui/GlowingButton.jsx';

const deals = [
  { icon: '🌙', title: 'Overnight Special', desc: 'Book any overnight route and get 15% off on your first journey with us.', badge: 'LIMITED OFFER' },
  { icon: '👨‍👩‍👧‍👦', title: 'Family Pack Saver', desc: 'Travel with 4+ passengers and enjoy flat ₹200 off per person on any route.', badge: 'POPULAR' },
  { icon: '🔄', title: 'Round Trip Discount', desc: 'Book a round trip and save up to 20% on your return journey fare.', badge: 'LIMITED OFFER' },
];

export default function DealsSection() {
  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 flex items-center justify-center gap-1.5 font-bold">
              <Tag size={12} className="text-brand-gold" /> SPECIAL DISCOUNTS & DEALS
            </p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Save Big On Your <span className="text-gradient-red">Travel Bookings</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              We offer regular promo codes and family group travel discounts. Grab a deal today and save!
            </p>
          </div>
        </TextReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <div
              key={i}
              className="bg-[#FBF9F6] border border-brand-gold/15 hover:border-brand-red/30 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
            >
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{deal.icon}</div>
                <div className="mb-3">
                  <span className="bg-brand-red/10 text-brand-red border border-brand-red/10 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {deal.badge}
                  </span>
                </div>
                <h3 className="text-brand-charcoal font-display font-bold text-lg mb-2">{deal.title}</h3>
                <p className="text-xs text-brand-charcoal/60 leading-relaxed mb-6">{deal.desc}</p>
              </div>
              <GlowingButton
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                size="sm"
                variant="outline"
                className="w-full text-xs font-bold"
              >
                Grab This Deal
              </GlowingButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
