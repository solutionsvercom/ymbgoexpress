import React, { useState, useEffect } from 'react';
import SearchWidget from './SearchWidget.jsx';

export default function HeroSection() {
  const [busPos, setBusPos] = useState(-10);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusPos(p => (p > 110 ? -10 : p + 0.3));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center ">
        
        {/* <img src="/images/Hero Section (Web View).png" alt=""  width="100%" height="100%" className="object-cover" /> */}

                <div className="absolute inset-0 bg-cover bg-center">
          {/* Mobile Image: Shown by default, hidden on Medium screens and up */}
          <img 
            src="/images/Hero-Section-Mobile.png" 
            alt="Hero Mobile" 
            className="block md:hidden w-full h-full object-cover" 
          />

          {/* Web Image: Hidden by default, shown on Medium screens and up */}
          <img 
            src="/images/Bus-mountain.jpeg" 
            alt="Hero Web" 
            className="hidden md:block w-full h-full object-cover" 
          />
        </div>
      </div>
        

      {/* <div className="absolute inset-0 bg-gradient-to-b from-[#0D5C63]/85 via-[#0D5C63]/70 to-[#0D5C63]/85" /> */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-[#0D5C63]/60 via-[#0D5C63]/30 to-[#0D5C63]/60" /> */}
{/* This keeps the middle 50% of the screen much clearer */}
<div className="absolute inset-0 bg-gradient-to-b from-[#0D5C63]/85 from-5% via-transparent to-[#0D5C63]/85 to-95%" />  
      

      <div className="relative z-10 text-center px-6 pt-20 pb-10 w-full max-w-5xl mx-auto">
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Travel in <span className="text-[#E8762C]">Royal Comfort</span>
        </h1>
        <p className="text-white/80 text-lg mb-2">Indore → Gwalior → Morena | AC Sleeper & Seater Buses</p>
        <p className="text-[#E8762C] text-xl italic mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>यात्रा खास, सेवा रॉयल</p>

        {/* <SearchWidget /> */}

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {['✅ 100% Safe', '❄️ AC Buses', '🛌 Sleeper Available', '📍 Live Tracking'].map(badge => (
            <span key={badge} className="bg-white/10 backdrop-blur text-white text-sm px-4 py-2 rounded-full border border-white/20">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-8 text-4xl transition-all duration-100"
        style={{ left: `${busPos}%`, transform: 'translateX(-50%)' }}
      >
        <i className="fa-solid fa-bus text-[#E8762C] drop-shadow-lg"></i>
      </div>
    </div>
  );
}
