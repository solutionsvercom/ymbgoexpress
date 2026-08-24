import React from 'react';
import { motion } from 'framer-motion';
import { Users, Route, Bus, Star } from 'lucide-react';
import AnimatedCounter from './ui/AnimatedCounter.jsx';

const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Happy Passengers', color: 'text-brand-red' },
  { icon: Route, value: 10, suffix: '+', label: 'Routes Covered', color: 'text-brand-gold' },
  { icon: Bus, value: 25, suffix: '+', label: 'Modern Buses', color: 'text-brand-red' },
  { icon: Star, value: 4.8, suffix: '/5', label: 'Average Rating', isFloat: true, color: 'text-brand-gold' },
];

export default function StatsStrip() {
  return (
    <div className="relative bg-brand-charcoal border-y border-brand-gold/15 py-12 md:py-16 overflow-hidden text-brand-offwhite">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/50 via-transparent to-brand-charcoal/50" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {stats.map(({ icon: Icon, value, suffix, label, isFloat, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-offwhite/[0.03] border border-brand-gold/10 mb-4 group-hover:border-brand-red/30 transition-colors duration-500">
              <Icon size={20} className={color} />
            </div>
            <div className="text-3xl md:text-4xl font-bold font-display text-brand-gold mb-1">
              <AnimatedCounter target={value} suffix={suffix} />
            </div>
            <div className="text-sm text-brand-offwhite/50">{label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
