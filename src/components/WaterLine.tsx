import { cn } from '@/lib/utils';

type WaterLineProps = {
  variant?: 'inline' | 'divider';
  className?: string;
};

/**
 * Brand motif: a thin sine wave evoking Lake Saimaa.
 * `inline` is for eyebrows; `divider` spans full container width.
 */
export default function WaterLine({ variant = 'inline', className }: WaterLineProps) {
  if (variant === 'inline') {
    return (
      <svg
        viewBox="0 0 42 10"
        width={42}
        height={10}
        aria-hidden
        className={cn('inline-block flex-shrink-0 text-primary', className)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
      >
        <path d="M1 5 Q 6 1, 11 5 T 21 5 T 31 5 T 41 5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 600 14"
      preserveAspectRatio="none"
      width="100%"
      height={14}
      aria-hidden
      className={cn('block text-primary/60', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
    >
      <path d="M0 7 Q 30 1, 60 7 T 120 7 T 180 7 T 240 7 T 300 7 T 360 7 T 420 7 T 480 7 T 540 7 T 600 7" />
    </svg>
  );
}
