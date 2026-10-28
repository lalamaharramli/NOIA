import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in milliseconds, useful for staggering cards. */
  delay?: number
}

/**
 * Whether the content can skip the scroll animation.
 * True when the browser has no IntersectionObserver (older browsers, tests)
 * or when the visitor prefers reduced motion.
 */
function canSkipAnimation(): boolean {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return true
  }

  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/**
 * Fades content in when it scrolls into view.
 * Falls back to visible immediately when IntersectionObserver is missing
 * (older browsers, tests) or when the visitor prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(canSkipAnimation)

  useEffect(() => {
    if (isVisible) return

    const element = elementRef.current
    if (!element) return

    /*
     * Browsers pause IntersectionObserver callbacks in hidden tabs (and some
     * embedded views), which would leave the content invisible forever.
     * This fallback reveals it anyway; in a normal tab the observer almost
     * always wins the race, so the scroll animation is unchanged.
     */
    const fallback = window.setTimeout(() => setIsVisible(true), 900)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    observer.observe(element)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [isVisible])

  return (
    <div
      ref={elementRef}
      className={cn(
        // Only transform is animated: if a browser pauses transitions in a
        // background tab, the text is still readable instead of stuck at
        // opacity 0. The movement is subtle on purpose.
        'transition-transform duration-700 ease-out motion-reduce:transition-none',
        isVisible ? 'translate-y-0' : 'translate-y-4',
        className,
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
