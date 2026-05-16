'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Wraps a homepage section in a fade-up entrance.
 * Runs once when ~20% of the section is in view.
 * Honors `prefers-reduced-motion` (Motion does this automatically).
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
