import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

const empty = { name: '', city: '', code: '', type: 'branch', commissionPercent: 0, address: '', phone: '', active: true };

export default function BmsOffices() {
  const [offices, setOffices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await api.get('/bms/offices');
    setOffices(data.data || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, commissionPercent: Number(form.commissionPercent) };
    if (editingId) await api.patch(`/bms/offices/${editingId}`, payload);
    else await api.post('/bms/offices', payload);
    setOpen(false);
    await load();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Branches</h1>
          <p className="text-sm text-brand-charcoal/50">Gwalior, Main Indore and Ujjain offices.</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(empty); setOpen(true); }} className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl">Add office</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offices.map((office) => (
          <div key={office._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
            <div className="flex justify-between gap-2">
              <div className="font-display font-bold">{office.name}</div>
              {office.commissionPercent > 0 && <span className="text-brand-red font-extrabold text-sm">{office.commissionPercent}%</span>}
            </div>
            <p className="text-xs text-brand-charcoal/50 mt-1 uppercase tracking-wider">{office.type} · {office.code} · {office.city}</p>
            <p className="text-xs mt-3">{office.address || '—'}</p>
            <button
              onClick={() => {
                setEditingId(office._id);
                setForm({
                  name: office.name, city: office.city, code: office.code, type: office.type,
                  commissionPercent: office.commissionPercent, address: office.address || '',
                  phone: office.phone || '', active: office.active
                });
                setOpen(true);
              }}
              className="text-xs font-bold text-brand-red mt-4"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3">
            <h2 className="font-display font-bold text-lg">{editingId ? 'Edit office' : 'Add office'}</h2>
            {[['name', 'Name'], ['city', 'City'], ['code', 'Code'], ['address', 'Address'], ['phone', 'Phone']].map(([key, label]) => (
              <label key={key} className="text-xs font-bold block">
                {label}
                <input required={['name', 'city', 'code'].includes(key)} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold">Type
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                  <option value="main">main</option>
                  <option value="branch">branch</option>
                </select>
              </label>
              <label className="text-xs font-bold">Commission %
                <input type="number" value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            </div>
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
