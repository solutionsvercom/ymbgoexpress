import React, { useState } from 'react';

const locations = ['Indore', 'Dewas', 'Ujjain', 'Bhopal', 'Gwalior', 'Morena', 'Shivpuri', 'Datia'];

export default function SearchWidget() {
  const [tab, setTab] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const swap = () => { const t = from; setFrom(to); setTo(t); };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4">
        {['one-way', 'round-trip'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-[#0D7377] text-white' : 'bg-gray-100 text-gray-600'}`}>
            {t === 'one-way' ? 'One Way' : 'Round Trip'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="relative">
          <label className="text-xs text-gray-500 font-medium mb-1 block">FROM</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]">
            <option value="">Select City</option>
            {locations.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="relative flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-medium mb-1 block">TO</label>
            <select value={to} onChange={e => setTo(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]">
              <option value="">Select City</option>
              {locations.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mb-0.5 w-9 h-9 rounded-full bg-[#0D7377]/10 flex items-center justify-center text-[#0D7377] hover:bg-[#0D7377]/20">
            <i className="fa-solid fa-arrow-right-arrow-left text-xs"></i>
          </button>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">DATE</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]" />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">PASSENGERS</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setPassengers(p => Math.max(1, p - 1))}
              className="px-3 py-2.5 text-[#0D7377] hover:bg-gray-100">-</button>
            <span className="flex-1 text-center text-sm">{passengers}</span>
            <button onClick={() => setPassengers(p => Math.min(10, p + 1))}
              className="px-3 py-2.5 text-[#0D7377] hover:bg-gray-100">+</button>
          </div>
        </div>
      </div>
      <button className="mt-4 w-full bg-gradient-to-r from-[#0D7377] to-[#0D5C63] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
        <i className="fa-solid fa-magnifying-glass"></i> Search Buses
      </button>
    </div>
  );
}
