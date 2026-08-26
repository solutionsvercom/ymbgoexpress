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

function emptyPicks(buses, routes, duties) {
  const next = {};
  buses.forEach((bus) => {
    next[bus._id] = {};
    routes.forEach((route) => {
      const assigned = duties.some(
        (duty) => String(duty.fleetBusId) === String(bus._id) && String(duty.routeId) === String(route._id)
      );
      next[bus._id][route._id] = duties.length ? assigned : true;
    });
  });
  return next;
}

export default function BmsRoutes() {
  const [date, setDate] = useState(todayISO());
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [duties, setDuties] = useState([]);
  const [picks, setPicks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async (selectedDate = date) => {
    setError('');
    const { data } = await api.get('/bms/route-duties', { params: { date: selectedDate } });
    const nextDuties = data.data?.duties || [];
    const nextBuses = data.data?.buses || [];
    const nextRoutes = data.data?.routes || [];
    setDuties(nextDuties);
    setBuses(nextBuses);
    setRoutes(nextRoutes);
    setPicks(emptyPicks(nextBuses, nextRoutes, nextDuties));
  };

  useEffect(() => {
    load(date).catch(() => setError('Could not load routes.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const toggleRoute = (busId, routeId) => {
    setPicks((prev) => ({
      ...prev,
      [busId]: {
        ...(prev[busId] || {}),
        [routeId]: !prev[busId]?.[routeId]
      }
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.put('/bms/route-duties', {
        date,
        assignments: buses.map((bus) => ({
          fleetBusId: bus._id,
          routeIds: routes.filter((route) => picks[bus._id]?.[route._id]).map((route) => route._id)
        }))
      });
      await load(date);
      setMessage(`Saved both buses from ${displayDate(date)}. Daily account on this date and later uses these routes. Earlier dates stay unchanged.`);
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
            First card is bus 7311, second is 7312. Each bus can run both Gwalior ↔ Indore directions.
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
        {buses.map((bus) => {
          const lastFrom = duties.find((duty) => String(duty.fleetBusId) === String(bus._id))?.effectiveFrom;
          return (
            <div key={bus._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="font-display font-bold text-lg">Bus {bus.code}</div>
                  <div className="text-xs text-brand-charcoal/45 mt-0.5">
                    Gwalior ↔ Indore
                    {lastFrom && lastFrom !== date && (
                      <span> · last set {displayDate(lastFrom)}</span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-mono font-bold px-3 py-1.5 rounded-full bg-brand-red/10 text-brand-red">
                  {bus.code}
                </span>
              </div>
              <div className="text-xs font-bold mb-2">Routes for this bus</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {routes.map((route) => {
                  const checked = Boolean(picks[bus._id]?.[route._id]);
                  return (
                    <label
                      key={route._id}
                      className={`flex items-start gap-3 border rounded-xl px-3 py-3 cursor-pointer ${
                        checked ? 'border-brand-red/40 bg-brand-red/5' : 'border-brand-charcoal/15 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRoute(bus._id, route._id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm font-bold">{route.from} → {route.to}</span>
                        <span className="block text-xs text-brand-charcoal/45 mt-0.5">
                          {route.type} · {route.departure} · ₹{route.price}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save bus routes'}
        </button>
        <Link to="/bmsadmin" className="text-sm font-bold text-brand-red">
          Open Daily account →
        </Link>
      </div>
    </div>
  );
}
