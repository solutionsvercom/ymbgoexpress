import React from 'react';

const reviews = [
  { name: 'Ramesh Sharma', route: 'Indore → Morena', date: 'Feb 2026', rating: 5, text: 'Excellent service! The sleeper bus was very comfortable and clean. Will definitely travel again.' },
  { name: 'Priya Verma', route: 'Gwalior → Indore', date: 'Jan 2026', rating: 5, text: 'Best bus service in MP! On-time departure, AC was perfect, and staff was very helpful.' },
  { name: 'Suresh Patel', route: 'Bhopal → Morena', date: 'Feb 2026', rating: 4, text: 'Good comfortable journey. The live tracking feature is really helpful for family members.' },
  { name: 'Anita Joshi', route: 'Indore → Gwalior', date: 'Jan 2026', rating: 5, text: 'Amazing experience! Booked a sleeper berth and had a great overnight journey.' },
  { name: 'Vikram Singh', route: 'Morena → Indore', date: 'Dec 2025', rating: 5, text: 'Premium quality at an affordable price. YMB GoExpress is truly a royal experience!' },
  { name: 'Kavita Dubey', route: 'Indore → Bhopal', date: 'Feb 2026', rating: 4, text: 'Comfortable seats, clean bus, and helpful staff. The WhatsApp support is very quick too.' },
];

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">REVIEWS</span>
          <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            What Passengers Say
          </h2>
          <div className="mt-4 text-4xl font-bold text-[#0D5C63]">4.8 ⭐</div>
          <div className="text-gray-500 text-sm">Based on 1,200+ reviews</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D7377] to-[#E8762C] flex items-center justify-center text-white font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-[#0D5C63] text-sm">{r.name}</div>
                  <div className="text-xs text-gray-400">{r.route} • {r.date}</div>
                </div>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }, (_, j) => (
                  <span key={j} className={j < r.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
