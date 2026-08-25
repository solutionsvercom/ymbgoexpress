import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';

const FALLBACK_SCHEDULES = [
  {
    title: 'Indore → Gwalior Daily', subtitle: 'Overnight AC service', type: 'AC Seater',
    duration: '9h 00m', distance: '500 km',
    stops: [{ city: 'Indore', time: '07:00 PM' }, { city: 'Bhopal', time: '11:30 PM' }, { city: 'Gwalior', time: '06:30 AM' }]
  },
  {
    title: 'Gwalior → Indore Daily', subtitle: 'Overnight AC service', type: 'AC Seater',
    duration: '9h 00m', distance: '500 km',
    stops: [{ city: 'Gwalior', time: '10:30 PM' }, { city: 'Bhopal', time: '04:00 AM' }, { city: 'Indore', time: '09:15 AM' }]
  }
];

export default function ScheduleSection() {
  const [schedules, setSchedules] = useState(FALLBACK_SCHEDULES);
  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    axios.get('/api/schedules')
      .then(({ data }) => {
        if (data?.data?.length) setSchedules(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 flex items-center justify-center gap-1.5 font-bold">
              <Calendar size={12} className="text-brand-gold" /> ROUTE TIMETABLE
            </p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Bus Timings & <span className="text-gradient-red">Daily Schedule</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              Explore scheduled daily services. Plan departures accurately using fixed timetable checklists.
            </p>
          </div>
        </TextReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((s, i) => (
            <div 
              key={i} 
              className="bg-[#FBF9F6] border border-brand-gold/15 rounded-2xl p-6 hover:border-brand-red/35 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-brand-charcoal text-base leading-tight mb-1">{s.title}</h3>
                    <p className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-wider">{s.subtitle}</p>
                  </div>
                  <span className="bg-brand-red/10 text-brand-red border border-brand-red/10 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {s.type}
                  </span>
                </div>

                {/* Timeline stops */}
                <div className="space-y-4 mb-6 relative pl-3.5 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-brand-gold/15">
                  {s.stops.map((stop, j) => (
                    <div key={j} className="flex items-center gap-2 relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-3.5 w-2 h-2 rounded-full border ${
                        j === 0 || j === s.stops.length - 1 
                          ? 'bg-brand-red border-brand-cream scale-110' 
                          : 'bg-brand-gold border-brand-gold'
                      }`} />
                      <span className="text-xs text-brand-charcoal/80 flex-1 font-medium">{stop.city}</span>
                      <span className="text-xs text-brand-red font-mono font-semibold">{stop.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex gap-4 text-xs text-brand-charcoal/50 mb-4 border-t border-brand-gold/10 pt-4">
                  <span className="flex items-center gap-1"><Clock size={12} className="text-brand-gold" /> {s.duration}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-brand-gold" /> {s.distance}</span>
                </div>
                <button 
                  onClick={scrollToBooking}
                  className="w-full bg-transparent border border-brand-red text-brand-red hover:bg-brand-red hover:text-brand-offwhite py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
                >
                  Book This Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
