import React, { useState, useEffect } from 'react';

const cities = ['Indore', 'Dewas', 'Gwalior', 'Morena'];

export default function LiveTrackingSection() {
  const [busPosition, setBusPosition] = useState(0);
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition(p => (p >= 100 ? 0 : p + 0.5));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const currentCityIndex = Math.floor(busPosition / 25);
  const currentCity = cities[Math.min(currentCityIndex, cities.length - 2)];
  const nextCity = cities[Math.min(currentCityIndex + 1, cities.length - 1)];

  return (
    <section className="py-16 bg-gradient-to-br from-[#0D5C63] to-[#0D7377]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">LIVE TRACKING</span>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Track Your Bus in Real-Time
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
          <div className="relative mb-8">
            <div className="flex justify-between mb-2">
              {cities.map(city => (
                <span key={city} className="text-white text-xs font-medium">{city}</span>
              ))}
            </div>
            <div className="relative h-2 bg-white/20 rounded-full">
              <div className="h-full bg-[#E8762C] rounded-full transition-all duration-300" style={{ width: `${busPosition}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300" style={{ left: `${busPosition}%` }}>
                <span className="text-2xl">🚌</span>
              </div>
            </div>
            <div className="flex justify-between mt-1">
              {cities.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full border-2 border-white ${i <= currentCityIndex ? 'bg-[#E8762C]' : 'bg-white/30'}`} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Current Stop', value: currentCity, icon: '📍' },
              { label: 'Next Stop', value: nextCity, icon: '🏁' },
              { label: 'ETA', value: `${Math.max(0, Math.round((100 - busPosition) * 0.6))} mins`, icon: '⏱️' }
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white/15 rounded-xl p-4 text-center text-white">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-white/60 mb-1">{label}</div>
                <div className="font-bold">{value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 max-w-md mx-auto">
            <input value={trackingId} onChange={e => setTrackingId(e.target.value)}
              placeholder="Enter Booking ID (e.g. YMB1234)"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
            <button className="bg-[#E8762C] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#d4681f] transition-all text-sm whitespace-nowrap">
              Track Bus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
