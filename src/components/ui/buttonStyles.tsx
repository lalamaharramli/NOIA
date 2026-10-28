import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** Small label used for availability and example markers. */
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'positive' | 'muted'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[10.5px] font-medium tracking-[0.12em] uppercase backdrop-blur-sm',
        tone === 'positive' && 'bg-sage/20 text-[#4f5f49]',
        tone === 'muted' && 'bg-ink/5 text-ink-soft',
        tone === 'neutral' && 'bg-ivory/90 text-ink-soft',
      )}
    >
      {children}
    </span>
  )
}
