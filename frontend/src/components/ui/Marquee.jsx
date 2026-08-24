import React from 'react';
import { cn } from '../../lib/utils';

export default function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = 40,
}) {
  return (
    <div
      className={cn('group flex overflow-hidden [--gap:1rem] gap-[var(--gap)]', className)}
    >
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 items-center justify-around gap-[var(--gap)]',
            reverse ? 'animate-marquee-reverse' : 'animate-marquee',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
          style={{ animationDuration: `${speed}s` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
