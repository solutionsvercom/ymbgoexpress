import React, { useState, useEffect, useRef } from 'react';
import RouteModal from './RouteModal.jsx';

const routes = [
  {
    id: 1, from: 'Indore', to: 'Morena', duration: '10h 30m', price: 999, seats: 12,
    type: 'AC Sleeper', distance: '480 km', departure: '08:00 PM', arrival: '07:30 AM',
    // The syntax becomes a simple string path
    image: '/images/indore-morena.png',
    stops: [
      { city: 'Indore', time: '08:00 PM' }, { city: 'Dewas', time: '08:45 PM' },
      { city: 'Bhopal', time: '11:00 PM' }, { city: 'Gwalior', time: '04:00 AM' },
      { city: 'Morena', time: '06:30 AM' }
    ]
  },
  {
    id: 2, from: 'Morena', to: 'Indore', duration: '10h 30m', price: 999, seats: 8,
    type: 'AC Sleeper', distance: '480 km', departure: '08:00 PM', arrival: '07:30 AM',
    image: '/images/morena-indore.jpeg',
    stops: [
      { city: 'Morena', time: '08:00 PM' }, { city: 'Gwalior', time: '08:30 PM' },
      { city: 'Bhopal', time: '01:00 AM' }, { city: 'Dewas', time: '04:30 AM' },
      { city: 'Indore', time: '07:30 AM' }
    ]
  },
  {
    id: 3, from: 'Indore', to: 'Gwalior', duration: '8h 00m', price: 999, seats: 15,
    type: 'AC Seater', distance: '370 km', departure: '08:00 PM', arrival: '06:30 AM',
    image: '/images/indore-gwalior.png',
    stops: [
      { city: 'Indore', time: '08:00 PM' }, { city: 'Bhopal', time: '11:30 PM' },
      { city: 'Gwalior', time: '05:00 AM' }
    ]
  },
  {
    id: 4, from: 'Gwalior', to: 'Indore', duration: '8h 00m', price: 999, seats: 20,
    type: 'AC Seater', distance: '370 km', departure: '09:00 PM', arrival: '06:30 AM',
    image: '/images/gwalior-indore.jpeg',
    stops: [
      { city: 'Gwalior', time: '08:00 PM' }, { city: 'Bhopal', time: '01:30 AM' },
      { city: 'Indore', time: '04:00 AM' }
    ]
  },
  {
    id: 5, from: 'Bhind', to: 'Indore', duration: '6h 30m', price: 999, seats: 5,
    type: 'AC Sleeper', distance: '290 km', departure: '09:00 PM', arrival: '06:30 AM',
    image: '/images/bhind-indore.jpeg',
    stops: [
      { city: 'Bhopal', time: '10:00 PM' }, { city: 'Gwalior', time: '02:30 AM' },
      { city: 'Morena', time: '04:30 AM' }
    ]
  },
  {
    id: 6, from: 'Indore', to: 'Bhind', duration: '3h 30m', price: 999, seats: 18,
    type: 'AC Seater', distance: '195 km', departure: '08:00 PM', arrival: '06:30 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Indore', time: '08:00 PM' }, { city: 'Dewas', time: '08:45 PM' },
      { city: 'Bhopal', time: '11:30 PM' }
    ]
  }
];

export default function RoutesSection() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0');
      }),
      { threshold: 0.1 }
    );
    cardRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">POPULAR ROUTES</span>
          <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Explore Our Routes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, i) => (
            <div
              key={route.id}
              ref={el => cardRefs.current[i] = el}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 opacity-0 translate-y-8 cursor-pointer group"
              onClick={() => setSelectedRoute(route)}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={route.image} alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 right-3 bg-[#E8762C] text-white text-xs font-bold px-3 py-1 rounded-full">{route.type}</span>
                <div className="absolute bottom-3 left-3 text-white">
                  
                </div>
              </div>
              <div className="font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {route.from} → {route.to}
                  </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-500">{route.departure} – {route.arrival}</div>
                  <div className="text-[#0D7377] font-semibold text-sm">{route.duration}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-[#0D5C63]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      ₹{route.price}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ seat</span>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${route.seats <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {route.seats} seats left
                  </span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedRoute(route); }}
                  className="mt-3 w-full bg-gradient-to-r from-[#0D7377] to-[#0D5C63] text-white py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                >
                  View Details & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedRoute && <RouteModal route={selectedRoute} onClose={() => setSelectedRoute(null)} />}
    </section>
  );
}
