import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';
import TextReveal from './ui/TextReveal.jsx';

export default function AboutSection() {
  return (
    <section className="section-padding bg-brand-cream relative overflow-hidden text-brand-charcoal">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />

      <div className="section-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <TextReveal>
              <p className="section-subheading text-brand-red mb-2 font-bold">ABOUT JOON HOLIDAYS</p>
              <h2 className="section-heading text-brand-charcoal mb-4">
                Madhya Bharat’s Most <span className="text-gradient-red">Trusted Bus Service</span>
              </h2>
              <p className="text-brand-red font-display italic text-lg tracking-wider mb-6 font-medium">
                यात्रा खास, सेवा रॉयल • Driven by Comfort, Powered by Trust
              </p>
            </TextReveal>

            <TextReveal delay={0.1}>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                Founded with a core mission to transform overnight travel in Central India, Joon Holidays (YMB GoExpress) provides premium AC Sleeper and Seater coaches. We connect key industrial hubs, including Indore, Bhopal, Gwalior, Morena, and Agra, with passenger safety and luxury at the forefront.
              </p>
            </TextReveal>

            <TextReveal delay={0.2}>
              <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                Our fleet is equipped with modern state-of-the-art facilities: fully individual AC vents, powerful reading lamps, privacy curtains, satellite live GPS tracking, and safety systems. Whether you are traveling for business or leisure, we guarantee on-time service and premium hospitality.
              </p>
            </TextReveal>

            {/* Icons row */}
            <TextReveal delay={0.3}>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Shield, title: 'Safe Travel', desc: 'CCTV & SOS support' },
                  { icon: Sparkles, title: 'Royal Comfort', desc: 'Spacious berths' },
                  { icon: Heart, title: 'Trained Crew', desc: 'Polite hospitality' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-[#FBF9F6] border border-brand-gold/15 rounded-xl p-4 text-center lg:text-left shadow-sm">
                      <Icon className="text-brand-gold mb-2 mx-auto lg:mx-0" size={18} />
                      <div className="text-xs font-bold text-brand-charcoal mb-0.5">{item.title}</div>
                      <div className="text-[10px] text-brand-charcoal/40 font-medium">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </TextReveal>
          </div>

          {/* Media Panel */}
          <div className="lg:col-span-5 relative">
            <TextReveal delay={0.2}>
              <div className="relative group rounded-2xl overflow-hidden border border-brand-gold/20 shadow-lg">
                <img 
                  src="/images/Bus-mountain.jpeg" 
                  alt="YMB GoExpress Bus"
                  className="rounded-2xl w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent" />
                
                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 bg-brand-red border border-brand-red/20 text-brand-offwhite p-5 rounded-xl backdrop-blur-sm shadow-xl">
                  <div className="text-3xl font-display font-extrabold text-brand-gold">20+</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-brand-offwhite/80 mt-0.5">Years of Travel Service</div>
                </div>
              </div>
            </TextReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
