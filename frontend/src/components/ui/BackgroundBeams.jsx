import React from 'react';
import { cn } from '../../lib/utils';

export default function BackgroundBeams({ className }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-brand-red/[0.04] blur-[120px]" />
      <div className="absolute -bottom-[30%] -right-[20%] h-[70%] w-[50%] rounded-full bg-brand-gold/[0.03] blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] h-[40%] w-[30%] rounded-full bg-brand-red/[0.03] blur-[100px]" />
    </div>
  );
}
