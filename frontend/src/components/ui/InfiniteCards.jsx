import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export default function InfiniteCards({
  items,
  renderItem,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}) {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const clone = item.cloneNode(true);
        scrollerRef.current.appendChild(clone);
      });

      const speedMap = { fast: '20s', normal: '40s', slow: '80s' };
      containerRef.current.style.setProperty('--animation-duration', speedMap[speed]);
      containerRef.current.style.setProperty(
        '--animation-direction',
        direction === 'left' ? 'forwards' : 'reverse'
      );
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-4 w-max flex-nowrap',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
        style={{
          animation: start
            ? `scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite`
            : 'none',
        }}
      >
        {items.map((item, idx) => (
          <li key={idx} className="w-[350px] max-w-full flex-shrink-0">
            {renderItem(item, idx)}
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes scroll {
          to { transform: translateX(calc(-50% - 0.5rem)); }
        }
      `}</style>
    </div>
  );
}
