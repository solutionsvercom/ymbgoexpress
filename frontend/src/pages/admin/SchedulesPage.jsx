import React, { useEffect, useState } from 'react';
import api, { formatStops, parseStops } from '../../lib/api';

const emptyForm = {
  title: '', subtitle: '', type: 'AC Sleeper', duration: '', distance: '', stopsText: '', active: true
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/schedules/all');
    setSchedules(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      subtitle: item.subtitle || '',
      type: item.type,
      duration: item.duration,
      distance: item.distance,
      stopsText: formatStops(item.stops),
      active: item.active
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      type: form.type,
      duration: form.duration,
      distance: form.distance,
      stops: parseStops(form.stopsText),
      active: form.active
    };
    if (editingId) await api.patch(`/schedules/${editingId}`, payload);
    else await api.post('/schedules', payload);
    setOpen(false);
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    await api.delete(`/schedules/${id}`);
    await load();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Schedules</h1>
          <p className="text-sm text-brand-charcoal/50">Timetable cards shown on the public website.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(emptyForm); setOpen(true); }}
          className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl"
        >
          Add schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-brand-charcoal/40">Loading schedules...</p>}
        {schedules.map((s) => (
          <div key={s._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
            <div className="flex justify-between gap-2 mb-2">
              <h3 className="font-display font-bold">{s.title}</h3>
              <span className="text-[10px] font-bold uppercase text-brand-red">{s.active ? 'Live' : 'Hidden'}</span>
            </div>
            <p className="text-xs text-brand-charcoal/45 mb-3">{s.subtitle} · {s.type}</p>
            <ul className="text-xs space-y-1 mb-4">
              {(s.stops || []).map((stop, i) => (
                <li key={i} className="flex justify-between"><span>{stop.city}</span><span className="font-mono">{stop.time}</span></li>
              ))}
            </ul>
            <div className="flex gap-3">
              <button onClick={() => startEdit(s)} className="text-xs font-bold text-brand-red">Edit</button>
              <button onClick={() => remove(s._id)} className="text-xs font-bold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3">
            <h2 className="font-display font-bold text-lg">{editingId ? 'Edit schedule' : 'New schedule'}</h2>
            {[['title', 'Title'], ['subtitle', 'Subtitle'], ['duration', 'Duration'], ['distance', 'Distance']].map(([key, label]) => (
              <label key={key} className="text-xs font-bold block">
                {label}
                <input required={key !== 'subtitle'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            ))}
            <label className="text-xs font-bold block">Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option>AC Sleeper</option>
                <option>AC Seater</option>
              </select>
            </label>
            <label className="text-xs font-bold block">Stops (city | time)
              <textarea required rows={5} value={form.stopsText} onChange={(e) => setForm({ ...form, stopsText: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
            </label>
            <label className="text-xs font-bold flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Show on website
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
