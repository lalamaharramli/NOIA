import { Link } from 'react-router-dom'
import { useLocale } from '../../i18n/locale-context'
import { LOCALE_LABELS, LOCALE_NAMES, LOCALES } from '../../i18n/locales'
import { cn } from '../../lib/cn'

interface LanguageSwitcherProps {
  /** Called after a language link is followed (used to close the mobile menu). */
  onNavigate?: () => void
  className?: string
}

/**
 * Three plain links, one per language. Because every language has its own
 * URL, these are real links: middle-click, copy link and browser history all work.
 */
export function LanguageSwitcher({ onNavigate, className }: LanguageSwitcherProps) {
  const { t, locale, switchLocalePath } = useLocale()

  return (
    <div
      role="group"
      aria-label={t.common.switchLanguage}
      className={cn('flex items-center gap-3', className)}
    >
      {LOCALES.map((targetLocale) => {
        const isCurrent = targetLocale === locale

        return (
          <Link
            key={targetLocale}
            to={switchLocalePath(targetLocale)}
            hrefLang={targetLocale}
            lang={targetLocale}
            aria-label={`${LOCALE_NAMES[targetLocale]} (${LOCALE_LABELS[targetLocale]})`}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              'border-b py-0.5 text-[11px] tracking-[0.16em] transition-colors',
              isCurrent
                ? 'border-ink text-ink'
                : 'border-transparent text-ink-muted hover:border-clay/40 hover:text-ink',
            )}
          >
            {LOCALE_LABELS[targetLocale]}
          </Link>
        )
      })}
    </div>
  )
}
