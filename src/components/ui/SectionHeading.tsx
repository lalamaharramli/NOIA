import type { ReactNode } from 'react'
import { Container } from './Container'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  intro?: string
  action?: ReactNode
  className?: string
}

/** Heading block shared by the home page sections. */
export function SectionHeading({ eyebrow, title, intro, action, className }: SectionHeadingProps) {
  return (
    <Reveal
      className={
        'flex flex-col gap-8 md:flex-row md:items-end md:justify-between ' + (className ?? '')
      }
    >
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-5 text-[clamp(1.9rem,4vw,3.15rem)] leading-[1.05] tracking-[-0.025em]">
          {title}
        </h2>
        {intro && <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-soft">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  )
}

interface PageHeaderProps {
  eyebrow: string
  title: string
  intro?: string
  children?: ReactNode
}

/** Header used by the inner pages (collection, about, custom order, contact). */
export function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <Container>
      <header className="border-b border-line/70 pb-10 pt-12 md:pb-14 md:pt-20">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,5.2vw,4rem)] leading-[1.02] tracking-[-0.03em]">
            {title}
          </h1>
          {intro && <p className="mt-6 max-w-2xl text-[15.5px] leading-8">{intro}</p>}
          {children}
        </Reveal>
      </header>
    </Container>
  )
}
