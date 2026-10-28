import { ArrowRight, ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { InstagramIcon as Instagram } from '../components/ui/icons'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/SectionHeading'
import { buttonClass } from '../components/ui/buttonClasses'
import { useLocale } from '../i18n/locale-context'
import { contactChannels } from '../lib/contact'
import { getEmailUrl, getInstagramUrl, getWhatsAppProfileUrl } from '../lib/links'
import { usePageMeta } from '../lib/usePageMeta'

export default function ContactPage() {
  const { t, path } = useLocale()

  usePageMeta({
    title: t.meta.contact.title,
    description: t.meta.contact.description,
    path: path('contact'),
  })

  const channels = [
    {
      key: 'whatsapp',
      icon: MessageCircle,
      title: t.common.whatsapp,
      description: t.contact.whatsappText,
      href: getWhatsAppProfileUrl(),
      display: contactChannels.whatsapp ? `+${contactChannels.whatsapp}` : null,
      isExternal: true,
    },
    {
      key: 'email',
      icon: Mail,
      title: t.common.email,
      description: t.contact.emailText,
      href: getEmailUrl(),
      display: contactChannels.email,
      isExternal: false,
    },
    {
      key: 'instagram',
      icon: Instagram,
      title: t.common.instagram,
      description: t.contact.instagramText,
      href: getInstagramUrl(),
      display: contactChannels.instagram ? `@${contactChannels.instagram}` : null,
      isExternal: true,
    },
  ]

  return (
    <>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />

      <Container className="py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon

            return (
              <section
                key={channel.key}
                className="flex flex-col rounded-[1.5rem] border border-line/70 bg-cream/40 p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-ivory text-clay">
                  <Icon aria-hidden="true" size={20} strokeWidth={1.6} />
                </span>
                <h2 className="mt-5 text-xl">{channel.title}</h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-7">{channel.description}</p>

                {channel.href && channel.display ? (
                  <a
                    href={channel.href}
                    target={channel.isExternal ? '_blank' : undefined}
                    rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-2 text-[13.5px] text-ink transition-colors hover:text-clay"
                  >
                    <span className="break-all">{channel.display}</span>
                    <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.7} />
                  </a>
                ) : (
                  <p className="mt-5 text-[10.5px] tracking-[0.14em] text-ink-muted uppercase">
                    {t.contact.unconfigured}
                  </p>
                )}
              </section>
            )
          })}
        </div>

        <p className="mt-8 max-w-2xl text-[12px] leading-6 text-ink-muted">
          {t.contact.responseNote}
        </p>

        <section className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[1.5rem] border border-line/70 px-6 py-8 sm:flex-row sm:items-center md:px-8">
          <div>
            <h2 className="text-2xl">{t.contact.formTitle}</h2>
            <p className="mt-2 max-w-md text-[13.5px] leading-7">{t.contact.formText}</p>
          </div>
          <Link to={path('customOrder')} className={buttonClass('primary', 'md')}>
            {t.contact.formCta}
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} />
          </Link>
        </section>
      </Container>
    </>
  )
}
