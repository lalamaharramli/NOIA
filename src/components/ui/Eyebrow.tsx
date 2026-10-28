import type { ReactNode } from 'react'

/** Small uppercase label with a short rule. Used above section headings. */
export function Eyebrow({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'light'
}) {
  return (
    <p
      className={`flex items-center gap-3 text-[10.5px] font-medium tracking-[0.24em] uppercase ${
        tone === 'light' ? 'text-blush' : 'text-clay'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-7 ${tone === 'light' ? 'bg-blush/50' : 'bg-clay/50'}`}
      />
      {children}
    </p>
  )
}
