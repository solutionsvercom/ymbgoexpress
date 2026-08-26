import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import api from '../../lib/api';

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function displayDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function BmsRoutes() {
  const [date, setDate] = useState(todayISO());
  const [duties, setDuties] = useState([]);
  const [buses, setBuses] = useState([]);
  const [picks, setPicks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async (selectedDate = date) => {
    setError('');
    const { data } = await api.get('/bms/route-duties', { params: { date: selectedDate } });
    const nextDuties = data.data?.duties || [];
    const nextBuses = data.data?.buses || [];
    setDuties(nextDuties);
    setBuses(nextBuses);
    const nextPicks = {};
    nextDuties.forEach((duty) => {
      nextPicks[duty.routeId] = duty.fleetBusId ? String(duty.fleetBusId) : '';
    });
    setPicks(nextPicks);
  };

  useEffect(() => {
    load(date).catch(() => setError('Could not load routes.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.put('/bms/route-duties', {
        date,
        assignments: duties.map((duty) => ({
          routeId: duty.routeId,
          fleetBusId: picks[duty.routeId] || null
        }))
      });
      await load(date);
      setMessage(`Saved bus numbers from ${displayDate(date)}. Daily account on this date and later uses these buses. Earlier dates stay unchanged.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save bus routes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Routes</h1>
          <p className="text-sm text-brand-charcoal/50">
            Choose the bus number for Indore → Gwalior and Gwalior → Indore. Then open Daily account and pick the date.
          </p>
        </div>
        <label className="text-xs font-bold">
          Apply from date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block border border-brand-charcoal/15 rounded-xl px-3 py-2 font-normal bg-white"
          />
        </label>
      </div>

      {message && <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">{message}</p>}
      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

      <div className="space-y-4">
        {duties.map((duty) => (
          <div key={duty.routeId} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="font-display font-bold text-lg">{duty.from} → {duty.to}</div>
                <div className="text-xs text-brand-charcoal/45 mt-0.5">
                  {duty.type} · {duty.departure} · ₹{duty.price}
                  {duty.effectiveFrom && duty.effectiveFrom !== date && (
                    <span> · last set {displayDate(duty.effectiveFrom)}</span>
                  )}
                </div>
              </div>
              {duty.busCode && (
                <span className="text-sm font-mono font-bold px-3 py-1.5 rounded-full bg-brand-red/10 text-brand-red">
                  Bus {duty.busCode}
                </span>
              )}
            </div>
            <label className="text-xs font-bold block">
              Bus number
              <select
                value={picks[duty.routeId] || ''}
                onChange={(e) => setPicks((prev) => ({ ...prev, [duty.routeId]: e.target.value }))}
                className="mt-1 w-full max-w-sm border rounded-xl px-3 py-2 font-normal text-sm"
              >
                <option value="">Select bus number</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    {bus.code}{bus.name ? ` · ${bus.name}` : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save bus numbers'}
        </button>
        <Link to="/bmsadmin" className="text-sm font-bold text-brand-red">
          Open Daily account →
        </Link>
      </div>
    </div>
  );
}
