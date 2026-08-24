import React, { useEffect, useState } from 'react';
import api, { formatStops, parseStops } from '../../lib/api';

const emptyForm = {
  from: '', to: '', duration: '', price: '', seats: '', type: 'AC Sleeper',
  distance: '', departure: '', arrival: '', image: '/images/indore-morena.png',
  stopsText: '', dpText: '', active: true
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/routes/all');
    setRoutes(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (route) => {
    setEditingId(route._id);
    setForm({
      from: route.from,
      to: route.to,
      duration: route.duration,
      price: route.price,
      seats: route.seats,
      type: route.type,
      distance: route.distance,
      departure: route.departure,
      arrival: route.arrival,
      image: route.image || '',
      stopsText: formatStops(route.stops),
      dpText: formatStops(route.dp),
      active: route.active
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      from: form.from,
      to: form.to,
      duration: form.duration,
      price: Number(form.price),
      seats: Number(form.seats),
      type: form.type,
      distance: form.distance,
      departure: form.departure,
      arrival: form.arrival,
      image: form.image,
      stops: parseStops(form.stopsText),
      dp: parseStops(form.dpText),
      active: form.active
    };
    if (editingId) await api.patch(`/routes/${editingId}`, payload);
    else await api.post('/routes', payload);
    setOpen(false);
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this route? It will disappear from the website.')) return;
    await api.delete(`/routes/${id}`);
    await load();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Routes</h1>
          <p className="text-sm text-brand-charcoal/50">Changes here show on the public Routes section.</p>
        </div>
        <button onClick={startCreate} className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl">Add route</button>
      </div>

      <div className="bg-white border border-brand-charcoal/10 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-brand-charcoal/40">Loading routes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-brand-cream text-left text-[11px] uppercase tracking-wider text-brand-charcoal/50">
                <tr>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Timing</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Live</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r._id} className="border-t border-brand-charcoal/5">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{r.from} → {r.to}</div>
                      <div className="text-xs text-brand-charcoal/45">{r.type} · {r.distance}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">{r.departure} – {r.arrival}<div className="text-brand-charcoal/40">{r.duration}</div></td>
                    <td className="px-4 py-3 font-bold">₹{r.price}</td>
                    <td className="px-4 py-3">{r.seats}</td>
                    <td className="px-4 py-3">{r.active ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => startEdit(r)} className="text-xs font-bold text-brand-red">Edit</button>
                      <button onClick={() => remove(r._id)} className="text-xs font-bold text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-3"
          >
            <h2 className="font-display font-bold text-lg">{editingId ? 'Edit route' : 'New route'}</h2>
            <div className="grid grid-cols-2 gap-3">
              {[['from', 'From'], ['to', 'To'], ['duration', 'Duration'], ['distance', 'Distance'], ['departure', 'Departure'], ['arrival', 'Arrival']].map(([key, label]) => (
                <label key={key} className="text-xs font-bold">
                  {label}
                  <input required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
                </label>
              ))}
              <label className="text-xs font-bold">Price
                <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold">Seats left
                <input required type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold col-span-2">Type
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                  <option>AC Sleeper</option>
                  <option>AC Seater</option>
                </select>
              </label>
              <label className="text-xs font-bold col-span-2">Image path
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold col-span-2">Boarding stops (one per line: city | time)
                <textarea rows={4} value={form.stopsText} onChange={(e) => setForm({ ...form, stopsText: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold col-span-2">Dropping points (one per line: city | time)
                <textarea rows={3} value={form.dpText} onChange={(e) => setForm({ ...form, dpText: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold flex items-center gap-2 col-span-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Show on website
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm">Cancel</button>
              <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-bold">Save route</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
