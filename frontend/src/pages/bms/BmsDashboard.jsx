import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

function NodeBox({ title, subtitle, to, accent }) {
  const inner = (
    <div className={`min-w-[140px] rounded-2xl border px-4 py-3 text-center shadow-sm ${
      accent ? 'bg-brand-red text-white border-brand-red' : 'bg-white border-brand-charcoal/10'
    }`}>
      <div className="font-display font-bold text-sm">{title}</div>
      {subtitle && <div className={`text-[10px] mt-0.5 ${accent ? 'text-white/70' : 'text-brand-charcoal/45'}`}>{subtitle}</div>}
    </div>
  );
  if (!to) return inner;
  return <Link to={to} className="hover:-translate-y-0.5 transition-transform block">{inner}</Link>;
}

export default function BmsDashboard() {
  const [map, setMap] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/bms/map').then(({ data }) => setMap(data.data)).catch(() => setMap({ buses: [], offices: [], agents: [], integrations: [], routes: [] }));
    api.get('/bms/stats').then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  const buses = map?.buses || [];
  const offices = map?.offices || [];
  const agentsByOffice = (id) => (map?.agents || []).filter((a) => (a.officeId?._id || a.officeId) === id);

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red mb-1">Wireframe · CRM</p>
        <h1 className="font-display text-2xl font-bold">Bus Management System</h1>
        <p className="text-sm text-brand-charcoal/50 mt-1">Fleet, routes, branches, offline bookings and GDS APIs.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {[
            ['Buses', stats.buses, '/bmsadmin/buses'],
            ['Routes', stats.routes, '/bmsadmin/routes'],
            ['Offices', stats.offices, '/bmsadmin/offices'],
            ['Agents', stats.agents, '/bmsadmin/agents'],
            ['Offline', stats.offline, '/bmsadmin/offline'],
            ['Live APIs', stats.connectedApis, '/bmsadmin/integrations'],
          ].map(([label, value, to]) => (
            <Link key={label} to={to} className="bg-white border border-brand-charcoal/10 rounded-2xl p-4 hover:border-brand-red/30">
              <div className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/40">{label}</div>
              <div className="font-display text-2xl font-extrabold mt-1">{value}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-[#FBF9F6] border border-dashed border-brand-charcoal/20 rounded-3xl p-6 md:p-10 overflow-x-auto">
        <div className="flex flex-col items-center gap-4 min-w-[720px]">
          <NodeBox title="Bus Management System" accent />

          <div className="h-6 w-px bg-brand-charcoal/20" />

          <div className="flex items-center gap-4">
            <NodeBox title="Bus" subtitle="Fleet start" to="/bmsadmin/buses" />
            <span className="text-brand-charcoal/30">→</span>
            <NodeBox title="Add Bus (2)" subtitle="Register coaches" to="/bmsadmin/buses" />
            <span className="text-brand-charcoal/30">→</span>
            <NodeBox title="Route" subtitle="Assign service" to="/bmsadmin/routes" />
          </div>

          <div className="h-6 w-px bg-brand-charcoal/20" />

          <div className="grid grid-cols-2 gap-10 w-full max-w-xl">
            <div>
              <p className="text-[10px] font-bold uppercase text-brand-charcoal/40 mb-2 text-center">Add bus</p>
              <div className="space-y-2">
                {buses.slice(0, 2).map((b, i) => (
                  <div key={b._id} className="bg-white border border-brand-charcoal/10 rounded-xl px-3 py-2 text-xs font-semibold text-center">
                    ({i + 1}) {b.code} {b.name && `· ${b.name}`}
                  </div>
                ))}
                {buses.length === 0 && <div className="text-xs text-center text-brand-charcoal/40">No buses yet</div>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-brand-charcoal/40 mb-2 text-center">Route mapping</p>
              <div className="space-y-2">
                {buses.slice(0, 2).map((b, i) => (
                  <div key={b._id} className="bg-white border border-brand-red/20 rounded-xl px-3 py-2 text-xs text-center">
                    ({i + 1}) {b.routeId ? `${b.routeId.from} → ${b.routeId.to}` : 'Unassigned'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-brand-charcoal/20" />

          <div className="flex gap-4">
            <NodeBox title="Branch" subtitle="Offices" to="/bmsadmin/offices" />
            <NodeBox title="Offline" subtitle="Counter bookings" to="/bmsadmin/offline" />
          </div>

          <div className="h-6 w-px bg-brand-charcoal/20" />

          <div className="flex gap-4">
            {(map?.integrations || [{ name: 'API RedBus' }, { name: 'Mantis' }]).map((item) => (
              <NodeBox
                key={item._id || item.name}
                title={item.name}
                subtitle={item.status || 'not connected'}
                to="/bmsadmin/integrations"
              />
            ))}
          </div>

          <div className="h-6 w-px bg-brand-charcoal/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {offices.map((office) => (
              <div key={office._id} className="bg-white border border-brand-charcoal/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="font-display font-bold text-sm">{office.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-brand-charcoal/40">{office.type} · {office.city}</div>
                  </div>
                  {office.commissionPercent > 0 && (
                    <span className="text-xs font-extrabold text-brand-red">{office.commissionPercent}%</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agentsByOffice(office._id).map((agent) => (
                    <span key={agent._id} className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-cream border border-brand-charcoal/10">
                      {agent.code}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {offices.length === 0 && (
              <p className="text-sm text-brand-charcoal/40 col-span-3">Offices will appear here after the first BMS seed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
