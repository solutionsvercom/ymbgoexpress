import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import api from '../../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ymbgoexpress.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ymb_admin_token', data.token);
      localStorage.setItem('ymb_admin', JSON.stringify(data.admin));
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-md bg-brand-darker border border-brand-gold/15 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <img src="/images/ymbgo_logo.png" alt="YMB GoExpress" className="h-14 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-brand-offwhite">Admin Panel</h1>
          <p className="text-brand-offwhite/50 text-sm mt-1">Sign in to manage leads, bookings and routes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-brand-offwhite/40 uppercase tracking-wider block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-offwhite/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-brand-offwhite/[0.04] border border-brand-gold/15 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-offwhite focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-brand-offwhite/40 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-offwhite/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-brand-offwhite/[0.04] border border-brand-gold/15 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-offwhite focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
