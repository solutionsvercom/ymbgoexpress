import React from 'react';

const ROWS = 7;

export default function SleeperMap({ selectedSeats, onSeatToggle, bookedSeats = [] }) {
  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <div className="flex gap-4 justify-center mb-4 text-sm flex-wrap">
        {[['bg-gray-200', 'Available'], ['bg-[#0D7377]', 'Selected'], ['bg-red-300', 'Booked']].map(([bg, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${bg}`}></div><span>{label}</span>
          </div>
        ))}
      </div>
      <div className="max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-center text-gray-500 mb-2 font-medium">Left Side</p>
            {Array.from({ length: ROWS }, (_, i) => (
              <div key={i} className="flex gap-1 mb-2">
                {['U', 'L'].map(type => {
                  const seat = `L${i + 1}${type}`;
                  const status = getSeatStatus(seat);
                  return (
                    <button key={seat} onClick={() => status !== 'booked' && onSeatToggle(seat)}
                      className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                        status === 'booked' ? 'bg-red-300 text-white cursor-not-allowed' :
                        status === 'selected' ? 'bg-[#0D7377] text-white shadow' :
                        'bg-gray-200 hover:bg-[#0D7377]/30'
                      }`}>
                      {type === 'U' ? '↑' : '↓'} {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-center text-gray-500 mb-2 font-medium">Right Side</p>
            {Array.from({ length: ROWS }, (_, i) => (
              <div key={i} className="flex gap-1 mb-2">
                {['U', 'L'].map(type => {
                  const seat = `R${i + 1}${type}`;
                  const status = getSeatStatus(seat);
                  return (
                    <button key={seat} onClick={() => status !== 'booked' && onSeatToggle(seat)}
                      className={`flex-1 py-2 rounded text-xs font-medium transition-all ${
                        status === 'booked' ? 'bg-red-300 text-white cursor-not-allowed' :
                        status === 'selected' ? 'bg-[#0D7377] text-white shadow' :
                        'bg-gray-200 hover:bg-[#0D7377]/30'
                      }`}>
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
