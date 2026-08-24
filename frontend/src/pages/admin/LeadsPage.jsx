import React, { useEffect, useState } from 'react';
import api, { formatDate } from '../../lib/api';

const statuses = ['all', 'unread', 'read', 'contacted', 'closed'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async (status = filter) => {
    setLoading(true);
    try {
      const params = status === 'all' ? {} : { status };
      const { data } = await api.get('/contact', { params });
      setLeads(data.data || []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load('all'); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/contact/${id}`, { status });
    await load(filter);
    if (selected?._id === id) setSelected((prev) => ({ ...prev, status }));
  };

  const saveNotes = async () => {
    if (!selected) return;
    await api.patch(`/contact/${selected._id}`, { notes: selected.notes || '' });
    await load(filter);
  };

  const remove = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete(`/contact/${id}`);
    setSelected(null);
    await load(filter);
  };

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Leads</h1>
          <p className="text-sm text-brand-charcoal/50">Contact form submissions from the website.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); load(s); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                filter === s ? 'bg-brand-red text-white' : 'bg-white border border-brand-charcoal/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white border border-brand-charcoal/10 rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-brand-charcoal/40">Loading leads...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-brand-charcoal/40">No leads in this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-cream text-left text-[11px] uppercase tracking-wider text-brand-charcoal/50">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelected(lead)}
                      className={`border-t border-brand-charcoal/5 cursor-pointer hover:bg-brand-cream/60 ${
                        selected?._id === lead._id ? 'bg-brand-cream' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold">{lead.name}</td>
                      <td className="px-4 py-3">{lead.phone}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-brand-charcoal/50">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-brand-charcoal/10 rounded-2xl p-5">
          {!selected ? (
            <p className="text-sm text-brand-charcoal/40">Select a lead to view the message.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-display font-bold text-lg">{selected.name}</div>
                <a href={`tel:${selected.phone}`} className="text-sm text-brand-red font-semibold">{selected.phone}</a>
              </div>
              <p className="text-sm leading-relaxed bg-brand-cream rounded-xl p-4">{selected.message}</p>
              <div className="flex flex-wrap gap-2">
                {['unread', 'read', 'contacted', 'closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected._id, s)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                      selected.status === s ? 'bg-brand-red text-white' : 'border border-brand-charcoal/15'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/40 block mb-1">Internal notes</label>
                <textarea
                  value={selected.notes || ''}
                  onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-brand-charcoal/15 rounded-xl px-3 py-2 text-sm"
                />
                <button onClick={saveNotes} className="mt-2 text-xs font-bold text-brand-red">Save notes</button>
              </div>
              <button onClick={() => remove(selected._id)} className="text-xs font-bold text-red-600">Delete lead</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
