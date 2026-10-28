import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { buttonClass } from '../components/ui/buttonClasses'
import { siteConfig } from '../config/site'
import { useLocale } from '../i18n/locale-context'
import { usePageMeta } from '../lib/usePageMeta'

export default function AboutPage() {
  const { t, path } = useLocale()

  usePageMeta({
    title: t.meta.about.title,
    description: t.meta.about.description,
    path: path('about'),
  })

  const values = [
    { title: t.about.value1Title, text: t.about.value1Text },
    { title: t.about.value2Title, text: t.about.value2Text },
    { title: t.about.value3Title, text: t.about.value3Text },
  ]

  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} intro={t.about.lead} />

      <Container className="py-10 md:py-14">
        <Reveal>
          <div className="overflow-hidden rounded-[1.75rem] bg-cream">
            <img
              src="/images/studio.svg"
              alt={t.about.imageAlt}
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <Reveal>
            <p className="text-[15.5px] leading-8">{t.about.body1}</p>
            <p className="mt-5 text-[15.5px] leading-8">{t.about.body2}</p>
          </Reveal>

          <Reveal delay={100}>
            <blockquote className="border-l border-clay/40 pl-6">
              <p className="font-serif text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.35] text-ink italic">
                {t.about.quote}
              </p>
            </blockquote>
            {siteConfig.showExampleNotice && (
              <p className="mt-6 text-[11.5px] leading-6 text-ink-muted">
                {t.about.placeholderNote}
              </p>
            )}
          </Reveal>
        </div>

        <section className="mt-16 border-t border-line/70 pt-10 md:mt-20 md:pt-12">
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">{t.about.valuesTitle}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 80}>
                <span className="font-serif text-[22px] text-clay">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg">{value.title}</h3>
                <p className="mt-2 text-[13.5px] leading-7">{value.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </Container>

      <section className="mt-10 bg-cream/60 py-16 md:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)]">{t.about.ctaTitle}</h2>
            <p className="mt-4 text-[15px] leading-7">{t.about.ctaText}</p>
          </div>
          <Link to={path('customOrder')} className={buttonClass('primary', 'lg')}>
            {t.about.cta}
            <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
          </Link>
        </Container>
      </section>
    </>
  )
}
