import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import api from '../../lib/api';

const RECEIPTS = [
  ['redbus', '1. Redbus booking'],
  ['mentis', '2. Mentis'],
  ['indoreOffice', '3. Indore office'],
  ['ujjainOffice', '4. Ujjain office'],
  ['luggageOffice', '5. Luggage office']
];

const EXPENSES = [
  ['diesel', '1. Diesel'],
  ['tollBooth', '2. Toll booth'],
  ['urea', '3. Urea']
];

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function displayDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${String(y).slice(-2)}`;
}

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function inr(value) {
  return new Intl.NumberFormat('en-IN').format(money(value));
}

function blank(value) {
  return value ? String(value) : '';
}

function routeLabelFor(bus) {
  if (bus.routeId?.from && bus.routeId?.to) return `${bus.routeId.from} To ${bus.routeId.to}`;
  return bus.name || '';
}

function emptySheet(bus, date) {
  return {
    date,
    busCode: bus.code,
    busName: bus.name || '',
    routeLabel: routeLabelFor(bus),
    fleetBusId: bus._id,
    receipts: {
      redbus: '',
      mentis: '',
      indoreOffice: '',
      ujjainOffice: '',
      luggageOffice: ''
    },
    expenses: {
      diesel: '',
      tollBooth: '',
      urea: '',
      otherItems: [{ note: '', amount: '' }]
    }
  };
}

function sheetFrom(bus, ledger, date) {
  const base = emptySheet(bus, date);
  if (!ledger) return base;
  const otherItems = ledger.expenses?.otherItems?.length
    ? ledger.expenses.otherItems.map((item) => ({ note: item.note || '', amount: blank(item.amount) }))
    : [{ note: '', amount: '' }];
  return {
    ...base,
    busName: ledger.busName || base.busName,
    routeLabel: ledger.routeLabel || base.routeLabel,
    receipts: {
      redbus: blank(ledger.receipts?.redbus),
      mentis: blank(ledger.receipts?.mentis),
      indoreOffice: blank(ledger.receipts?.indoreOffice),
      ujjainOffice: blank(ledger.receipts?.ujjainOffice),
      luggageOffice: blank(ledger.receipts?.luggageOffice)
    },
    expenses: {
      diesel: blank(ledger.expenses?.diesel),
      tollBooth: blank(ledger.expenses?.tollBooth),
      urea: blank(ledger.expenses?.urea),
      otherItems
    }
  };
}

function totals(sheet) {
  const receiptTotal = RECEIPTS.reduce((sum, [key]) => sum + money(sheet.receipts[key]), 0);
  const otherTotal = (sheet.expenses.otherItems || []).reduce((sum, item) => sum + money(item.amount), 0);
  const expenseTotal =
    money(sheet.expenses.diesel) +
    money(sheet.expenses.tollBooth) +
    money(sheet.expenses.urea) +
    otherTotal;
  return { receiptTotal, expenseTotal, balance: receiptTotal - expenseTotal };
}

function AmountInput({ value, onChange, ariaLabel }) {
  return (
    <input
      type="number"
      min="0"
      step="1"
      inputMode="numeric"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-28 sm:w-32 text-right bg-transparent border-0 border-b border-[#1d4f91]/35 font-semibold text-[#1d4f91] tabular-nums outline-none py-0.5"
    />
  );
}

export default function BmsLedger() {
  const [date, setDate] = useState(todayISO());
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async (selectedDate = date) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/bms/ledgers', { params: { date: selectedDate } });
      const buses = data.data?.buses || [];
      const ledgers = data.data?.ledgers || [];
      setSheets(buses.map((bus) => {
        const match = ledgers.find((row) => row.busCode === bus.code);
        return sheetFrom(bus, match, selectedDate);
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load the daily account.');
      setSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const updateSheet = (index, updater) => {
    setSheets((prev) => prev.map((sheet, i) => (i === index ? updater(sheet) : sheet)));
  };

  const saveSheet = async (sheet) => {
    setSaving(sheet.busCode);
    setMessage('');
    setError('');
    try {
      await api.put('/bms/ledgers', sheet);
      setMessage(`Saved bus ${sheet.busCode}`);
    } catch (err) {
      setError(err.response?.data?.error || `Could not save bus ${sheet.busCode}.`);
    } finally {
      setSaving('');
    }
  };

  const dayTotals = useMemo(() => {
    return sheets.reduce(
      (acc, sheet) => {
        const t = totals(sheet);
        acc.receiptTotal += t.receiptTotal;
        acc.expenseTotal += t.expenseTotal;
        acc.balance += t.balance;
        return acc;
      },
      { receiptTotal: 0, expenseTotal: 0, balance: 0 }
    );
  }, [sheets]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red mb-1">Daily register</p>
          <h1 className="font-display text-2xl font-bold">Bus account — Aavak / Kharcha</h1>
          <p className="text-sm text-brand-charcoal/50 mt-1">
            Fill receipts and expenses for each bus separately, the same way as the notebook.
          </p>
        </div>
        <label className="text-xs font-bold">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block border border-brand-charcoal/15 rounded-xl px-3 py-2 font-normal bg-white"
          />
        </label>
      </div>

      {message && <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">{message}</p>}
      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

      {loading ? (
        <p className="text-sm text-brand-charcoal/45">Opening register...</p>
      ) : sheets.length === 0 ? (
        <p className="text-sm text-brand-charcoal/55">
          No buses found. Add 7311 and 7312 from <a className="text-brand-red font-bold" href="/bmsadmin/buses">Buses</a>.
        </p>
      ) : (
        <div className="space-y-8">
          {sheets.map((sheet, index) => {
            const t = totals(sheet);
            return (
              <NotebookSheet
                key={sheet.busCode}
                dateLabel={displayDate(date)}
                sheet={sheet}
                totals={t}
                saving={saving === sheet.busCode}
                onSave={() => saveSheet(sheet)}
                onReceipt={(key, value) => updateSheet(index, (s) => ({ ...s, receipts: { ...s.receipts, [key]: value } }))}
                onExpense={(key, value) => updateSheet(index, (s) => ({ ...s, expenses: { ...s.expenses, [key]: value } }))}
                onOther={(oi, field, value) => updateSheet(index, (s) => ({
                  ...s,
                  expenses: {
                    ...s.expenses,
                    otherItems: s.expenses.otherItems.map((item, i) => (i === oi ? { ...item, [field]: value } : item))
                  }
                }))}
                onAddOther={() => updateSheet(index, (s) => ({
                  ...s,
                  expenses: { ...s.expenses, otherItems: [...s.expenses.otherItems, { note: '', amount: '' }] }
                }))}
                onRemoveOther={(oi) => updateSheet(index, (s) => {
                  const next = s.expenses.otherItems.filter((_, i) => i !== oi);
                  return {
                    ...s,
                    expenses: {
                      ...s.expenses,
                      otherItems: next.length ? next : [{ note: '', amount: '' }]
                    }
                  };
                })}
              />
            );
          })}

          <div className="bg-brand-charcoal text-brand-offwhite rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryStat label="All buses — receipts" value={inr(dayTotals.receiptTotal)} />
            <SummaryStat label="All buses — expenses" value={inr(dayTotals.expenseTotal)} />
            <SummaryStat
              label="Day balance"
              value={`${dayTotals.balance < 0 ? '−' : ''}${inr(Math.abs(dayTotals.balance))}`}
              hint={dayTotals.balance >= 0 ? 'Bachat' : 'Loss'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value, hint }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-brand-gold/80 font-bold">{label}</div>
      <div className="font-display text-2xl font-bold mt-1">₹{value}</div>
      {hint && <div className="text-xs text-brand-offwhite/50 mt-0.5">{hint}</div>}
    </div>
  );
}

function NotebookSheet({
  dateLabel, sheet, totals: t, saving, onSave,
  onReceipt, onExpense, onOther, onAddOther, onRemoveOther
}) {
  const loss = t.balance < 0;
  return (
    <section
      className="rounded-sm border border-[#cbb98a] shadow-[0_8px_24px_rgba(42,15,18,0.08)] overflow-hidden"
      style={{
        backgroundColor: '#FBF3DC',
        backgroundImage: 'repeating-linear-gradient(#FBF3DC, #FBF3DC 31px, rgba(42,15,18,0.07) 32px)'
      }}
    >
      <header className="px-4 sm:px-6 py-3 border-b-2 border-[#2A0F12] flex flex-wrap items-center justify-between gap-2 bg-[#f4e6bc]/80">
        <span className="font-semibold text-[#1d4f91]">{dateLabel}</span>
        <span className="font-display font-bold text-lg">{sheet.routeLabel || sheet.busName || 'Route'}</span>
        <span className="font-mono font-bold text-lg">{sheet.busCode}</span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x-2 divide-[#2A0F12]/70">
        <div className="p-4 sm:p-6">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-[#2A0F12]">Aavak — Receipts</h2>
          <div className="space-y-3">
            {RECEIPTS.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-3 min-h-8">
                <span className="text-sm">{label}</span>
                <AmountInput value={sheet.receipts[key]} onChange={(v) => onReceipt(key, v)} ariaLabel={label} />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-3 border-t-2 border-[#2A0F12] flex items-center justify-between font-bold">
            <span>Total receipts</span>
            <span className="text-[#1d4f91] tabular-nums">₹{inr(t.receiptTotal)}</span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-[#2A0F12]">Kharcha — Expenses</h2>
          <div className="space-y-3">
            {EXPENSES.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-3 min-h-8">
                <span className="text-sm">{label}</span>
                <AmountInput value={sheet.expenses[key]} onChange={(v) => onExpense(key, v)} ariaLabel={label} />
              </div>
            ))}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">4. Others</span>
                <button type="button" onClick={onAddOther} className="text-[11px] font-bold text-brand-red inline-flex items-center gap-1">
                  <Plus size={12} /> Add note
                </button>
              </div>
              <div className="space-y-2">
                {sheet.expenses.otherItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      placeholder="Note — parking, water, mala..."
                      value={item.note}
                      onChange={(e) => onOther(i, 'note', e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-0 border-b border-[#1d4f91]/35 text-sm outline-none py-0.5"
                    />
                    <AmountInput value={item.amount} onChange={(v) => onOther(i, 'amount', v)} ariaLabel={`Other expense ${i + 1}`} />
                    <button type="button" onClick={() => onRemoveOther(i)} className="text-brand-charcoal/35 hover:text-red-600" aria-label="Remove other expense">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t-2 border-[#2A0F12] flex items-center justify-between font-bold">
            <span>Total expenses</span>
            <span className="text-[#1d4f91] tabular-nums">₹{inr(t.expenseTotal)}</span>
          </div>
        </div>
      </div>

      <footer className="px-4 sm:px-6 py-4 border-t-2 border-[#2A0F12] bg-[#f4e6bc]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-brand-charcoal/50">Bachat / Balance for {sheet.busCode}</div>
          <div className={`font-display text-2xl font-bold ${loss ? 'text-red-700' : 'text-emerald-800'}`}>
            {loss ? '−' : ''}₹{inr(Math.abs(t.balance))}
            <span className="text-sm font-semibold ml-2">{loss ? 'Loss' : 'Bachat'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : `Save bus ${sheet.busCode}`}
        </button>
      </footer>
    </section>
  );
}
