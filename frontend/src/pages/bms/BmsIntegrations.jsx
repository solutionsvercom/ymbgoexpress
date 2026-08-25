import React, { useEffect, useState } from 'react';
import api, { formatDate } from '../../lib/api';

export default function BmsIntegrations() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const { data } = await api.get('/bms/integrations');
    setRows(data.data || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const toggle = async (row) => {
    const next = row.status === 'connected' ? 'disconnected' : 'connected';
    await api.patch(`/bms/integrations/${row._id}`, { status: next, enabled: next === 'connected' });
    await load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">API integrations</h1>
      <p className="text-sm text-brand-charcoal/50 mb-6">RedBus and Mantis GDS connections from the BMS map.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((row) => (
          <div key={row._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-6">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="font-display font-bold text-lg">{row.name}</h2>
                <p className="text-xs text-brand-charcoal/50 mt-1">{row.notes}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                row.status === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-cream text-brand-charcoal/50'
              }`}>
                {row.status}
              </span>
            </div>
            <p className="text-xs text-brand-charcoal/40 mt-4">
              Last sync: {row.lastSyncAt ? formatDate(row.lastSyncAt) : 'Never'}
            </p>
            <button
              onClick={() => toggle(row)}
              className="mt-4 bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              {row.status === 'connected' ? 'Disconnect' : 'Mark connected'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
