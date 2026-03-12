import React, { useEffect, useRef } from 'react';

const features = [
  { icon: 'fa-sparkles', title: 'Spotless Cleanliness', desc: 'Sanitized before every journey' },
  { icon: 'fa-bottle-water', title: 'Water Bottle', desc: 'Complimentary for each passenger' },
  { icon: 'fa-utensils', title: 'Snacks on Board', desc: 'Light refreshments included' },
  { icon: 'fa-blanket', title: 'Blanket Service', desc: 'Soft blankets for night travel' },
  { icon: 'fa-shield-halved', title: 'Women Safety', desc: 'CCTV & dedicated support' },
  { icon: 'fa-person', title: 'Trained Staff', desc: 'Professional & courteous crew' },
  { icon: 'fa-chair', title: 'Rest Stops', desc: 'Planned breaks at premium stops' },
  { icon: 'fa-clock', title: 'Always On-Time', desc: 'Punctuality is our promise' },
  { icon: 'fa-bag', title: 'Luggage Care', desc: 'Safe & handled with care' },
  { icon: 'fa-heart', title: 'Couple Seating', desc: 'Private seating arrangements' },
  { icon: 'fa-map', title: 'Live GPS', desc: 'Real-time journey tracking' },
];

export default function FeaturesSection() {
  const refs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0'); });
    }, { threshold: 0.15 });
    refs.current.forEach(r => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">WHY CHOOSE US</span>
          <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Travel Features
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} ref={el => refs.current[i] = el}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8 group">
              <div className="w-12 h-12 bg-[#0D7377]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0D7377] transition-all">
                <i className={`fa-solid ${f.icon} text-[#0D7377] group-hover:text-white transition-all`}></i>
              </div>
              <h3 className="font-bold text-[#0D5C63] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
