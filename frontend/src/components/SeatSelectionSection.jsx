import React, { useState } from 'react';
import SeaterMap from './SeaterMap.jsx';
import SleeperMap from './SleeperMap.jsx';
import axios from 'axios';

const PRICE = { seater: 649, sleeper: 999 };
const BOOKED = { seater: ['1A', '2B', '3C'], sleeper: ['L1U', 'R2L'] };

export default function SeatSelectionSection() {
  const [step, setStep] = useState(1);
  const [busType, setBusType] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSeat = seat => {
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await axios.post('/api/bookings', {
        name, phone, email, busType, seats: selectedSeats,
        totalAmount: selectedSeats.length * PRICE[busType]
      });
      setConfirmed(true);
    } catch (err) {
      alert('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  if (confirmed) return (
    <section className="py-20 bg-[#F7F8FA]">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-[#0D5C63] mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-1">Seats: <strong>{selectedSeats.join(', ')}</strong></p>
        <p className="text-gray-600 mb-4">Amount Paid: <strong>₹{selectedSeats.length * PRICE[busType]}</strong></p>
        <p className="text-sm text-gray-500">Confirmation sent to {email}</p>
        <button onClick={() => { setConfirmed(false); setStep(1); setBusType(null); setSelectedSeats([]); }}
          className="mt-6 bg-[#0D7377] text-white px-6 py-2 rounded-xl">Book Another</button>
      </div>
    </section>
  );

  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">BOOK YOUR SEAT</span>
          <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Select Your Seat
          </h2>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {['Bus Type', 'Seat', 'Payment'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[#0D7377] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-sm text-gray-600 hidden md:block">{label}</span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="flex justify-center max-w-xl mx-auto">
            <button disabled onClick={() => { setBusType('sleeper'); setSelectedSeats([]); setStep(2); }}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl border-2 border-transparent hover:border-[#0D7377] transition-all text-center">
              <div className="text-4xl mb-3">🛌</div>
              <h3 className="font-bold text-[#0D5C63] text-lg mb-1">AC Sleeper</h3>
              <p className="text-gray-500 text-sm mb-3">28 berths, upper & lower</p>
              <span className="text-[#E8762C] font-bold">₹{PRICE.sleeper} / seat</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-[#0D7377] text-sm flex items-center gap-1">
                <i className="fa-solid fa-arrow-left"></i> Back
              </button>
              <span className="text-sm text-gray-500">{selectedSeats.length} seat(s) selected • ₹{selectedSeats.length * PRICE[busType]}</span>
            </div>
            {busType === 'seater' ? (
              <SeaterMap selectedSeats={selectedSeats} onSeatToggle={toggleSeat} bookedSeats={BOOKED.seater} />
            ) : (
              <SleeperMap selectedSeats={selectedSeats} onSeatToggle={toggleSeat} bookedSeats={BOOKED.sleeper} />
            )}
            <button disabled={selectedSeats.length === 0} onClick={() => setStep(3)}
              className="mt-6 w-full bg-[#E8762C] text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-[#d4681f] transition-all">
              Proceed to Payment ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow">
            <button onClick={() => setStep(2)} className="text-[#0D7377] text-sm flex items-center gap-1 mb-4">
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <h3 className="font-bold text-[#0D5C63] mb-4">Passenger Details</h3>
            <div className="space-y-3 mb-6">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]" />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]" />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-1">
              <div className="flex justify-between"><span>Bus Type:</span><span className="font-medium capitalize">{busType}</span></div>
              <div className="flex justify-between"><span>Seats:</span><span className="font-medium">{selectedSeats.join(', ')}</span></div>
              <div className="flex justify-between font-bold text-[#0D5C63]"><span>Total:</span><span>₹{selectedSeats.length * PRICE[busType]}</span></div>
            </div>
            <button disabled={loading || !name || !phone || !email} onClick={handlePayment}
              className="w-full bg-gradient-to-r from-[#0D7377] to-[#0D5C63] text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition-all">
              {loading ? 'Processing...' : `Pay ₹${selectedSeats.length * PRICE[busType]}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
