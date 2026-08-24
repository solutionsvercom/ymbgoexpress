import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Compass, Search, Calendar, ChevronRight } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';
import GlowingButton from './ui/GlowingButton.jsx';

const cities = ['Indore', 'Bhopal', 'Gwalior', 'Morena'];

export default function LiveTrackingSection() {
  const [busPosition, setBusPosition] = useState(0);
  const [trackingId, setTrackingId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (trackResult) return undefined;
    const interval = setInterval(() => {
      setBusPosition(p => (p >= 100 ? 0 : p + 0.5));
    }, 200);
    return () => clearInterval(interval);
  }, [trackResult]);

  const displayCities = trackResult?.cities?.length ? trackResult.cities : cities;
  const position = trackResult ? Number(trackResult.progress) || 0 : busPosition;
  const currentCityIndex = Math.floor(position / Math.max(100 / Math.max(displayCities.length - 1, 1), 1));
  const currentCity = trackResult?.currentCity || displayCities[Math.min(currentCityIndex, displayCities.length - 2)];
  const nextCity = trackResult?.nextCity || displayCities[Math.min(currentCityIndex + 1, displayCities.length - 1)];

  const handleTrack = async (e) => {
    e?.preventDefault?.();
    if (!trackingId.trim()) {
      setTrackError('Enter a booking ID or bus ID (for example YMB1001).');
      return;
    }
    setTracking(true);
    setTrackError('');
    try {
      const { data } = await axios.get(`/api/tracking/${encodeURIComponent(trackingId.trim())}`);
      setTrackResult(data.data);
    } catch {
      setTrackResult(null);
      setTrackError('No live location found for that ID. Try a booking ID from your confirmation.');
    } finally {
      setTracking(false);
    }
  };

  return (
    <section className="section-padding bg-brand-charcoal text-brand-offwhite relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-gold mb-3 flex items-center justify-center gap-1.5 font-bold">
              <Compass size={12} className="animate-spin-slow" /> LIVE SATELLITE TRACKING
            </p>
            <h2 className="section-heading text-brand-offwhite mb-4">
              Real-Time <span className="text-gradient-gold">GPS Fleet Tracker</span>
            </h2>
            <p className="text-brand-offwhite/50 max-w-xl mx-auto text-sm">
              Keep your relatives and travel plans updated with accurate satellite coordinates and live ETA markers.
            </p>
          </div>
        </TextReveal>

        <div className="bg-brand-darker border border-brand-gold/15 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto">
          {/* Tracker Map bar */}
          <div className="relative mb-12 mt-4">
            <div className="flex justify-between mb-4">
              {displayCities.map(city => (
                <span key={city} className="text-brand-offwhite/60 text-xs md:text-sm font-semibold font-display tracking-wider">
                  {city}
                </span>
              ))}
            </div>

            <div className="relative h-2 bg-brand-offwhite/[0.06] rounded-full">
              {/* Progress track */}
              <div
                className="h-full bg-gradient-to-r from-brand-red to-brand-gold rounded-full transition-all duration-300 shadow-lg shadow-brand-red/35"
                style={{ width: `${position}%` }}
              />

              {/* Floating Bus Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 z-10"
                style={{ left: `${position}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-brand-red border-2 border-brand-offwhite flex items-center justify-center shadow-lg shadow-brand-red/40 animate-pulse">
                  <Navigation size={12} className="text-brand-offwhite fill-brand-offwhite rotate-90" />
                </div>
              </div>
            </div>

            {/* Dots under line */}
            <div className="flex justify-between -mt-2.5">
              {displayCities.map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 ${i <= currentCityIndex
                      ? 'bg-brand-red border-brand-offwhite scale-110 shadow'
                      : 'bg-brand-darker border-brand-gold/20'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Current Station', value: currentCity, icon: '📍', color: 'border-brand-red/10' },
              { label: 'Next Stop Point', value: nextCity, icon: '🏁', color: 'border-brand-gold/15' },
              { label: 'ETA Till Arrival', value: trackResult?.eta || `${Math.max(2, Math.round((100 - position) * 0.8))} mins`, icon: '⏱️', color: 'border-brand-red/10' }
            ].map(({ label, value, icon, color }) => (
              <div key={label} className={`bg-brand-offwhite/[0.01] border ${color} rounded-xl p-5 text-center`}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-brand-offwhite/30 mb-1">{label}</div>
                <div className="font-display font-semibold text-brand-offwhite text-base">{value}</div>
              </div>
            ))}
          </div>

          {/* Search bar ID */}
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="Enter Booking ID (e.g. YMB1001)"
                className="w-full bg-brand-offwhite/[0.02] border border-brand-gold/15 text-brand-offwhite placeholder-brand-offwhite/20 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-offwhite/20" size={14} />
            </div>
            <GlowingButton type="submit" className="whitespace-nowrap">
              {tracking ? 'Tracking...' : 'Track Bus'} <ChevronRight size={14} />
            </GlowingButton>
          </form>
          {trackError && <p className="text-center text-xs text-red-300 mt-3">{trackError}</p>}
          {trackResult && (
            <p className="text-center text-xs text-brand-gold mt-3">
              Tracking {trackResult.busId} on {trackResult.route}
              {trackResult.passenger ? ` · ${trackResult.passenger}` : ''}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
