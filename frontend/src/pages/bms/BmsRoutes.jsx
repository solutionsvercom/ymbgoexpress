import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function BmsRoutes() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  const load = async () => {
    const [{ data: r }, { data: b }] = await Promise.all([api.get('/routes/all'), api.get('/bms/buses')]);
    setRoutes(r.data || []);
    setBuses(b.data || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const assignedTo = (routeId) => buses.filter((bus) => (bus.routeId?._id || bus.routeId) === routeId);

  const assign = async (busId, routeId) => {
    await api.patch(`/bms/buses/${busId}`, { routeId: routeId || null });
    await load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Routes</h1>
      <p className="text-sm text-brand-charcoal/50 mb-6">Map each registered bus onto a service, like (1) Bus ↔ (1) Route.</p>

      <div className="space-y-4">
        {routes.map((route) => {
          const onRoute = assignedTo(route._id);
          return (
            <div key={route._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-display font-bold">{route.from} → {route.to}</div>
                  <div className="text-xs text-brand-charcoal/45">{route.type} · {route.departure} · ₹{route.price}</div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-brand-red/10 text-brand-red">
                  {onRoute.length} bus{onRoute.length === 1 ? '' : 'es'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {onRoute.map((bus, i) => (
                  <span key={bus._id} className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-cream border border-brand-charcoal/10">
                    ({i + 1}) {bus.code}
                  </span>
                ))}
                {onRoute.length === 0 && <span className="text-xs text-brand-charcoal/40">No bus mapped yet</span>}
              </div>
              <select
                defaultValue=""
                onChange={(e) => { if (e.target.value) assign(e.target.value, route._id); e.target.value = ''; }}
                className="border rounded-xl px-3 py-2 text-xs"
              >
                <option value="">Assign a bus…</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>{bus.code} {bus.name ? `· ${bus.name}` : ''}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
