import React, { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { icon: 'fa-users', value: 50000, suffix: '+', label: 'Happy Passengers' },
  { icon: 'fa-route', value: 10, suffix: '+', label: 'Routes Covered' },
  { icon: 'fa-bus', value: 25, suffix: '+', label: 'Modern Buses' },
  { icon: 'fa-star', value: 4.8, suffix: '/5', label: 'Average Rating', static: true },
];

export default function StatsStrip() {
  return (
    <div className="bg-gradient-to-r from-[#0D5C63] to-[#0D7377] py-10">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ icon, value, suffix, label, static: isStatic }) => (
          <div key={label} className="text-center text-white">
            <i className={`fa-solid ${icon} text-[#E8762C] text-2xl mb-2`}></i>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isStatic ? `${value}${suffix}` : <AnimatedCounter target={value} suffix={suffix} />}
            </div>
            <div className="text-sm text-white/70">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
