import { cn } from '../../lib/cn'

/**
 * Shared button styles, kept in a plain module (no JSX) so that React Fast
 * Refresh stays reliable and these strings can be imported anywhere.
 *
 * Use these on <Link>, <a> or <button>.
 */
export const buttonStyles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-full text-center font-medium transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50',
  primary: 'bg-ink text-ivory hover:bg-clay',
  secondary: 'border border-ink/20 text-ink hover:border-ink/60 hover:bg-cream/60',
  light: 'bg-ivory text-ink hover:bg-cream',
  outlineLight: 'border border-ivory/30 text-ivory hover:border-ivory/70 hover:bg-ivory/10',
  sizes: {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-3 text-sm',
    lg: 'px-7 py-3.5 text-[15px]',
  },
} as const

/** Builds a complete class string for a button-like element. */
export function buttonClass(
  variant: keyof Pick<typeof buttonStyles, 'primary' | 'secondary' | 'light' | 'outlineLight'>,
  size: keyof typeof buttonStyles.sizes = 'md',
  className?: string,
): string {
  return cn(buttonStyles.base, buttonStyles[variant], buttonStyles.sizes[size], className)
}
