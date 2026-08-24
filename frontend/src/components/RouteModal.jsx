import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bus, Armchair, ChevronRight, Wifi, Zap, Navigation, Droplet, Wind, ThermometerSnowflake } from 'lucide-react';

const amenities = [
  { icon: ThermometerSnowflake, label: 'AC & Fan' },
  { icon: Wifi, label: 'WiFi Enabled' },
  { icon: Zap, label: 'Charging Points' },
  { icon: Wind, label: 'Premium Blankets' },
  { icon: Droplet, label: 'Water Bottle' },
  { icon: Navigation, label: 'Live GPS Tracking' },
];

export default function RouteModal({ route, onClose }) {
  const [busType, setBusType] = useState('seater');
  const [activeTab, setActiveTab] = useState('stops');

  const scrollToBooking = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-brand-charcoal rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col text-brand-offwhite overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Hero/Image Section */}
          <div className="relative h-52 shrink-0">
            <img src={route.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-black/10" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/30 text-brand-offwhite/90 hover:bg-black/50 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X size={17} />
            </button>
            <div className="absolute bottom-5 left-6 right-6">
              <span className="bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                {route.type}
              </span>
              <h3 className="text-2xl font-extrabold font-display leading-tight">
                {route.from} <span className="text-brand-gold">→</span> {route.to}
              </h3>
              <p className="text-xs text-brand-offwhite/60 flex items-center gap-2 mt-1.5">
                <span>{route.distance}</span>
                <span className="w-1 h-1 rounded-full bg-brand-offwhite/30" />
                <span>{route.duration}</span>
              </p>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            <div className="p-6 pb-4">
              {/* Tabs — flat pill toggle */}
              <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
                <button
                  onClick={() => setActiveTab('stops')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors duration-200 ${
                    activeTab === 'stops'
                      ? 'bg-brand-gold text-brand-charcoal'
                      : 'text-brand-offwhite/50 hover:text-brand-offwhite/80'
                  }`}
                >
                  Boarding Points
                </button>
                <button
                  onClick={() => setActiveTab('departure')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors duration-200 ${
                    activeTab === 'departure'
                      ? 'bg-brand-gold text-brand-charcoal'
                      : 'text-brand-offwhite/50 hover:text-brand-offwhite/80'
                  }`}
                >
                  Dropping Points
                </button>
              </div>

              {/* Boarding Points Content */}
              {activeTab === 'stops' && (
                <div className="space-y-4 mb-6 min-h-[100px]">
                  {route.stops.map((stop, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center w-3 mt-1.5">
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-brand-red' : 'bg-brand-gold/60'}`} />
                        {i < route.stops.length - 1 && <div className="w-px h-8 bg-white/10 mt-1" />}
                      </div>
                      <div className="flex-1 flex justify-between items-start gap-4 pb-1">
                        <span className="text-sm text-brand-offwhite/80 leading-snug">{stop.city}</span>
                        <span className="text-xs text-brand-gold font-mono font-semibold shrink-0">{stop.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropping Points Content */}
              {activeTab === 'departure' && (
                <div className="space-y-4 mb-6 min-h-[100px]">
                  {route.dp.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center w-3 mt-1.5">
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-brand-red' : 'bg-brand-gold/60'}`} />
                        {i < route.dp.length - 1 && <div className="w-px h-8 bg-white/10 mt-1" />}
                      </div>
                      <div className="flex-1 flex justify-between items-start gap-4 pb-1">
                        <span className="text-sm text-brand-offwhite/80 leading-snug">{d.city}</span>
                        <span className="text-xs text-brand-gold font-mono font-semibold shrink-0">{d.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-semibold text-brand-offwhite/90 text-sm mb-3">Onboard Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 bg-white/[0.03] text-brand-offwhite/70 text-xs px-3 py-2.5 rounded-xl"
                    >
                      <Icon size={14} className="text-brand-gold shrink-0" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Bus Type */}
              <div>
                <h4 className="font-semibold text-brand-offwhite/90 text-sm mb-3">Select Bus Service</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBusType('seater')}
                    className={`rounded-xl p-3.5 text-left transition-colors duration-200 flex items-center gap-3 ${
                      busType === 'seater'
                        ? 'bg-brand-red text-white'
                        : 'bg-white/[0.03] text-brand-offwhite/45 hover:bg-white/[0.06] hover:text-brand-offwhite/70'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${busType === 'seater' ? 'bg-white/15' : 'bg-white/[0.04]'}`}>
                      <Armchair size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">AC Seater</div>
                      <div className="text-[10px] opacity-75 mt-0.5">Ergonomic Pushback</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setBusType('sleeper')}
                    className={`rounded-xl p-3.5 text-left transition-colors duration-200 flex items-center gap-3 ${
                      busType === 'sleeper'
                        ? 'bg-brand-red text-white'
                        : 'bg-white/[0.03] text-brand-offwhite/45 hover:bg-white/[0.06] hover:text-brand-offwhite/70'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${busType === 'sleeper' ? 'bg-white/15' : 'bg-white/[0.04]'}`}>
                      <Bus size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">AC Sleeper</div>
                      <div className="text-[10px] opacity-75 mt-0.5">Spacious Berths</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky price + action footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-brand-charcoal shrink-0">
            <div>
              <span className="text-2xl font-extrabold font-display text-brand-gold">₹{route.price}</span>
              <span className="text-xs text-brand-offwhite/40 ml-1.5">/ seat</span>
            </div>
            <button
              onClick={scrollToBooking}
              className="bg-brand-red hover:bg-brand-red/90 active:scale-[0.98] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 group"
            >
              Proceed to Book
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}