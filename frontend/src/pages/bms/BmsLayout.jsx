import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen, Bus, Route as RouteIcon, Building2, Users,
  Ticket, LogOut, Menu, X
} from 'lucide-react';
import api from '../../lib/api';

const links = [
  { to: '/bmsadmin/routes', label: 'Routes', icon: RouteIcon },
  { to: '/bmsadmin', label: 'Daily account', icon: BookOpen, end: true },
  { to: '/bmsadmin/buses', label: 'Buses', icon: Bus },
  { to: '/bmsadmin/offline', label: 'Offline', icon: Ticket },
  { to: '/bmsadmin/offices', label: 'Branches', icon: Building2 },
  { to: '/bmsadmin/agents', label: 'Agents', icon: Users },
];

export default function BmsLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = JSON.parse(localStorage.getItem('ymb_admin') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('ymb_admin_token');
    if (!token) {
      navigate('/bmsadmin/login', { replace: true });
      return;
    }
    api.get('/auth/me')
      .then(() => setReady(true))
      .catch(() => navigate('/bmsadmin/login', { replace: true }));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('ymb_admin_token');
    localStorage.removeItem('ymb_admin');
    navigate('/bmsadmin/login', { replace: true });
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center text-brand-charcoal/50 text-sm">
        Loading BMS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream font-body text-brand-charcoal flex">
      <aside className="hidden lg:flex w-64 shrink-0 bg-brand-charcoal text-brand-offwhite flex-col">
        <div className="px-5 py-5 border-b border-brand-gold/10">
          <div className="font-display font-bold text-sm">BMS Admin</div>
          <div className="text-[10px] text-brand-gold/80 mt-0.5">Daily accounts · Office Kharcha</div>
          <div className="text-[10px] text-brand-offwhite/40 mt-1">{admin.email}</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-red text-white'
                    : 'text-brand-offwhite/60 hover:bg-white/5 hover:text-brand-offwhite'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <a href="/admin" className="mx-3 mb-1 px-3 py-2 text-xs text-brand-gold/70 hover:text-brand-gold">Website admin →</a>
        <button onClick={logout} className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-brand-offwhite/50 hover:bg-white/5">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden bg-brand-charcoal text-brand-offwhite px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold">BMS Admin</span>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        {menuOpen && (
          <div className="lg:hidden bg-brand-charcoal text-brand-offwhite px-3 pb-3 space-y-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-brand-red text-white' : 'text-brand-offwhite/70'}`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-brand-offwhite/50">
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
