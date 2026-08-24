import React from 'react';
import {
  Wifi,
  Wind,
  Bed,
  MapPin,
  ShieldCheck,
  Zap,
  Wallet,
  SmartphoneCharging,
  Lightbulb,
  Network
} from 'lucide-react';

import TextReveal from './ui/TextReveal.jsx';
import { BentoGrid, BentoGridItem } from './ui/BentoGrid.jsx';

const features = [
  { icon: Wifi, title: 'Enabled Wi-Fi', desc: 'Stay connected throughout your journey with high-speed internet.' },
  { icon: Wind, title: 'Powerful AC Fan', desc: 'Continuous air circulation keeps the cabin cool and fresh.' },
  { icon: Bed, title: 'Sleeper Berths', desc: 'Spacious and comfortable sleeper berths to stretch out and relax.' },
  { icon: MapPin, title: 'Live GPS', desc: 'Real-time tracking of the bus route for passengers and families.' },
  { icon: ShieldCheck, title: 'Safe & Secure', desc: 'CCTV surveillance and emergency assistance system on board.' },
  { icon: Zap, title: 'Charging Points', desc: 'Convenient charging sockets next to every seat and berth.' },
  { icon: Wallet, title: 'Private Curtains', desc: 'Full-length curtains for your personal space and privacy.' },
  { icon: SmartphoneCharging, title: 'Mobile Charger', desc: 'Fast USB outlets provided to keep your smart devices powered up.' },
  { icon: Lightbulb, title: 'Reading Light', desc: 'Individual focused lighting so you can read without disturbing others.' },
];

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3 font-bold">COMFORT. PRIVACY. SAFETY.</p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Everything You Need For A <span className="text-gradient-red">Perfect Journey</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              We focus on premium travel details to ensure a safe, clean, and highly comfortable premium travel experience.
            </p>
          </div>
        </TextReveal>

        {/* 3x3 Grid */}
        <BentoGrid>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <BentoGridItem
                key={i}
                className="border-brand-gold/15 bg-[#FBF9F6] hover:border-brand-red/30 shadow-sm"
              >
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-red/5 rounded-full blur-2xl group-hover:bg-brand-red/10 transition-colors duration-500" />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-cream border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover:bg-brand-red group-hover:text-brand-offwhite group-hover:border-brand-red transition-all duration-300 flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-charcoal group-hover:text-brand-offwhite transition-colors duration-300 mb-1.5 text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-brand-charcoal/60 leading-relaxed group-hover:text-brand-offwhite transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </BentoGridItem>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}