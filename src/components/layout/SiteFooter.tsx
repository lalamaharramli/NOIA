import { Mail, MessageCircle } from 'lucide-react'
import { InstagramIcon as Instagram } from '../ui/icons'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/locale-context'
import { contactChannels } from '../../lib/contact'
import { getEmailUrl, getInstagramUrl, getWhatsAppProfileUrl } from '../../lib/links'
import { Container } from '../ui/Container'

export function SiteFooter() {
  const { t, path } = useLocale()
  const year = new Date().getFullYear()

  const emailUrl = getEmailUrl()
  const whatsappUrl = getWhatsAppProfileUrl()
  const instagramUrl = getInstagramUrl()

  const contactRows = [
    {
      key: 'whatsapp',
      label: t.common.whatsapp,
      icon: MessageCircle,
      href: whatsappUrl,
      detail: whatsappUrl ? `+${contactChannels.whatsapp}` : null,
    },
    {
      key: 'email',
      label: t.common.email,
      icon: Mail,
      href: emailUrl,
      detail: contactChannels.email,
    },
    {
      key: 'instagram',
      label: t.common.instagram,
      icon: Instagram,
      href: instagramUrl,
      detail: contactChannels.instagram ? `@${contactChannels.instagram}` : null,
    },
  ]

  return (
    <footer className="mt-24 border-t border-line/70 bg-cream/45">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_1fr]">
          <div>
            <Link to={path('home')} className="inline-flex flex-col leading-none">
              <span className="font-serif text-2xl tracking-[0.3em] text-ink">NOIA</span>
              <span className="mt-1 text-[9px] tracking-[0.22em] text-ink-muted uppercase">
                {t.common.brandTagline}
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-ink-soft">{t.footer.about}</p>
            <p className="mt-6 text-[10.5px] tracking-[0.18em] text-ink-muted uppercase">
              {t.footer.madeIn}
            </p>
          </div>

          <nav aria-label={t.footer.siteTitle}>
            <h2 className="text-[10.5px] font-medium tracking-[0.2em] text-ink uppercase">
              {t.footer.siteTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link className="text-ink-soft transition-colors hover:text-clay" to={path('home')}>
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link className="text-ink-soft transition-colors hover:text-clay" to={path('shop')}>
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link
                  className="text-ink-soft transition-colors hover:text-clay"
                  to={path('about')}
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  className="text-ink-soft transition-colors hover:text-clay"
                  to={path('customOrder')}
                >
                  {t.nav.customOrder}
                </Link>
              </li>
              <li>
                <Link
                  className="text-ink-soft transition-colors hover:text-clay"
                  to={path('contact')}
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-[10.5px] font-medium tracking-[0.2em] text-ink uppercase">
              {t.footer.contactTitle}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {contactRows.map((row) => {
                const Icon = row.icon

                return (
                  <li key={row.key}>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.key === 'email' ? undefined : '_blank'}
                        rel={row.key === 'email' ? undefined : 'noopener noreferrer'}
                        className="inline-flex items-center gap-2.5 text-ink-soft transition-colors hover:text-clay"
                      >
                        <Icon aria-hidden="true" size={15} strokeWidth={1.7} />
                        <span>{row.detail ?? row.label}</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2.5 text-ink-muted">
                        <Icon aria-hidden="true" size={15} strokeWidth={1.7} />
                        <span>
                          {row.label} — {t.common.notConfigured}
                        </span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>

            <p className="mt-8 text-[11px] leading-5 text-ink-muted">{t.footer.imageNotice}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line/60 pt-6 text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights.replace('{year}', String(year))}</p>
          <p className="tracking-[0.12em] uppercase">{siteConfig.domain}</p>
        </div>
      </Container>
    </footer>
  )
}
