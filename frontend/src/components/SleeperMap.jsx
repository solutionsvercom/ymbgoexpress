import React from 'react';

const ROWS = 7;

export default function SleeperMap({ selectedSeats, onSeatToggle, bookedSeats = [] }) {
  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  return (
    <div className="bg-brand-card border border-white/[0.06] rounded-2xl p-6">
      <div className="flex gap-4 justify-center mb-6 text-xs flex-wrap">
        {[
          { color: 'bg-white/[0.04] border border-white/[0.08] text-white/50', label: 'Available' },
          { color: 'bg-crimson-600 text-white border border-crimson-500 shadow-lg shadow-crimson-600/20', label: 'Selected' },
          { color: 'bg-red-950/40 text-red-500/50 border border-red-950/80 cursor-not-allowed', label: 'Booked' }
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`}></div>
            <span className="text-white/60 font-medium">{label}</span>
          </div>
        ))}
      </div>
      <div className="max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] text-center text-gold-400 font-bold uppercase tracking-wider mb-3">Left Side</p>
            {Array.from({ length: ROWS }, (_, i) => (
              <div key={i} className="flex gap-1.5 mb-2">
                {['U', 'L'].map(type => {
                  const seat = `L${i + 1}${type}`;
                  const status = getSeatStatus(seat);
                  return (
                    <button 
                      key={seat} 
                      onClick={() => status !== 'booked' && onSeatToggle(seat)}
                      className={`flex-1 py-2.5 rounded text-xs font-semibold transition-all duration-300 ${
                        status === 'booked' 
                          ? 'bg-red-950/40 border border-red-950/80 text-red-500/40 cursor-not-allowed' 
                          : status === 'selected' 
                          ? 'bg-crimson-600 border border-crimson-500 text-white shadow-lg shadow-crimson-600/30' 
                          : 'bg-white/[0.02] border border-white/[0.06] hover:border-crimson-500/30 hover:bg-crimson-600/10 text-white/70'
                      }`}
                    >
                      {type === 'U' ? '↑' : '↓'} {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-center text-gold-400 font-bold uppercase tracking-wider mb-3">Right Side</p>
            {Array.from({ length: ROWS }, (_, i) => (
              <div key={i} className="flex gap-1.5 mb-2">
                {['U', 'L'].map(type => {
                  const seat = `R${i + 1}${type}`;
                  const status = getSeatStatus(seat);
                  return (
                    <button 
                      key={seat} 
                      onClick={() => status !== 'booked' && onSeatToggle(seat)}
                      className={`flex-1 py-2.5 rounded text-xs font-semibold transition-all duration-300 ${
                        status === 'booked' 
                          ? 'bg-red-950/40 border border-red-950/80 text-red-500/40 cursor-not-allowed' 
                          : status === 'selected' 
                          ? 'bg-crimson-600 border border-crimson-500 text-white shadow-lg shadow-crimson-600/30' 
                          : 'bg-white/[0.02] border border-white/[0.06] hover:border-crimson-500/30 hover:bg-crimson-600/10 text-white/70'
                      }`}
                    >
                      {type === 'U' ? '↑' : '↓'} {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
