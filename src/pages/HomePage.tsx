import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { InstagramIcon as Instagram } from '../components/ui/icons'
import { Link } from 'react-router-dom'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { buttonClass } from '../components/ui/buttonClasses'
import { products } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { getFeaturedProducts } from '../lib/products'
import { getInstagramUrl } from '../lib/links'
import { usePageMeta } from '../lib/usePageMeta'
import { ProductCard } from '../features/products/ProductCard'

export default function HomePage() {
  const { t, locale, path } = useLocale()
  const instagramUrl = getInstagramUrl()

  usePageMeta({
    title: t.meta.home.title,
    description: t.meta.home.description,
    path: path('home'),
  })

  const featured = getFeaturedProducts(3)
  const showcase = featured.length > 0 ? featured : products.slice(0, 3)

  const processSteps = [
    { title: t.home.step1Title, text: t.home.step1Text },
    { title: t.home.step2Title, text: t.home.step2Text },
    { title: t.home.step3Title, text: t.home.step3Text },
  ]

  const facts = [t.home.fact1, t.home.fact2, t.home.fact3]

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-14 pt-10 pb-16 md:pt-16 md:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="rise">
            <Eyebrow>{t.home.eyebrow}</Eyebrow>

            <h1 className="mt-6 text-[clamp(2.85rem,6vw,5.1rem)] leading-[0.98] tracking-[-0.035em]">
              {t.home.titleLine}
              <br />
              <em className="font-serif text-clay italic">{t.home.titleAccent}</em>
            </h1>

            <p className="mt-7 max-w-md text-[15.5px] leading-8">{t.home.intro}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to={path('shop')} className={buttonClass('primary', 'lg')}>
                {t.home.primaryCta}
                <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
              </Link>
              <Link to={path('customOrder')} className={buttonClass('secondary', 'lg')}>
                {t.home.secondaryCta}
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-line/80 pt-6 text-[10.5px] tracking-[0.16em] text-ink-muted uppercase">
              {facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="size-1 rounded-full bg-clay/60" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rise relative mx-auto w-full max-w-[520px] lg:mx-0"
            style={{ animationDelay: '120ms' }}
          >
            {/* Offset hairline frame adds depth without a heavy shadow. */}
            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 hidden h-full w-full rounded-[2rem] border border-clay/25 sm:block"
            />
            <div className="relative overflow-hidden rounded-[2rem] bg-cream shadow-[0_35px_90px_-45px_rgba(60,40,20,0.5)]">
              <img
                src="/images/hero.svg"
                alt={t.home.heroImageAlt}
                width={1000}
                height={1200}
                fetchPriority="high"
                decoding="async"
                className="aspect-[5/6] w-full object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-ivory/90 px-3.5 py-1.5 text-[9.5px] tracking-[0.18em] text-ink-muted uppercase backdrop-blur-sm">
                {t.home.heroNote}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* A quiet facts strip; decorative repetition is hidden from screen readers. */}
      <div
        className="marquee overflow-hidden border-y border-line/70 bg-cream/50 py-4"
        aria-hidden="true"
      >
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex items-center">
              {Array.from({ length: 4 })
                .flatMap(() => facts)
                .map((fact, index) => (
                  <span
                    key={`${copyIndex}-${index}`}
                    className="flex items-center gap-10 px-10 text-[10.5px] tracking-[0.24em] text-ink-muted uppercase"
                  >
                    {fact}
                    <span aria-hidden="true" className="size-1 rounded-full bg-clay/40" />
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow={t.home.featuredEyebrow}
            title={t.home.featuredTitle}
            intro={t.home.featuredIntro}
            action={
              <Link
                to={path('shop')}
                className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-[12px] tracking-[0.12em] text-ink uppercase transition-colors hover:border-clay hover:text-clay"
              >
                {t.home.featuredCta}
                <ArrowRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            }
          />

          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>

          {showcase.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
              <p className="font-serif text-xl text-ink">{t.shop.emptyCatalogTitle}</p>
              <p className="mt-2 text-sm">{t.shop.emptyCatalogText}</p>
            </div>
          )}
        </Container>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="border-y border-line/60 bg-cream/55 py-20 md:py-28">
        <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow={t.home.processEyebrow}
            title={t.home.processTitle}
            intro={t.home.processIntro}
          />

          <ol className="border-t border-line/80">
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-4 border-b border-line/80 py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-8"
              >
                <span className="font-serif text-[26px] leading-none text-clay">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[21px]">{step.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-7">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ============ CUSTOM ORDER PROMOTION ============ */}
      <section className="relative overflow-hidden bg-ink py-20 text-ivory md:py-24">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-24 size-[30rem] rounded-full border border-ivory/10"
        />
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-8 size-[22rem] rounded-full border border-ivory/10"
        />
        <Container className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Reveal>
            <Eyebrow tone="light">{t.home.customEyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,4.2vw,3.2rem)] leading-[1.06] text-ivory">
              {t.home.customTitle}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-ivory/70">{t.home.customText}</p>
          </Reveal>

          <Reveal className="flex flex-col items-start gap-4 lg:items-end" delay={120}>
            <Link to={path('customOrder')} className={buttonClass('light', 'lg')}>
              {t.home.customCta}
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
            </Link>
            <p className="max-w-xs text-[11px] leading-5 text-ivory/50 lg:text-right">
              {t.home.customNote}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ============ INSTAGRAM ============ */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow={t.home.instagramEyebrow}
            title={t.home.instagramTitle}
            intro={t.home.instagramText}
            action={
              instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass('secondary', 'md')}
                >
                  <Instagram aria-hidden="true" size={16} strokeWidth={1.7} />
                  {t.home.instagramCta}
                </a>
              ) : (
                <p className="max-w-xs text-[11px] leading-5 text-ink-muted">
                  {t.home.instagramUnconfigured}
                </p>
              )
            }
          />

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {showcase.map((product) => {
              const image = product.images[0]
              const tile = (
                <div className="group relative overflow-hidden rounded-[1.3rem] bg-cream">
                  <img
                    src={image.src}
                    alt={image.alt[locale]}
                    width={1000}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {instagramUrl && (
                    <span
                      aria-hidden="true"
                      className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <ArrowUpRight size={16} strokeWidth={1.7} />
                    </span>
                  )}
                </div>
              )

              return instagramUrl ? (
                <a
                  key={product.slug}
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.home.instagramCta} — ${product.name[locale]}`}
                  className="focus-visible:rounded-[1.3rem]"
                >
                  {tile}
                </a>
              ) : (
                <div key={product.slug}>{tile}</div>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}
