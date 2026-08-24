import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Ticket, IndianRupee, Route as RouteIcon } from 'lucide-react';
import api, { formatDate } from '../../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!stats) return <p className="text-sm text-brand-charcoal/50">Loading dashboard...</p>;

  const cards = [
    { label: 'Unread leads', value: stats.unreadLeads, sub: `${stats.leads} total`, to: '/admin/leads', icon: MessageSquare },
    { label: 'Confirmed bookings', value: stats.confirmed, sub: `${stats.bookings} total`, to: '/admin/bookings', icon: Ticket },
    { label: 'Revenue', value: `₹${stats.revenue}`, sub: 'Confirmed + completed', to: '/admin/bookings', icon: IndianRupee },
    { label: 'Active routes', value: stats.routes, sub: `${stats.buses} buses in fleet`, to: '/admin/routes', icon: RouteIcon },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-brand-charcoal/50 mb-6">Live snapshot of enquiries, bookings and fleet.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, sub, to, icon: Icon }) => (
          <Link key={label} to={to} className="bg-white border border-brand-charcoal/10 rounded-2xl p-5 hover:border-brand-red/30 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-brand-charcoal/40">{label}</span>
              <Icon size={16} className="text-brand-red" />
            </div>
            <div className="font-display text-2xl font-extrabold">{value}</div>
            <div className="text-xs text-brand-charcoal/45 mt-1">{sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
          <h2 className="font-display font-bold mb-4">Latest leads</h2>
          {stats.recentLeads.length === 0 && <p className="text-sm text-brand-charcoal/40">No contact submissions yet.</p>}
          <ul className="space-y-3">
            {stats.recentLeads.map((lead) => (
              <li key={lead._id} className="text-sm border-b border-brand-charcoal/5 pb-3 last:border-0">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{lead.name}</span>
                  <span className="text-[10px] uppercase font-bold text-brand-red">{lead.status}</span>
                </div>
                <p className="text-xs text-brand-charcoal/50 mt-1 line-clamp-2">{lead.message}</p>
                <p className="text-[10px] text-brand-charcoal/35 mt-1">{formatDate(lead.createdAt)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
          <h2 className="font-display font-bold mb-4">Latest bookings</h2>
          {stats.recentBookings.length === 0 && <p className="text-sm text-brand-charcoal/40">No bookings yet.</p>}
          <ul className="space-y-3">
            {stats.recentBookings.map((b) => (
              <li key={b._id} className="text-sm border-b border-brand-charcoal/5 pb-3 last:border-0">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{b.bookingId} · {b.name}</span>
                  <span className="text-[10px] uppercase font-bold text-brand-red">{b.status}</span>
                </div>
                <p className="text-xs text-brand-charcoal/50 mt-1">
                  {b.busType} · {b.seats.join(', ')} · ₹{b.totalAmount}
                </p>
                <p className="text-[10px] text-brand-charcoal/35 mt-1">{formatDate(b.createdAt)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
