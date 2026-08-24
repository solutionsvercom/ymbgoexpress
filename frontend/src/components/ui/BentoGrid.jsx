import React from 'react';
import { cn } from '../../lib/utils';

export function BentoGrid({ children, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({ children, className }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-brand-card p-6',
        'transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/[0.12] hover:bg-brand-card-hover hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.04] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}