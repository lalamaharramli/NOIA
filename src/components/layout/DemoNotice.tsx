import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/locale-context'

/**
 * A single honest line while the catalogue and contact details are
 * placeholders. It disappears automatically when `showExampleNotice`
 * is set to false in src/config/site.ts.
 */
export function DemoNotice() {
  const { t } = useLocale()

  if (!siteConfig.showExampleNotice) return null

  return (
    <div className="border-b border-line/60 bg-cream/80">
      <p className="mx-auto max-w-[1240px] px-5 py-2 text-center text-[10.5px] leading-5 text-ink-muted sm:px-8">
        {t.demo.text}
      </p>
    </div>
  )
}
