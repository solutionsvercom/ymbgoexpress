import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import api from '../../lib/api';

const TITLES = [
  'Tire pressure',
  'Tea office',
  'Evening tea',
  'Parking',
  'Phool mala',
  'Body / gate work',
  'Porter (Hambali)',
  'Water',
  'Salary manager',
  'Other'
];

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function inr(value) {
  return new Intl.NumberFormat('en-IN').format(money(value));
}

function emptyItem() {
  return { title: '', amount: '', note: '' };
}

function officeTitle(name) {
  if (!name || name === 'Office Kareha') return 'Office Kharcha';
  return name;
}

export const OfficeKharchaSection = forwardRef(function OfficeKharchaSection(
  { date, dateLabel, onTotalChange, onMessage, onError },
  ref
) {
  const [officeName, setOfficeName] = useState('Office Kharcha');
  const [items, setItems] = useState([emptyItem(), emptyItem(), emptyItem()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + money(item.amount), 0),
    [items]
  );

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  const load = async (selectedDate = date) => {
    setLoading(true);
    try {
      const { data: exp } = await api.get('/bms/office-expenses', { params: { date: selectedDate } });
      const row = exp.data || {};
      setOfficeName(officeTitle(row.officeName));
      const next = (row.items || []).map((item) => ({
        title: item.title || 'Other',
        amount: item.amount ? String(item.amount) : '',
        note: item.note || ''
      }));
      setItems(next.length ? next : [emptyItem(), emptyItem(), emptyItem()]);
    } catch (err) {
      onError?.(err.response?.data?.error || 'Could not load office expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/bms/office-expenses', { date, officeName, items });
      onMessage?.('Office Kharcha saved.');
      return true;
    } catch (err) {
      onError?.(err.response?.data?.error || 'Could not save office expenses.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({ save }), [date, officeName, items]);

  if (loading) {
    return <p className="text-sm text-brand-charcoal/45">Opening office Kharcha...</p>;
  }

  return (
    <section
      id="office-kharcha"
      className="rounded-sm border border-[#cbb98a] shadow-[0_8px_24px_rgba(42,15,18,0.08)] overflow-hidden"
      style={{
        backgroundColor: '#FBF3DC',
        backgroundImage: 'repeating-linear-gradient(#FBF3DC, #FBF3DC 35px, rgba(42,15,18,0.07) 36px)'
      }}
    >
      <header className="px-4 sm:px-6 py-3 border-b-2 border-[#2A0F12] flex flex-wrap items-center justify-between gap-2 bg-[#f4e6bc]/80">
        <span className="font-semibold text-[#1d4f91]">{dateLabel}</span>
        <input
          value={officeName}
          onChange={(e) => setOfficeName(e.target.value)}
          className="font-display font-bold text-lg bg-transparent border-0 border-b border-[#1d4f91]/30 outline-none text-center"
        />
        <span className="text-xs text-brand-charcoal/45">Office expenses</span>
      </header>

      <div className="hidden sm:grid grid-cols-[1.4fr_1.6fr_0.8fr_auto] gap-2 px-4 sm:px-6 pt-4 text-[10px] uppercase tracking-wider font-bold text-brand-charcoal/45">
        <span>Expense</span>
        <span>Note</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      <div className="px-4 sm:px-6 py-3 space-y-3">
        <datalist id="office-expense-titles">
          {TITLES.map((title) => (
            <option key={title} value={title} />
          ))}
        </datalist>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1.6fr_0.8fr_auto] gap-2 items-center">
            <input
              list="office-expense-titles"
              value={item.title}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="Expense name"
              className="bg-transparent border-0 border-b border-[#1d4f91]/35 outline-none py-1 text-sm"
            />
            <input
              placeholder="Note — tea, salary, body gate..."
              value={item.note}
              onChange={(e) => updateItem(index, 'note', e.target.value)}
              className="bg-transparent border-0 border-b border-[#1d4f91]/35 outline-none py-1 text-sm"
            />
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={item.amount}
              onChange={(e) => updateItem(index, 'amount', e.target.value)}
              className="w-full text-right bg-transparent border-0 border-b border-[#1d4f91]/35 font-semibold text-[#1d4f91] tabular-nums outline-none py-1"
            />
            <button
              type="button"
              onClick={() => setItems((prev) => (prev.length === 1 ? [emptyItem()] : prev.filter((_, i) => i !== index)))}
              className="text-brand-charcoal/35 hover:text-red-600 justify-self-end"
              aria-label="Remove expense"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 pb-4">
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, emptyItem()])}
          className="text-sm font-bold text-brand-red inline-flex items-center gap-1"
        >
          <Plus size={14} /> Add expense
        </button>
      </div>

      <footer className="px-4 sm:px-6 py-4 border-t-2 border-[#2A0F12] bg-[#f4e6bc]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-brand-charcoal/50">Office Kharcha total</div>
          <div className="font-display text-2xl font-bold text-[#1d4f91]">₹{inr(total)}</div>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save office Kharcha'}
        </button>
      </footer>
    </section>
  );
});

export default function BmsOfficeExpenses() {
  return <Navigate to="/bmsadmin" replace />;
}
