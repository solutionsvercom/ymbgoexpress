import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Shield, Snowflake, BedDouble, Navigation, Wifi, ChevronRight } from 'lucide-react';
import BackgroundBeams from './ui/BackgroundBeams.jsx';
import GlowingButton from './ui/GlowingButton.jsx';
import TextReveal from './ui/TextReveal.jsx';

const badges = [
  { icon: Shield, text: 'Safe & Secure' },
  { icon: Snowflake, text: 'AC Buses' },
  { icon: BedDouble, text: 'Sleeper Available' },
  { icon: Navigation, text: 'Live Tracking' },
  { icon: Wifi, text: 'Free WiFi' },
];

const routeTags = [
  'Indore ↔ Gwalior', 'Indore ↔ Morena', 'Indore ↔ Agra',
  'Indore ↔ Bhopal', 'Indore ↔ Guna', 'Gwalior ↔ Bhopal',
];

export default function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-brand-charcoal text-brand-offwhite">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/Hero-Section-Mobile.png"
          alt="Hero Mobile"
          className="block md:hidden w-full h-full object-cover"
        />
        <img
          src="/images/Bus-mountain.jpeg"
          alt="YMB GoExpress Premium Bus"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Deep Charcoal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/90 via-brand-charcoal/70 to-brand-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/50 to-transparent" />
      </div>

      <BackgroundBeams />

      {/* Content */}
      <div className="relative z-10 text-center px-6 pt-24 pb-16 w-full max-w-6xl mx-auto">
        {/* Hindi Tagline */}
        <TextReveal>
          <p className="text-brand-gold text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-4">
            ॥ जय माता दी ॥
          </p>
        </TextReveal>

        {/* Brand Name */}
        <TextReveal delay={0.1}>
          <h2 className="text-brand-offwhite/60 text-sm md:text-base font-display font-bold tracking-widest mb-2 uppercase">
            Joon Holidays
          </h2>
        </TextReveal>

        {/* Main Headline */}
        <TextReveal delay={0.2}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold mb-4 leading-tight">
            <span className="text-brand-offwhite">YMB</span>{' '}
            <span className="text-gradient-gold">GO EXPRESS</span>
          </h1>
        </TextReveal>

        {/* Tagline */}
        <TextReveal delay={0.3}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-red" />
            <p className="text-white text-sm md:text-base font-bold tracking-widest uppercase">
              Safe • Comfortable • Reliable
            </p>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-red" />
          </div>
        </TextReveal>

        <TextReveal delay={0.35}>
          <p className="text-brand-gold/90 text-lg md:text-xl italic font-display font-medium mb-8">
            सफ़र आपका, ज़िम्मेदारी हमारी
          </p>
        </TextReveal>

       
      

        {/* CTAs */}
        <TextReveal delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <GlowingButton
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="red"
            >
              Book Your Seat
              <ChevronRight size={18} />
            </GlowingButton>
            <GlowingButton
              onClick={() => document.getElementById('routes')?.scrollIntoView({ behavior: 'smooth' })}
              variant="ghost"
              size="lg"
            >
              View Routes
            </GlowingButton>
          </div>
        </TextReveal>

        {/* Feature Badges */}
        <TextReveal delay={0.6}>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {badges.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-brand-offwhite/50 text-xs md:text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-offwhite/[0.03] border border-brand-gold/10 flex items-center justify-center">
                  <Icon size={14} className="text-brand-gold" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </TextReveal>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-charcoal to-transparent" />

    </div>
  );
}
