import React, { useRef } from 'react';

const fleetImages = [
  { url: '/images/Luxury-Coach-Exterior.png', label: 'Luxury Coach Exterior' },
  { url: '/images/Premium-Interior.png', label: 'Premium Interior' },
  { url: '/images/Comfortable-Seating.png', label: 'Comfortable Seating' },
  { url: '/images/Sleeper-Berths.png', label: 'Sleeper Berths' },
  { url: '/images/Modern-Fleet.png', label: 'Modern Fleet' },
  { url: '/images/Highway-Travel.png', label: 'Highway Travel' },
];

export default function BusFleetSection() {
  const scrollRef = useRef(null);
  const scroll = dir => scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">OUR FLEET</span>
        <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2 mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Travel in Style and Comfort
        </h2>
        <div className="relative">
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-3 hover:bg-white hidden md:block">
            <i className="fa-solid fa-chevron-left text-[#0D7377]"></i>
          </button>
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-3 hover:bg-white hidden md:block">
            <i className="fa-solid fa-chevron-right text-[#0D7377]"></i>
          </button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {fleetImages.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-72 md:w-80 snap-center relative rounded-2xl overflow-hidden group">
                <img src={img.url} alt={img.label} className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-4 left-4 right-4 bg-[#0D7377] text-white text-sm font-medium px-4 py-2 rounded-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
