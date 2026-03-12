import React from 'react';

const schedules = [
  {
    title: 'Indore → Morena Express', subtitle: 'Via Dewas, Bhopal, Gwalior', type: 'AC Sleeper',
    duration: '10h 30m', distance: '480 km',
    stops: [{ city: 'Indore', time: '08:00 PM' }, { city: 'Bhopal', time: '11:00 PM' }, { city: 'Gwalior', time: '04:00 AM' }, { city: 'Morena', time: '06:30 AM' }]
  },
  {
    title: 'Morena → Indore Express', subtitle: 'Via Gwalior, Bhopal, Dewas', type: 'AC Sleeper',
    duration: '10h 30m', distance: '480 km',
    stops: [{ city: 'Morena', time: '07:00 PM' }, { city: 'Gwalior', time: '08:30 PM' }, { city: 'Bhopal', time: '01:00 AM' }, { city: 'Indore', time: '05:30 AM' }]
  },
  {
    title: 'Indore ↔ Gwalior Daily', subtitle: 'Via Bhopal', type: 'AC Seater',
    duration: '8h 00m', distance: '370 km',
    stops: [{ city: 'Indore', time: '09:00 PM' }, { city: 'Bhopal', time: '11:30 PM' }, { city: 'Gwalior', time: '05:00 AM' }]
  }
];

export default function ScheduleSection() {
  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">SCHEDULE</span>
          <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Bus Timings & Schedule
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-[#0D5C63]">{s.title}</h3>
                  <p className="text-xs text-gray-500">{s.subtitle}</p>
                </div>
                <span className="bg-[#0D7377]/10 text-[#0D7377] text-xs px-2 py-1 rounded-full font-medium">{s.type}</span>
              </div>
              <div className="space-y-2 mb-4">
                {s.stops.map((stop, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${j === 0 || j === s.stops.length - 1 ? 'bg-[#E8762C]' : 'bg-[#0D7377]'}`} />
                    <span className="text-sm text-gray-700 flex-1">{stop.city}</span>
                    <span className="text-xs text-gray-500 font-medium">{stop.time}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-xs text-gray-500 mb-4">
                <span>⏱ {s.duration}</span><span>📍 {s.distance}</span>
              </div>
              <button onClick={scrollToBooking}
                className="w-full bg-[#0D7377] text-white py-2 rounded-xl text-sm font-semibold hover:bg-[#0D5C63] transition-all">
                Book This Route
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
