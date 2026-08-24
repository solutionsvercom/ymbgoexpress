import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

const emptyForm = {
  busId: '', route: '', currentCity: '', nextCity: '', eta: '',
  lat: '', lng: '', progress: 0, citiesText: '', active: true
};

export default function TrackingPage() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await api.get('/tracking/all');
    setBuses(data.data || []);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (bus) => {
    setEditingId(bus._id);
    setForm({
      busId: bus.busId,
      route: bus.route,
      currentCity: bus.currentCity,
      nextCity: bus.nextCity,
      eta: bus.eta || '',
      lat: bus.lat ?? '',
      lng: bus.lng ?? '',
      progress: bus.progress ?? 0,
      citiesText: (bus.cities || []).join(', '),
      active: bus.active
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      busId: form.busId,
      route: form.route,
      currentCity: form.currentCity,
      nextCity: form.nextCity,
      eta: form.eta,
      lat: Number(form.lat) || 0,
      lng: Number(form.lng) || 0,
      progress: Number(form.progress) || 0,
      cities: form.citiesText.split(',').map((c) => c.trim()).filter(Boolean),
      active: form.active
    };
    if (editingId) await api.patch(`/tracking/${editingId}`, payload);
    else await api.post('/tracking', payload);
    setOpen(false);
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Remove this bus from tracking?')) return;
    await api.delete(`/tracking/${id}`);
    await load();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Fleet tracking</h1>
          <p className="text-sm text-brand-charcoal/50">Update live location. Passengers can track with booking ID or bus ID.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(emptyForm); setOpen(true); }}
          className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl"
        >
          Add bus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {buses.map((bus) => (
          <div key={bus._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
            <div className="flex justify-between mb-2">
              <span className="font-mono font-bold">{bus.busId}</span>
              <span className="text-[10px] font-bold uppercase text-brand-red">{bus.active ? 'Active' : 'Off'}</span>
            </div>
            <p className="font-display font-bold mb-3">{bus.route}</p>
            <div className="h-2 bg-brand-cream rounded-full mb-3">
              <div className="h-full bg-brand-red rounded-full" style={{ width: `${bus.progress}%` }} />
            </div>
            <p className="text-xs text-brand-charcoal/60">Now: {bus.currentCity} → Next: {bus.nextCity}</p>
            <p className="text-xs text-brand-charcoal/45 mb-4">ETA {bus.eta || '—'} · {bus.progress}%</p>
            <div className="flex gap-3">
              <button onClick={() => startEdit(bus)} className="text-xs font-bold text-brand-red">Update position</button>
              <button onClick={() => remove(bus._id)} className="text-xs font-bold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3">
            <h2 className="font-display font-bold text-lg">{editingId ? 'Update bus' : 'Add bus'}</h2>
            {[['busId', 'Bus ID'], ['route', 'Route label'], ['currentCity', 'Current city'], ['nextCity', 'Next city'], ['eta', 'ETA']].map(([key, label]) => (
              <label key={key} className="text-xs font-bold block">
                {label}
                <input required={key !== 'eta'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            ))}
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs font-bold">Lat
                <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold">Lng
                <input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold">Progress %
                <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            </div>
            <label className="text-xs font-bold block">Cities along route (comma separated)
              <input value={form.citiesText} onChange={(e) => setForm({ ...form, citiesText: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
            </label>
            <label className="text-xs font-bold flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm">Cancel</button>
              <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-bold">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
