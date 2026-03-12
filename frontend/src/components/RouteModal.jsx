import React, { useState } from 'react';

export default function RouteModal({ route, onClose }) {
  const [busType, setBusType] = useState('seater');

  const scrollToBooking = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-40">
          <img src={route.image} alt="" className="w-full h-full object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/40">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="absolute bottom-3 left-4 text-white">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{route.from} → {route.to}</h3>
            <p className="text-sm text-white/80">{route.distance} • {route.duration}</p>
          </div>
        </div>

        <div className="p-6">
          <h4 className="font-semibold text-[#0D5C63] mb-3">Route Stops</h4>
          <div className="space-y-2 mb-6">
            {route.stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${i === 0 || i === route.stops.length - 1 ? 'bg-[#E8762C]' : 'bg-[#0D7377]'}`} />
                  {i < route.stops.length - 1 && <div className="w-0.5 h-6 bg-gray-200" />}
                </div>
                <div className="flex-1 flex justify-between">
                  <span className="font-medium text-sm">{stop.city}</span>
                  <span className="text-xs text-gray-500">{stop.time}</span>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-[#0D5C63] mb-3">Amenities</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {['AC', 'WiFi', 'Charging Port', 'Blanket', 'Water Bottle', 'GPS Tracking'].map(a => (
              <span key={a} className="bg-[#0D7377]/10 text-[#0D7377] text-xs px-3 py-1 rounded-full font-medium">{a}</span>
            ))}
          </div>

          <h4 className="font-semibold text-[#0D5C63] mb-3">Select Bus Type</h4>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['seater', 'sleeper'].map(t => (
              <button key={t} onClick={() => setBusType(t)}
                className={`border-2 rounded-xl p-3 text-sm font-medium transition-all ${busType === t ? 'border-[#0D7377] bg-[#0D7377]/10 text-[#0D7377]' : 'border-gray-200 text-gray-500'}`}>
                <i className={`fa-solid ${t === 'seater' ? 'fa-chair' : 'fa-bed'} block mb-1 text-lg`}></i>
                {t === 'seater' ? 'AC Seater' : 'AC Sleeper'}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-[#0D5C63]">₹{route.price}</span>
              <span className="text-sm text-gray-400 ml-1">/ seat</span>
            </div>
            <button onClick={scrollToBooking}
              className="bg-[#E8762C] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#d4681f] transition-all">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
