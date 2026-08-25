import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

const empty = { code: '', name: '', registrationNo: '', type: 'AC Sleeper', totalSeats: 32, status: 'active', routeId: '', notes: '' };

export default function BmsBuses() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const [{ data: b }, { data: r }] = await Promise.all([api.get('/bms/buses'), api.get('/routes/all')]);
    setBuses(b.data || []);
    setRoutes(r.data || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, totalSeats: Number(form.totalSeats), routeId: form.routeId || null };
    if (editingId) await api.patch(`/bms/buses/${editingId}`, payload);
    else await api.post('/bms/buses', payload);
    setOpen(false);
    await load();
  };

  const startEdit = (bus) => {
    setEditingId(bus._id);
    setForm({
      code: bus.code,
      name: bus.name || '',
      registrationNo: bus.registrationNo || '',
      type: bus.type,
      totalSeats: bus.totalSeats,
      status: bus.status,
      routeId: bus.routeId?._id || bus.routeId || '',
      notes: bus.notes || ''
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Add bus</h1>
          <p className="text-sm text-brand-charcoal/50">Register coaches and map each one to a route.</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(empty); setOpen(true); }} className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl">Add bus</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buses.map((bus, i) => (
          <div key={bus._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
            <div className="flex justify-between gap-2 mb-2">
              <span className="font-mono font-bold">({i + 1}) {bus.code}</span>
              <span className="text-[10px] font-bold uppercase text-brand-red">{bus.status}</span>
            </div>
            <p className="font-display font-bold">{bus.name || 'Unnamed coach'}</p>
            <p className="text-xs text-brand-charcoal/50 mt-1">{bus.type} · {bus.totalSeats} seats · {bus.registrationNo || 'No RC'}</p>
            <p className="text-xs mt-2">
              Route: {bus.routeId ? `${bus.routeId.from} → ${bus.routeId.to}` : 'Not assigned'}
            </p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => startEdit(bus)} className="text-xs font-bold text-brand-red">Edit</button>
              <button
                onClick={async () => { if (confirm('Delete this bus?')) { await api.delete(`/bms/buses/${bus._id}`); await load(); } }}
                className="text-xs font-bold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3">
            <h2 className="font-display font-bold text-lg">{editingId ? 'Edit bus' : 'Add bus'}</h2>
            {[['code', 'Bus code'], ['name', 'Display name'], ['registrationNo', 'Registration no.']].map(([key, label]) => (
              <label key={key} className="text-xs font-bold block">
                {label}
                <input required={key === 'code'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold">Type
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                  <option>AC Sleeper</option>
                  <option>AC Seater</option>
                </select>
              </label>
              <label className="text-xs font-bold">Seats
                <input type="number" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            </div>
            <label className="text-xs font-bold block">Assign route
              <select value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option value="">Unassigned</option>
                {routes.map((r) => (
                  <option key={r._id} value={r._id}>{r.from} → {r.to} ({r.type})</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold block">Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option value="active">active</option>
                <option value="maintenance">maintenance</option>
                <option value="inactive">inactive</option>
              </select>
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
