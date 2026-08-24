import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, IndianRupee, Route as RouteIcon } from 'lucide-react';
import RouteModal from './RouteModal.jsx';
import TextReveal from './ui/TextReveal.jsx';

const FALLBACK_ROUTES = [
  {
    id: 1, from: 'Indore', to: 'Morena', duration: '10h 30m', price: 999, seats: 12,
    type: 'AC Sleeper', distance: '540 km', departure: '07:00 PM', arrival: '07:30 AM',
    image: '/images/indore-morena.png',
    stops: [
      { city: 'Krishna travels in front of paani ki tanki teen imli', time: '07:00 PM' },
      { city: 'Yash travels panwan puri paani ki tanki ke samne', time: '07:10 PM' },
      { city: 'Kanadiya bypass bridge ending', time: '07:30 PM' },
      { city: 'Start square', time: '07:50 PM' },
      { city: 'Best price', time: '08:10 PM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [{ city: 'By Pass', time: '07:45 AM' }]
  },
  {
    id: 2, from: 'Morena', to: 'Indore', duration: '10h 30m', price: 999, seats: 8,
    type: 'AC Sleeper', distance: '540 km', departure: '09:40 PM', arrival: '09:15 AM',
    image: '/images/morena-indore.jpeg',
    stops: [{ city: 'Purana rajput dhaba ke samne morena', time: '09:05 PM' }],
    dp: [
      { city: 'Mangaliya toll', time: '09:15 AM' },
      { city: 'Best price', time: '09:25 AM' },
      { city: 'Star square', time: '09:35 AM' },
      { city: 'Kanadiya bypass bridge ending', time: '09:45 AM' },
      { city: 'Teen Imli', time: '09:55 AM' }
    ]
  },
  {
    id: 3, from: 'Indore', to: 'Gwalior', duration: '9h 00m', price: 899, seats: 15,
    type: 'AC Seater', distance: '500 km', departure: '07:00 PM', arrival: '06:30 AM',
    image: '/images/indore-gwalior.png',
    stops: [
      { city: 'Kanadiya bypass bridge ending', time: '07:30 PM' },
      { city: 'Star Square', time: '07:50 PM' },
      { city: 'Best Price', time: '08:10 AM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [
      { city: 'chandra badni naka', time: '06:30 AM' },
      { city: 'Chetakpuri bus stand', time: '06:40 AM' },
      { city: 'Aakashvani shubasmall gwalior', time: '06:50 AM' },
      { city: 'Db mall opposite railway station', time: '07:00 AM' },
      { city: 'Gole Ka Mandir', time: '07:10 AM' }
    ]
  },
  {
    id: 4, from: 'Gwalior', to: 'Indore', duration: '9h 00m', price: 899, seats: 20,
    type: 'AC Seater', distance: '500 km', departure: '10:30 PM', arrival: '09:15 AM',
    image: '/images/gwalior-indore.jpeg',
    stops: [
      { city: 'Purani chawani', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [
      { city: 'Mangaliya toll', time: '09:15 AM' },
      { city: 'Best Price', time: '09:25 AM' },
      { city: 'Star Square', time: '09:35 AM' },
      { city: 'Kanadiya bypass bridge ending', time: '09:45 AM' },
      { city: 'Teen Imli', time: '09:55 AM' }
    ]
  },
  {
    id: 5, from: 'Indore', to: 'Shivpuri', duration: '7h 00m', price: 799, seats: 5,
    type: 'AC Sleeper', distance: '390 km', departure: '07:00 PM', arrival: '04:30 AM',
    image: '/images/bhind-indore.jpeg',
    stops: [
      { city: 'Star Square', time: '07:50 PM' },
      { city: 'Best Price', time: '08:10 PM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [
      { city: 'Opp medicl collage', time: '04:10 AM' },
      { city: 'Ghoda chouraha,shivpuri', time: '04:10 AM' }
    ]
  },
  {
    id: 6, from: 'Indore', to: 'Agra', duration: '11h 00m', price: 1099, seats: 18,
    type: 'AC Seater', distance: '690 km', departure: '07:00 PM', arrival: '09:15 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Joon holidays(ymb go express)paani ki tanki ke samne teen imli', time: '07:00 PM' },
      { city: 'Yash travels panwan puri paani ki tanki ke samne', time: '07:10 PM' },
      { city: 'Kanadiya bypass bridge ending', time: '07:30 PM' },
      { city: 'Start square', time: '07:50 PM' },
      { city: 'Best price', time: '08:10 PM' },
      { city: 'Mangaliya toll', time: '08:20 PM' }
    ],
    dp: [
      { city: 'Rohta bypass near new prince dhaba', time: '09:45 AM' },
      { city: 'Eidhgah bus stand', time: '09:55 AM' },
      { city: 'Pratap pura chouraha mg road', time: '10:05 AM' }
    ]
  },
  {
    id: 7, from: 'Agra', to: 'Indore', duration: '11h 00m', price: 1099, seats: 18,
    type: 'AC Sleeper', distance: '690 km', departure: '07:00 PM', arrival: '09:15 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Sameertravels idgah in front of nepali market agra', time: '06:30 PM' },
      { city: 'Sameer travels pratapura ( opposite kirandeep hotel)', time: '07:15 PM' }
    ],
    dp: [
      { city: 'Mangaliya toll', time: '09:15 AM' },
      { city: 'Best Price', time: '09:25 AM' },
      { city: 'Star Square', time: '09:35 AM' },
      { city: 'Kanadiya bypass bridge ending', time: '09:45 AM' },
      { city: 'Teen Imli', time: '09:55 AM' }
    ]
  },
  {
    id: 8, from: 'Agra', to: 'Ujjain', duration: '12h 00m', price: 999, seats: 18,
    type: 'AC Sleeper', distance: '640 km', departure: '07:00 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Sameertravels idgah in front of nepali market agra', time: '06:30 PM' },
      { city: 'Sameer travels pratapura ( opposite kirandeep hotel)', time: '07:15 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '06:30 AM' }]
  },
  {
    id: 9, from: 'Morena', to: 'Ujjain', duration: '09h 20m', price: 899, seats: 18,
    type: 'AC Sleeper', distance: '500 km', departure: '09:40 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [{ city: 'Purana rajput dhaba ke samne morena', time: '09:40 PM' }],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  },
  {
    id: 10, from: 'Gwalior', to: 'Ujjain', duration: '08h 00m', price: 899, seats: 18,
    type: 'AC Sleeper', distance: '460 km', departure: '10:30 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Purani chawanii', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  },
  {
    id: 11, from: 'Bhopal', to: 'Gwalior', duration: '08h 00m', price: 999, seats: 18,
    type: 'AC Sleeper', distance: '460 km', departure: '10:30 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Purani chawanii', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  },
  {
    id: 12, from: 'Gwalior', to: 'Bhopal', duration: '08h 00m', price: 999, seats: 18,
    type: 'AC Sleeper', distance: '460 km', departure: '10:30 PM', arrival: '07:00 AM',
    image: '/images/indore-bhind.png',
    stops: [
      { city: 'Purani chawanii', time: '10:10 PM' },
      { city: 'Gole Ka Mandir', time: '10:30 PM' },
      { city: 'Bus Stand DB Mall', time: '10:35 PM' },
      { city: 'Chetak Puri', time: '10:50 PM' },
      { city: 'Chandra Badni Naka', time: '10:55 PM' }
    ],
    dp: [{ city: 'Citylink travels dewas gate bus stand shop no. 18 in front of police station', time: '07:00 AM' }]
  }
];

export default function RoutesSection() {
  const [routes, setRoutes] = useState(FALLBACK_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    axios.get('/api/routes')
      .then(({ data }) => {
        if (data?.data?.length) {
          setRoutes(data.data.map((r) => ({ ...r, id: r._id || r.id })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-brand-cream relative text-brand-charcoal">
      <div className="section-container relative">
        <TextReveal>
          <div className="text-center mb-14">
            <p className="section-subheading text-brand-red mb-3">POPULAR ROUTES</p>
            <h2 className="section-heading text-brand-charcoal mb-4">
              Explore Our <span className="text-gradient-red">Routes</span>
            </h2>
            <p className="text-brand-charcoal/60 max-w-xl mx-auto text-sm">
              Connecting major cities across Madhya Pradesh, Rajasthan & Uttar Pradesh with premium overnight bus services.
            </p>
          </div>
        </TextReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={() => setSelectedRoute(route)}
              className="group bg-white rounded-3xl overflow-hidden border border-brand-charcoal/[0.06] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/5" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-charcoal text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {route.type}
                </span>
                <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full">
                  {route.distance}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Route timeline */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-brand-charcoal/40 font-bold uppercase tracking-wider mb-0.5">From</p>
                    <p className="font-display font-extrabold text-brand-charcoal text-base truncate">{route.from}</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <span className="w-6 h-px bg-brand-charcoal/15" />
                    <RouteIcon size={11} className="text-brand-red" />
                    <span className="w-6 h-px bg-brand-charcoal/15" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-[9px] text-brand-charcoal/40 font-bold uppercase tracking-wider mb-0.5">To</p>
                    <p className="font-display font-extrabold text-brand-charcoal text-base truncate">{route.to}</p>
                  </div>
                </div>

                {/* Departure / duration / arrival */}
                <div className="flex items-center justify-between py-3 border-y border-brand-charcoal/[0.07] mb-4">
                  <div>
                    <p className="text-xs font-semibold text-brand-charcoal">{route.departure}</p>
                    <p className="text-[9px] text-brand-charcoal/40 uppercase tracking-wide">Departs</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-charcoal/45">
                    <Clock size={11} />
                    <span className="text-[11px] font-medium">{route.duration}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-brand-charcoal">{route.arrival}</p>
                    <p className="text-[9px] text-brand-charcoal/40 uppercase tracking-wide">Arrives</p>
                  </div>
                </div>

                {/* Price + seats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-0.5">
                    <IndianRupee size={15} className="text-brand-red mr-0.5" />
                    <span className="text-2xl font-display font-extrabold text-brand-charcoal leading-none">
                      {route.price}
                    </span>
                    <span className="text-[10px] text-brand-charcoal/40 font-medium ml-1">/seat</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      route.seats <= 5
                        ? 'bg-red-50 text-red-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {route.seats} seats left
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedRoute(route); }}
                  className="w-full bg-brand-red text-white py-2.5 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 hover:bg-brand-red/90 active:scale-[0.98] transition-all duration-200"
                >
                  View Details & Book
                  <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {selectedRoute && <RouteModal route={selectedRoute} onClose={() => setSelectedRoute(null)} />}
    </section>
  );
}