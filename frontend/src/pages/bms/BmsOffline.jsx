import React, { useEffect, useState } from 'react';
import api, { formatDate } from '../../lib/api';

const empty = {
  passengerName: '', phone: '', officeId: '', agentId: '', fleetBusId: '',
  routeFrom: '', routeTo: '', seats: 1, amount: 0, travelDate: '', notes: ''
};

export default function BmsOffline() {
  const [rows, setRows] = useState([]);
  const [offices, setOffices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const [o, a, b, r] = await Promise.all([
      api.get('/bms/offices'), api.get('/bms/agents'), api.get('/bms/buses'), api.get('/bms/offline')
    ]);
    setOffices(o.data.data || []);
    setAgents(a.data.data || []);
    setBuses(b.data.data || []);
    setRows(r.data.data || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const officeAgents = form.officeId ? agents.filter((ag) => (ag.officeId?._id || ag.officeId) === form.officeId) : agents;

  const save = async (e) => {
    e.preventDefault();
    await api.post('/bms/offline', {
      ...form,
      officeId: form.officeId || null,
      agentId: form.agentId || null,
      fleetBusId: form.fleetBusId || null,
      seats: Number(form.seats),
      amount: Number(form.amount)
    });
    setOpen(false);
    setForm(empty);
    await load();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Offline bookings</h1>
          <p className="text-sm text-brand-charcoal/50">Counter sales from branch offices and agents.</p>
        </div>
        <button onClick={() => setOpen(true)} className="bg-brand-red text-white text-sm font-bold px-4 py-2 rounded-xl">New offline booking</button>
      </div>

      <div className="bg-white border border-brand-charcoal/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-brand-cream text-left text-[11px] uppercase tracking-wider text-brand-charcoal/50">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Passenger</th>
                <th className="px-4 py-3">Office / agent</th>
                <th className="px-4 py-3">Trip</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-t border-brand-charcoal/5">
                  <td className="px-4 py-3 font-mono text-xs font-bold">{row.bookingRef}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{row.passengerName}</div>
                    <div className="text-xs text-brand-charcoal/45">{row.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{row.officeId?.name || '—'} · {row.agentId?.code || '—'}</td>
                  <td className="px-4 py-3 text-xs">{row.routeFrom} → {row.routeTo}<div>{row.travelDate || formatDate(row.createdAt)}</div></td>
                  <td className="px-4 py-3 font-bold">₹{row.amount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) => api.patch(`/bms/offline/${row._id}`, { status: e.target.value }).then(load)}
                      className="text-[10px] font-bold uppercase border rounded-full px-2 py-1"
                    >
                      <option>pending</option>
                      <option>confirmed</option>
                      <option>cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="p-6 text-sm text-brand-charcoal/40">No offline bookings yet.</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-3 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display font-bold text-lg">Offline booking</h2>
            <label className="text-xs font-bold block">Passenger
              <input required value={form.passengerName} onChange={(e) => setForm({ ...form, passengerName: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
            </label>
            <label className="text-xs font-bold block">Phone
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold">From
                <input value={form.routeFrom} onChange={(e) => setForm({ ...form, routeFrom: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold">To
                <input value={form.routeTo} onChange={(e) => setForm({ ...form, routeTo: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
            </div>
            <label className="text-xs font-bold block">Office
              <select value={form.officeId} onChange={(e) => setForm({ ...form, officeId: e.target.value, agentId: '' })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option value="">Select office</option>
                {offices.map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold block">Agent
              <select value={form.agentId} onChange={(e) => setForm({ ...form, agentId: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option value="">Select agent</option>
                {officeAgents.map((a) => <option key={a._id} value={a._id}>{a.code} · {a.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold block">Bus
              <select value={form.fleetBusId} onChange={(e) => setForm({ ...form, fleetBusId: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal">
                <option value="">Optional</option>
                {buses.map((b) => <option key={b._id} value={b._id}>{b.code}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs font-bold">Seats
                <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold">Amount
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
              </label>
              <label className="text-xs font-bold">Travel date
                <input type="date" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 font-normal" />
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
