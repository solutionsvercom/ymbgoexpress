import React from 'react';

const ROWS = 8;

export default function SeaterMap({ selectedSeats, onSeatToggle, bookedSeats = [] }) {
  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <div className="flex gap-4 justify-center mb-4 text-sm">
        {[['bg-gray-200', 'Available'], ['bg-[#0D7377]', 'Selected'], ['bg-red-300', 'Booked']].map(([bg, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${bg}`}></div><span>{label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-4">
        <div className="bg-[#0D5C63] text-white text-xs px-6 py-1.5 rounded-full">Driver</div>
      </div>
      <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
        {Array.from({ length: ROWS }, (_, row) =>
          ['A', 'B', null, 'C', 'D'].map((col, ci) => {
            if (!col) return <div key={`gap-${row}-${ci}`} className="w-8 h-8" />;
            const seat = `${row + 1}${col}`;
            const status = getSeatStatus(seat);
            return (
              <button key={seat} onClick={() => status !== 'booked' && onSeatToggle(seat)}
                className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                  status === 'booked' ? 'bg-red-300 cursor-not-allowed text-white' :
                  status === 'selected' ? 'bg-[#0D7377] text-white scale-110 shadow' :
                  'bg-gray-200 hover:bg-[#0D7377]/30 text-gray-600'
                }`}>
                {seat}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
