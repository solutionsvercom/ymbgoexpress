import React from 'react';

const ROWS = 8;

export default function SeaterMap({ selectedSeats, onSeatToggle, bookedSeats = [] }) {
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
      <div className="flex justify-center mb-6">
        <div className="bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs px-6 py-1.5 rounded-full uppercase tracking-wider font-bold">
          Driver Cockpit
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2.5 max-w-xs mx-auto">
        {Array.from({ length: ROWS }, (_, row) =>
          ['A', 'B', null, 'C', 'D'].map((col, ci) => {
            if (!col) return <div key={`gap-${row}-${ci}`} className="w-8 h-8" />;
            const seat = `${row + 1}${col}`;
            const status = getSeatStatus(seat);
            return (
              <button 
                key={seat} 
                onClick={() => status !== 'booked' && onSeatToggle(seat)}
                className={`w-8 h-8 rounded text-xs font-semibold transition-all duration-300 ${
                  status === 'booked' 
                    ? 'bg-red-950/40 border border-red-950/80 text-red-500/40 cursor-not-allowed' 
                    : status === 'selected' 
                    ? 'bg-crimson-600 border border-crimson-500 text-white scale-110 shadow-lg shadow-crimson-600/30' 
                    : 'bg-white/[0.02] border border-white/[0.06] hover:border-crimson-500/30 hover:bg-crimson-600/10 text-white/70'
                }`}
              >
                {seat}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
