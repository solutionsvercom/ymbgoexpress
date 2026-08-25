import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

const empty = { officeId: '', name: '', code: '', phone: '', commissionPercent: 0, active: true };

function officeKey(value) {
  if (!value) return '';
  if (typeof value === 'object') return String(value._id || '');
  return String(value);
}

function nextCode(officeId, agents) {
  const used = new Set(
    agents
      .filter((agent) => officeKey(agent.officeId) === officeKey(officeId))
      .map((agent) => String(agent.code || '').trim().toLowerCase())
      .filter(Boolean)
  );
  if (!used.has('agent')) return 'Agent';
  for (let i = 2; i < 300; i += 1) {
    const code = `A${i}`;
    if (!used.has(code.toLowerCase())) return code;
  }
  return `A${Date.now().toString().slice(-4)}`;
}

export default function BmsAgents() {
  const [agents, setAgents] = useState([]);
  const [offices, setOffices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    const [a, o] = await Promise.all([api.get('/bms/agents'), api.get('/bms/offices')]);
    const nextAgents = a.data.data || [];
    const nextOffices = o.data.data || [];
    setAgents(nextAgents);
    setOffices(nextOffices);
    return { agents: nextAgents, offices: nextOffices };
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const openAdd = () => {
    setEditingId(null);
    setError('');
    setNotice('');
    setSaving(false);
    const officeId = offices[0] ? officeKey(offices[0]._id) : '';
    setForm({ ...empty, officeId, code: nextCode(officeId, agents) });
    setOpen(true);
  };

  const openEdit = (agent) => {
    setEditingId(String(agent._id));
    setError('');
    setNotice('');
    setSaving(false);
    setForm({
      officeId: officeKey(agent.officeId),
      name: agent.name || '',
      code: agent.code || '',
      phone: agent.phone || '',
      commissionPercent: agent.commissionPercent ?? 0,
      active: agent.active !== false
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setError('');
    setNotice('');
    setSaving(true);
    const payload = {
      officeId: officeKey(form.officeId),
      name: String(form.name || '').trim(),
      code: String(form.code || '').trim(),
      phone: String(form.phone || '').trim(),
      commissionPercent: Number(form.commissionPercent) || 0,
      active: form.active !== false
    };
    if (!payload.officeId || !payload.name) {
      setSaving(false);
      setError('Office and name are required.');
      return;
    }
    try {
      if (editingId) {
        await api.patch(`/bms/agents/${editingId}`, payload);
        setOpen(false);
        setEditingId(null);
        setForm(empty);
        await load();
      } else {
        await api.post('/bms/agents', payload);
        const { agents: latest } = await load();
        setForm({
          ...empty,
          officeId: payload.officeId,
          code: nextCode(payload.officeId, latest),
          commissionPercent: payload.commissionPercent
        });
        setNotice('Saved. Enter the next agent and press Save again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save agent details.');
    } finally {
      setSaving(false);
    }
  };

  const grouped = offices.map((office) => ({
    office,
    agents: agents.filter((a) => officeKey(a.officeId) === officeKey(office._id))
  }));

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Agents</h1>
          <p className="text-sm text-brand-charcoal/50">Staff under Gwalior, Indore and Ujjain offices.</p>
        </div>
        <button type="button" onClick={openAdd} className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl">
          Add agent
        </button>
      </div>

      <div className="space-y-6">
        {grouped.map(({ office, agents: list }) => (
          <div key={office._id}>
            <h2 className="font-display font-bold mb-3">{office.name} {office.commissionPercent > 0 ? `· ${office.commissionPercent}%` : ''}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {list.map((agent) => (
                <button
                  type="button"
                  key={agent._id}
                  onClick={() => openEdit(agent)}
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
        <div
          className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4 flex items-start justify-center sm:items-center"
          onClick={() => { if (!saving) setOpen(false); }}
        >
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg my-6 p-6 space-y-3 shadow-xl"
          >
            <h2 className="font-display font-bold text-lg">{editingId ? 'Edit agent' : 'Add agent'}</h2>
            <label className="text-xs font-bold block">Office
              <select
                required
                value={form.officeId}
                onChange={(e) => {
                  const officeId = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    officeId,
                    code: editingId ? prev.code : nextCode(officeId, agents)
                  }));
                }}
                className="mt-1 w-full border rounded-xl px-3 py-2 font-normal"
              >
                <option value="">Select office</option>
                {offices.map((o) => <option key={o._id} value={String(o._id)}>{o.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold block">
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full border rounded-xl px-3 py-2 font-normal"
              />
            </label>
            <label className="text-xs font-bold block">
              Code (Agent / A2 / A3)
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="mt-1 w-full border rounded-xl px-3 py-2 font-normal"
              />
            </label>
            <label className="text-xs font-bold block">
              Phone
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full border rounded-xl px-3 py-2 font-normal"
              />
            </label>
            <label className="text-xs font-bold block">Commission %
              <input
                type="number"
                min="0"
                max="100"
                value={form.commissionPercent}
                onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })}
                className="mt-1 w-full border rounded-xl px-3 py-2 font-normal"
              />
            </label>
            {notice && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{notice}</p>
            )}
            {error && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm" disabled={saving}>Close</button>
              <button type="submit" disabled={saving} className="bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Save' : 'Save & add next'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
