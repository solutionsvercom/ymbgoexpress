import React, { useState } from 'react';
import axios from 'axios';

const WA_NUMBER = '9755124554';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', form);
      setSent(true);
    } catch {
      alert('Failed to send. Try WhatsApp instead.');
    }
    setLoading(false);
  };

  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#E8762C] text-sm font-semibold tracking-wider uppercase">CONTACT</span>
          <h2 className="text-[#0D5C63] text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Get in Touch
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: 'fa-whatsapp fa-brands', label: 'WhatsApp', value: '+91 97551 24554', href: `https://wa.me/${WA_NUMBER}`, color: 'bg-green-500' },
              { icon: 'fa-phone', label: 'Phone', value: '+91 97551 24554', href: 'tel:+9197551 24554', color: 'bg-[#0D7377]' },
              { icon: 'fa-envelope', label: 'Email', value: 'ymbgoexpress@gmail.com', href: 'mailto:ymbgoexpress@gmail.com', color: 'bg-[#E8762C]' },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow hover:shadow-lg transition-all group">
                <div className={`${c.color} text-white w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <i className={`fa-solid ${c.icon} text-lg`}></i>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{c.label}</div>
                  <div className="font-semibold text-[#0D5C63]">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 shadow">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-[#0D5C63] mb-1">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]" />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377]" />
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your Message" rows={4} required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0D7377] resize-none" />
                <button type="submit" disabled={loading}
                  className="w-full bg-[#E8762C] text-white py-3 rounded-xl font-semibold hover:bg-[#d4681f] transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
