import React, { useEffect, useState } from 'react';
import api, { formatDate } from '../../lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/bookings/${id}`, { status });
    await load();
  };

  const rows = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-brand-charcoal/50">Seat reservations from the public booking form.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                filter === s ? 'bg-brand-red text-white' : 'bg-white border border-brand-charcoal/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-brand-charcoal/10 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-brand-charcoal/40">Loading bookings...</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-brand-charcoal/40">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead className="bg-brand-cream text-left text-[11px] uppercase tracking-wider text-brand-charcoal/50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Passenger</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Bus</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b._id} className="border-t border-brand-charcoal/5">
                    <td className="px-4 py-3 font-mono text-xs font-bold">{b.bookingId}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-xs text-brand-charcoal/45">{b.phone} · {b.email}</div>
                      <div className="text-[10px] text-brand-charcoal/35">{formatDate(b.createdAt)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="capitalize">{b.busType}</div>
                      <div className="text-xs text-brand-gold font-semibold">{b.seats.join(', ')}</div>
                    </td>
                    <td className="px-4 py-3 font-bold">₹{b.totalAmount}</td>
                    <td className="px-4 py-3 text-xs">{b.busId || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {['confirmed', 'completed', 'cancelled'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(b._id, s)}
                            className="text-[10px] font-bold uppercase border border-brand-charcoal/15 rounded-full px-2 py-0.5 hover:border-brand-red hover:text-brand-red"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
