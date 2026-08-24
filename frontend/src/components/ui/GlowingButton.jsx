import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function GlowingButton({ children, className, onClick, variant = 'red', size = 'md', ...props }) {
  const variants = {
    red: 'bg-brand-red hover:bg-brand-red/95 text-brand-offwhite shadow-lg shadow-brand-red/20',
    gold: 'bg-brand-gold hover:bg-brand-gold/95 text-brand-charcoal shadow-lg shadow-brand-gold/20',
    outline: 'bg-transparent border-2 border-brand-red text-brand-red hover:bg-brand-red/5',
    ghost: 'bg-brand-charcoal/30 hover:bg-brand-charcoal/50 text-brand-offwhite border border-brand-offwhite/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
