import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Send, MessageCircle} from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';
import GlowingButton from './ui/GlowingButton.jsx';


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

  const inputClasses = "w-full bg-white border border-[#7A1F2B]/40 rounded-xl px-4 py-3 text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10 transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";

  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 font-bold">GET IN TOUCH</p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Contact Our <span className="text-gradient-red">Travel Support Desk</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              We have round-the-clock booking assistance and helpline numbers. Reach out for any inquiry.
            </p>
          </div>
        </TextReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details List */}
          <div className="lg:col-span-5 space-y-4">
            {[
              { 
                icon: MessageCircle, 
                label: 'WhatsApp Chat', 
                value: '+91 97551 24554', 
                href: `https://wa.me/${WA_NUMBER}?text=Hi%20Joon%20Holidays%2C%20I%20want%20to%20book%20a%20ticket`,
                bgColor: 'bg-emerald-800/10 border-emerald-500/20 text-emerald-800' 
              },
              { 
                icon: Phone, 
                label: 'Primary Helpline', 
                value: '+91 97552 54050', 
                href: 'tel:+919755254050',
                bgColor: 'bg-brand-red/10 border-brand-red/20 text-brand-red' 
              },
              { 
                icon: Phone, 
                label: 'Secondary Helpline', 
                value: '+91 97551 24554', 
                href: 'tel:+919755124554',
                bgColor: 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold' 
              },
              { 
                icon: Mail, 
                label: 'Email Inbox', 
                value: 'ymbgoexpress@gmail.com', 
                href: 'mailto:ymbgoexpress@gmail.com',
                bgColor: 'bg-sky-800/10 border-sky-500/20 text-sky-800' 
              },
              { 
                icon: MapPin, 
                label: 'Head Office Location', 
                value: 'Indore, Madhya Pradesh', 
                href: '#',
                bgColor: 'bg-purple-800/10 border-purple-500/20 text-purple-800' 
              }
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <a 
                  key={i} 
                  href={c.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-[#FBF9F6] border border-brand-gold/15 rounded-2xl p-5 hover:border-brand-red/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.bgColor} transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-brand-charcoal/40 mb-0.5">{c.label}</div>
                    <div className="font-bold text-brand-charcoal text-sm group-hover:text-brand-red transition-colors">{c.value}</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Message Form Box */}
          <div className="lg:col-span-7 bg-[#FBF9F6] border border-brand-gold/15 rounded-2xl p-6 md:p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-800/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-800">
                  ✓
                </div>
                <h3 className="font-display font-semibold text-xl text-brand-charcoal mb-2">Message Dispatched!</h3>
                <p className="text-brand-charcoal/50 text-xs max-w-sm mx-auto">We have received your query. Our passenger service desk will respond within a few hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider block mb-1.5">Your Name</label>
                  <input 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    placeholder="Enter your name" 
                    required
                    className={inputClasses} 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider block mb-1.5">Phone Number</label>
                  <input 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                    placeholder="Enter phone number" 
                    required
                    className={inputClasses} 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider block mb-1.5">Your Message</label>
                  <textarea 
                    value={form.message} 
                    onChange={e => setForm({ ...form, message: e.target.value })} 
                    placeholder="Type your query/message here..." 
                    rows={4} 
                    required
                    className={`${inputClasses} resize-none`} 
                  />
                </div>

                <GlowingButton type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending Message...' : 'Send Message'} <Send size={14} />
                </GlowingButton>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}