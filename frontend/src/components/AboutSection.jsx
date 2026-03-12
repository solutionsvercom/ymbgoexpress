import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">ABOUT US</span>
            <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Madhya Bharat Premium Bus Service
            </h2>
            <p className="text-[#0D7377] text-xl italic mb-6">यात्रा खास, सेवा रॉयल</p>
            <p className="text-[#374151] mb-6 leading-relaxed text-sm">
              YMB GoExpress was founded to give people of Madhya Pradesh a safe, comfortable, and premium overnight travel experience from Indore to Morena via Gwalior. We believe every journey should feel special.
            </p>
            <p className="text-[#374151] mb-8 leading-relaxed text-sm">
              Our fleet of modern buses equipped with AC, comfortable seating, and sleeper options ensures you arrive refreshed. With live tracking, trained staff, and a commitment to safety, YMB GoExpress is your trusted travel partner.
            </p>
            <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 text-[#E8762C] font-semibold hover:gap-3 transition-all">
              Contact Us <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="relative">
            <img src="/images/Bus-mountain.jpeg" alt="YMB GoExpress Bus"
              className="rounded-2xl shadow-xl w-full h-80 md:h-96 object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-[#0D7377] text-white p-6 rounded-xl shadow-lg hidden md:block">
              <div className="text-3xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>20+</div>
              <div className="text-sm">Years of Service</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
