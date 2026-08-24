import React, { useState, useEffect } from 'react';
import SeaterMap from './SeaterMap.jsx';
import SleeperMap from './SleeperMap.jsx';
import axios from 'axios';
import { ArrowLeft, CreditCard, Armchair, Bed, Sparkles, CheckCircle2 } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';
import GlowingButton from './ui/GlowingButton.jsx';

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
  const [bookingId, setBookingId] = useState('');
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const toggleSeat = seat => {
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  };

  useEffect(() => {
    if (!busType) return;
    axios.get('/api/bookings/occupied', { params: { busType } })
      .then(({ data }) => setOccupiedSeats(data.data || []))
      .catch(() => setOccupiedSeats([]));
  }, [busType]);

  const bookedSeats = [...new Set([...(BOOKED[busType] || []), ...occupiedSeats])];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/bookings', {
        name, phone, email, busType, seats: selectedSeats,
        totalAmount: selectedSeats.length * PRICE[busType]
      });
      setBookingId(data.data?.bookingId || '');
      setConfirmed(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed. Please try again.');
    }
    setLoading(false);
  };

  if (confirmed) return (
    <section className="section-padding bg-brand-cream flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-brand-charcoal border border-brand-gold/15 rounded-2xl p-8 text-center text-brand-offwhite relative shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-800/20 flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="text-emerald-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold font-display text-brand-offwhite mt-4 mb-2">Booking Confirmed!</h2>
        <p className="text-brand-offwhite/60 mb-6 text-sm">Your premium travel seat has been successfully reserved.</p>
        
        <div className="bg-brand-offwhite/[0.02] border border-brand-gold/10 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-brand-offwhite/40">Bus Type:</span><span className="font-medium capitalize text-brand-offwhite">{busType}</span></div>
          <div className="flex justify-between"><span className="text-brand-offwhite/40">Seats:</span><span className="font-semibold text-brand-gold">{selectedSeats.join(', ')}</span></div>
          <div className="flex justify-between border-t border-brand-gold/10 pt-2 font-bold"><span className="text-brand-offwhite/40 font-normal">Amount Paid:</span><span className="text-brand-offwhite">₹{selectedSeats.length * PRICE[busType]}</span></div>
        </div>

        {bookingId && (
          <p className="text-xs text-brand-gold mb-2 font-semibold">Booking ID: {bookingId}</p>
        )}
        <p className="text-xs text-brand-offwhite/40 mb-6">A confirmation receipt has been sent to {email}. Use the booking ID in Live Tracking.</p>
        
        <GlowingButton 
          onClick={() => { setConfirmed(false); setStep(1); setBusType(null); setSelectedSeats([]); }}
          className="w-full"
        >
          Book Another Journey
        </GlowingButton>
      </div>
    </section>
  );

  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 flex items-center justify-center gap-1.5 font-bold">
              <Sparkles size={12} className="text-brand-gold" /> SECURE BOOKING SYSTEM
            </p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Select Your <span className="text-gradient-red">Seat & Berth</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              Book seats dynamically in a few easy steps. Safe and instant checkout for Joon Holidays routes.
            </p>
          </div>
        </TextReveal>

        {/* Steps Tracker */}
        <div className="flex justify-center items-center gap-4 mb-10 max-w-lg mx-auto">
          {['Bus Service', 'Select Seats', 'Passenger Info'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border ${
                  step > i + 1 
                    ? 'bg-emerald-800/10 text-emerald-800 border-emerald-800/20' 
                    : step === i + 1 
                    ? 'bg-brand-red border-brand-red text-brand-offwhite shadow-lg shadow-brand-red/20' 
                    : 'bg-[#FBF9F6] border-brand-gold/20 text-brand-charcoal/40'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-bold ${step === i + 1 ? 'text-brand-charcoal' : 'text-brand-charcoal/40'}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className="h-[1px] flex-1 bg-brand-gold/10" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Select Bus Type */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-4">
            <button 
              onClick={() => { setBusType('seater'); setSelectedSeats([]); setStep(2); }}
              className="bg-[#FBF9F6] hover:bg-brand-cream/50 border border-brand-gold/20 hover:border-brand-red/40 rounded-2xl p-8 text-center text-brand-charcoal transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-cream border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover:bg-brand-red group-hover:text-brand-offwhite group-hover:border-brand-red transition-all duration-300 mx-auto mb-5">
                <Armchair size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-brand-charcoal mb-2">AC Seater</h3>
              <p className="text-xs text-brand-charcoal/60 mb-5 leading-relaxed">Comfortable ergonomic pushback seats</p>
              <span className="text-brand-red font-bold text-lg font-display">₹{PRICE.seater} <span className="text-[10px] text-brand-charcoal/40 font-normal">/ seat</span></span>
            </button>

            <button 
              onClick={() => { setBusType('sleeper'); setSelectedSeats([]); setStep(2); }}
              className="bg-[#FBF9F6] hover:bg-brand-cream/50 border border-brand-gold/20 hover:border-brand-red/40 rounded-2xl p-8 text-center text-brand-charcoal transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-cream border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover:bg-brand-red group-hover:text-brand-offwhite group-hover:border-brand-red transition-all duration-300 mx-auto mb-5">
                <Bed size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-brand-charcoal mb-2">AC Sleeper</h3>
              <p className="text-xs text-brand-charcoal/60 mb-5 leading-relaxed">Spacious lower & upper premium berths</p>
              <span className="text-brand-red font-bold text-lg font-display">₹{PRICE.sleeper} <span className="text-[10px] text-brand-charcoal/40 font-normal">/ seat</span></span>
            </button>
          </div>
        )}

        {/* Step 2: Map Selection */}
        {step === 2 && (
          <div className="max-w-xl mx-auto">
            <div className="mb-6 flex justify-between items-center bg-[#FBF9F6] border border-brand-gold/20 p-4 rounded-xl shadow-sm">
              <button 
                onClick={() => setStep(1)} 
                className="text-brand-charcoal/60 hover:text-brand-charcoal text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <span className="text-xs text-brand-charcoal/60">
                Selected: <strong className="text-brand-red">{selectedSeats.length}</strong> seat(s) • Total: <strong className="text-brand-charcoal">₹{selectedSeats.length * PRICE[busType]}</strong>
              </span>
            </div>

            {busType === 'seater' ? (
              <SeaterMap selectedSeats={selectedSeats} onSeatToggle={toggleSeat} bookedSeats={bookedSeats} />
            ) : (
              <SleeperMap selectedSeats={selectedSeats} onSeatToggle={toggleSeat} bookedSeats={bookedSeats} />
            )}

            <GlowingButton 
              disabled={selectedSeats.length === 0} 
              onClick={() => setStep(3)}
              className="mt-6 w-full"
            >
              Confirm Seats ({selectedSeats.length})
            </GlowingButton>
          </div>
        )}

        {/* Step 3: Checkout Form */}
        {step === 3 && (
          <div className="max-w-md mx-auto bg-brand-charcoal border border-brand-gold/15 rounded-2xl p-6 text-brand-offwhite relative shadow-2xl">
            <button 
              onClick={() => setStep(2)} 
              className="text-brand-offwhite/60 hover:text-brand-offwhite text-xs font-semibold flex items-center gap-1.5 transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Back to map
            </button>
            
            <h3 className="font-display font-semibold text-lg text-brand-offwhite mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-brand-red" /> Passenger Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-brand-offwhite/40 uppercase tracking-wider block mb-1.5">Passenger Full Name</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Ramesh Sharma" 
                  required
                  className="w-full bg-brand-offwhite/[0.02] border border-brand-gold/10 rounded-xl px-4 py-3 text-sm text-brand-offwhite placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-red transition-colors" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-brand-offwhite/40 uppercase tracking-wider block mb-1.5">Mobile Phone Number</label>
                <input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="e.g. +91 97552 54050" 
                  required
                  className="w-full bg-brand-offwhite/[0.02] border border-brand-gold/10 rounded-xl px-4 py-3 text-sm text-brand-offwhite placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-red transition-colors" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-brand-offwhite/40 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="e.g. name@example.com" 
                  required
                  className="w-full bg-brand-offwhite/[0.02] border border-brand-gold/10 rounded-xl px-4 py-3 text-sm text-brand-offwhite placeholder-brand-offwhite/20 focus:outline-none focus:border-brand-red transition-colors" 
                />
              </div>
            </div>

            {/* Travel Summary */}
            <div className="bg-brand-offwhite/[0.02] border border-brand-gold/10 rounded-xl p-4 mb-6 text-xs space-y-2">
              <div className="flex justify-between"><span className="text-brand-offwhite/40">Bus Service:</span><span className="font-semibold text-brand-offwhite capitalize">{busType}</span></div>
              <div className="flex justify-between"><span className="text-brand-offwhite/40">Selected Seats:</span><span className="font-semibold text-brand-gold">{selectedSeats.join(', ')}</span></div>
              <div className="flex justify-between border-t border-brand-gold/10 pt-2 font-bold text-sm"><span className="text-brand-offwhite/40 font-normal">Total Price:</span><span className="text-brand-offwhite font-display font-bold">₹{selectedSeats.length * PRICE[busType]}</span></div>
            </div>

            <GlowingButton 
              disabled={loading || !name || !phone || !email} 
              onClick={handlePayment}
              className="w-full"
            >
              {loading ? 'Processing Checkout...' : `Proceed Payment • ₹${selectedSeats.length * PRICE[busType]}`}
            </GlowingButton>
          </div>
        )}
      </div>
    </section>
  );
}
