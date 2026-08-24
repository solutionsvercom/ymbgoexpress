import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';
import InfiniteCards from './ui/InfiniteCards.jsx';

const reviews = [
  { name: 'Ramesh Sharma', route: 'Indore → Morena', date: 'Feb 2026', rating: 5, text: 'Excellent service! The sleeper bus was very comfortable and clean. Will definitely travel again.' },
  { name: 'Priya Verma', route: 'Gwalior → Indore', date: 'Jan 2026', rating: 5, text: 'Best bus service in MP! On-time departure, AC was perfect, and staff was very helpful.' },
  { name: 'Suresh Patel', route: 'Bhopal → Morena', date: 'Feb 2026', rating: 4, text: 'Good comfortable journey. The live tracking feature is really helpful for family members.' },
  { name: 'Anita Joshi', route: 'Indore → Gwalior', date: 'Jan 2026', rating: 5, text: 'Amazing experience! Booked a sleeper berth and had a great overnight journey.' },
  { name: 'Vikram Singh', route: 'Morena → Indore', date: 'Dec 2025', rating: 5, text: 'Premium quality at an affordable price. YMB GoExpress is truly a royal experience!' },
  { name: 'Kavita Dubey', route: 'Indore → Bhopal', date: 'Feb 2026', rating: 4, text: 'Comfortable seats, clean bus, and helpful staff. The WhatsApp support is very quick too.' },
];

export default function ReviewsSection() {
  const renderReviewItem = (r, i) => (
    <div className="bg-[#FBF9F6] border border-brand-gold/15 rounded-2xl p-6 h-full flex flex-col justify-between hover:border-brand-red/35 transition-all duration-300 shadow-sm w-[350px]">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-brand-gold flex items-center justify-center text-brand-offwhite font-bold text-sm">
            {r.name[0]}
          </div>
          <div>
            <div className="font-bold text-brand-charcoal text-sm">{r.name}</div>
            <div className="text-[10px] text-brand-charcoal/40">{r.route} • {r.date}</div>
          </div>
        </div>
        
        {/* Rating stars */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }, (_, j) => (
            <Star 
              key={j} 
              size={12} 
              className={j < r.rating ? 'text-brand-gold fill-brand-gold' : 'text-brand-charcoal/10'} 
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-brand-charcoal/70 leading-relaxed italic">"{r.text}"</p>
    </div>
  );

  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />
      
      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 flex items-center justify-center gap-1.5 font-bold">
              <MessageSquare size={12} className="text-brand-gold" /> PASSENGER REVIEWS
            </p>
            <h2 className="section-heading text-brand-charcoal mb-3">
              What Passengers Say <span className="text-gradient-red">About Us</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-2xl font-bold font-display text-brand-charcoal">4.8</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} size={14} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <span className="text-xs text-brand-charcoal/40 font-semibold">(1,200+ Reviews)</span>
            </div>
          </div>
        </TextReveal>

        {/* Testimonials Infinite Loop Carousel */}
        <div className="relative mt-8">
          <InfiniteCards 
            items={reviews}
            renderItem={renderReviewItem}
            direction="left"
            speed="slow"
            className="py-4"
          />
        </div>
      </div>
    </section>
  );
}
