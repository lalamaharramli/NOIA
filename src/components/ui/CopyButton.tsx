import { Check, Copy, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocale } from '../../i18n/locale-context'
import { copyTextToClipboard } from '../../lib/clipboard'
import { buttonClass } from './buttonClasses'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

/** Copies a prepared message. Feedback is also announced to screen readers. */
export function CopyButton({ text, label, className }: CopyButtonProps) {
  const { t } = useLocale()
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 4000)
    return () => window.clearTimeout(timer)
  }, [status])

  async function handleCopy() {
    const succeeded = await copyTextToClipboard(text)
    setStatus(succeeded ? 'copied' : 'error')
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={buttonClass('secondary', 'md', className)}
      >
        {status === 'copied' ? (
          <Check aria-hidden="true" size={16} strokeWidth={1.8} />
        ) : status === 'error' ? (
          <TriangleAlert aria-hidden="true" size={16} strokeWidth={1.8} />
        ) : (
          <Copy aria-hidden="true" size={16} strokeWidth={1.8} />
        )}
        {label ?? t.common.copy}
      </button>
      <span aria-live="polite" className="sr-only">
        {status === 'copied' ? t.common.copied : status === 'error' ? t.common.copyError : ''}
      </span>
    </>
  )
}
