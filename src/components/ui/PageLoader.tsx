import { useLocale } from '../../i18n/locale-context'

/** Shown while a page chunk is loading (React.lazy + Suspense). */
export function PageLoader() {
  const { t } = useLocale()

  return (
    <div
      className="flex min-h-[55vh] flex-col items-center justify-center gap-5"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border border-line border-t-clay"
      />
      <span className="text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
        {t.common.loading}
      </span>
    </div>
  )
}
