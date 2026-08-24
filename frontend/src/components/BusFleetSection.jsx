import React from 'react';
import { Sparkles } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';

const fleetImages = [
  { url: '/images/Luxury-Coach-Exterior.png', label: 'Luxury Coach Exterior' },
  { url: '/images/Premium-Interior.png', label: 'Premium Interior' },
  { url: '/images/Comfortable-Seating.png', label: 'Comfortable Seating' },
  { url: '/images/Sleeper-Berths.png', label: 'Sleeper Berths' },
  { url: '/images/Modern-Fleet.png', label: 'Modern Fleet' },
  { url: '/images/Highway-Travel.png', label: 'Highway Travel' },
];

// Duplicate the set once so translateX(-50%) loops seamlessly
const loopImages = [...fleetImages, ...fleetImages];

export default function BusFleetSection() {
  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 flex items-center justify-center gap-1.5 font-bold">
              <Sparkles size={12} className="text-brand-gold" /> OUR PREMIUM FLEET
            </p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Designed For Comfort, <span className="text-gradient-red">Built For Your Journey</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              Explore our state-of-the-art coaches designed to make your travel pleasant, quiet, and completely luxurious.
            </p>
          </div>
        </TextReveal>

        {/* Infinite Marquee */}
        <div className="relative">
          {/* Light edge fade masks */}
          <div className="marquee-fade-left pointer-events-none absolute inset-y-0 left-0 w-10 md:w-20 z-10" />
          <div className="marquee-fade-right pointer-events-none absolute inset-y-0 right-0 w-10 md:w-20 z-10" />

          <div className="marquee-container overflow-hidden">
            <div className="marquee-track flex gap-6 w-max">
              {loopImages.map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 md:w-96 relative rounded-2xl overflow-hidden group aspect-[4/3] bg-[#FBF9F6] border border-brand-gold/15 hover:border-brand-red/30 transition-all duration-500 shadow-sm hover:shadow-md"
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Tag label */}
                  <div className="absolute bottom-5 inset-x-5 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-brand-offwhite">
                    <span className="font-display font-semibold text-lg">
                      {img.label}
                    </span>
                    <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Premium Quality Berth/Seat
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 32s linear infinite;
          will-change: transform;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-fade-left {
          background: linear-gradient(to right, rgba(250, 247, 240, 0.5), rgba(250, 247, 240, 0));
        }
        .marquee-fade-right {
          background: linear-gradient(to left, rgba(250, 247, 240, 0.5), rgba(250, 247, 240, 0));
        }
      `}</style>
    </section>
  );
}