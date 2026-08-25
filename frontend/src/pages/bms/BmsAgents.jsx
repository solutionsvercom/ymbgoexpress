import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

const empty = { officeId: '', name: '', code: '', phone: '', email: '', commissionPercent: 0, active: true };

export default function BmsAgents() {
  const [agents, setAgents] = useState([]);
  const [offices, setOffices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const [a, o] = await Promise.all([api.get('/bms/agents'), api.get('/bms/offices')]);
    setAgents(a.data.data || []);
    setOffices(o.data.data || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, commissionPercent: Number(form.commissionPercent) };
    if (editingId) await api.patch(`/bms/agents/${editingId}`, payload);
    else await api.post('/bms/agents', payload);
    setOpen(false);
    await load();
  };

  const grouped = offices.map((office) => ({
    office,
    agents: agents.filter((a) => (a.officeId?._id || a.officeId) === office._id)
  }));

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Agents</h1>
          <p className="text-sm text-brand-charcoal/50">Staff under Gwalior, Indore and Ujjain offices.</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(empty); setOpen(true); }} className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl">Add agent</button>
      </div>

      <div className="space-y-6">
        {grouped.map(({ office, agents: list }) => (
          <div key={office._id}>
            <h2 className="font-display font-bold mb-3">{office.name} {office.commissionPercent > 0 ? `· ${office.commissionPercent}%` : ''}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {list.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => {
                    setEditingId(agent._id);
                    setForm({
                      officeId: agent.officeId?._id || agent.officeId,
                      name: agent.name,
                      code: agent.code,
                      phone: agent.phone || '',
                      email: agent.email || '',
                      commissionPercent: agent.commissionPercent,
                      active: agent.active
                    });
                    setOpen(true);
                  }}
                  className="bg-white border border-brand-charcoal/10 rounded-2xl p-4 text-left hover:border-brand-red/30"
                >
                  <div className="text-[10px] font-bold uppercase text-brand-red">{agent.code}</div>
                  <div className="font-semibold text-sm mt-1">{agent.name}</div>
                  <div className="text-xs text-brand-charcoal/45 mt-1">{agent.phone || 'No phone'}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3">
            <h2 className="font-display font-bold text-lg">{editingId ? 'Edit agent' : 'Add agent'}</h2>
            <label className="text-xs font-bold block">Office
              <select required value={form.officeId} onChange={(e) => setForm({ ...form, officeId: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option value="">Select office</option>
                {offices.map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
              </select>
            </label>
            {[['name', 'Name'], ['code', 'Code (Agent / A2 / A3)'], ['phone', 'Phone'], ['email', 'Email']].map(([key, label]) => (
              <label key={key} className="text-xs font-bold block">
                {label}
                <input required={['name', 'code'].includes(key)} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            ))}
            <label className="text-xs font-bold block">Commission %
              <input type="number" value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
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
