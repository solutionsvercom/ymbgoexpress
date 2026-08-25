import React, { useEffect, useState } from 'react';
import { Camera, ImagePlus, Loader2, Trash2 } from 'lucide-react';
import api from '../../lib/api';

function BillThumb({ filename, originalName }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let objectUrl = '';
    let cancelled = false;
    api.get(`/bms/bills/file/${filename}`, { responseType: 'blob' })
      .then(({ data }) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(data);
        setUrl(objectUrl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [filename]);
  if (!url) return <div className="w-full h-24 rounded-xl bg-brand-cream border border-brand-charcoal/10" />;
  return (
    <img
      src={url}
      alt={originalName || 'Bill'}
      className="w-full h-24 object-cover rounded-xl border border-brand-charcoal/10 bg-brand-cream"
    />
  );
}

export default function BillBookScanner({ date, onExtracted, onMessage, onError }) {
  const [bills, setBills] = useState([]);
  const [visionReady, setVisionReady] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('');

  const load = async (selectedDate = date) => {
    try {
      const { data } = await api.get('/bms/bills', { params: { date: selectedDate } });
      setBills(data.data?.bills || []);
      setVisionReady(data.data?.visionReady !== false);
    } catch {
      setBills([]);
    }
  };

  useEffect(() => {
    load(date).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const scanFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    setScanning(true);
    onError?.('');
    try {
      for (let i = 0; i < files.length; i += 1) {
        setStatus(`Reading bill ${i + 1} of ${files.length}...`);
        const body = new FormData();
        body.append('image', files[i]);
        body.append('date', date);
        const { data } = await api.post('/bms/bills/scan', body);
        if (data.data?.extracted) onExtracted?.(data.data.extracted);
        if (data.data?.warning) onMessage?.(data.data.warning);
        else onMessage?.(`Filled amounts from ${files[i].name}. Check the figures, then save.`);
      }
      await load(date);
    } catch (err) {
      onError?.(err.response?.data?.error || 'Could not read this bill photo.');
    } finally {
      setScanning(false);
      setStatus('');
    }
  };

  const removeBill = async (id) => {
    await api.delete(`/bms/bills/${id}`);
    await load(date);
  };

  return (
    <section className="bg-white border border-brand-charcoal/10 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red mb-1">Bill book</p>
          <h2 className="font-display text-lg font-bold">Upload physical bill photos</h2>
          <p className="text-sm text-brand-charcoal/55 mt-1">
            Photograph the notebook page (Aavak / Kharcha or office Kharcha). Amounts fill into the register below — check them before saving.
          </p>
          {!visionReady && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
              Photos will be stored. To auto-fill numbers, add a free GEMINI_API_KEY from Google AI Studio into backend/.env and restart the server.
            </p>
          )}
        </div>
        <label className={`inline-flex items-center justify-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer ${scanning ? 'opacity-60 pointer-events-none' : ''}`}>
          {scanning ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          {scanning ? 'Reading...' : 'Add bill photo'}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            disabled={scanning}
            onChange={(e) => {
              scanFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
      </div>
      <label className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-red cursor-pointer">
        <ImagePlus size={14} /> Choose from gallery
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={scanning}
          onChange={(e) => {
            scanFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>
      {status && <p className="text-xs text-brand-charcoal/50 mt-2">{status}</p>}
      {bills.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {bills.map((bill) => (
            <div key={bill._id} className="relative group">
              <BillThumb filename={bill.filename} originalName={bill.originalName} />
              <button
                type="button"
                onClick={() => removeBill(bill._id)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
