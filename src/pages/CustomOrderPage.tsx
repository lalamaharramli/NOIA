import { ArrowRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/SectionHeading'
import { InquiryForm } from '../features/custom-order/InquiryForm'
import { useLocale } from '../i18n/locale-context'
import { fillTemplate } from '../lib/format'
import { findProductBySlug } from '../lib/products'
import { usePageMeta } from '../lib/usePageMeta'

export default function CustomOrderPage() {
  const { t, locale, path } = useLocale()
  const [searchParams] = useSearchParams()

  // Product detail pages link here with ?product=<slug> to pre-fill the form.
  const initialProduct = findProductBySlug(searchParams.get('product') ?? undefined)

  usePageMeta({
    title: t.meta.customOrder.title,
    description: t.meta.customOrder.description,
    path: path('customOrder'),
  })

  const steps = [
    { title: t.customOrder.step1Title, text: t.customOrder.step1Text },
    { title: t.customOrder.step2Title, text: t.customOrder.step2Text },
    { title: t.customOrder.step3Title, text: t.customOrder.step3Text },
  ]

  return (
    <>
      <PageHeader
        eyebrow={t.customOrder.eyebrow}
        title={t.customOrder.title}
        intro={t.customOrder.intro}
      />

      <Container className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            {initialProduct && (
              <div className="mb-5 rounded-xl border border-clay/25 bg-cream/50 px-4 py-3 text-[12.5px] leading-6">
                <p>
                  {fillTemplate(t.customOrder.prefillNotice, {
                    product: initialProduct.name[locale],
                  })}{' '}
                  <Link
                    to={path('product', { slug: initialProduct.slug })}
                    className="inline-flex items-center gap-1 text-clay underline underline-offset-2 hover:text-ink"
                  >
                    {t.product.back}
                    <ArrowRight aria-hidden="true" size={12} strokeWidth={1.8} />
                  </Link>
                </p>
              </div>
            )}

            <InquiryForm initialProduct={initialProduct} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-line/70 bg-cream/45 px-6 py-6">
              <h2 className="text-xl">{t.customOrder.stepsTitle}</h2>
              <ol className="mt-5 space-y-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-serif text-[18px] leading-none text-clay">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[15px]">{step.title}</h3>
                      <p className="mt-1 text-[12.5px] leading-6">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 text-[11.5px] leading-6 text-ink-muted">{t.home.customNote}</p>

            <Link
              to={path('contact')}
              className="group mt-4 inline-flex items-center gap-2 text-[10.5px] tracking-[0.14em] text-clay uppercase"
            >
              {t.nav.contact}
              <ArrowRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </aside>
        </div>
      </Container>
    </>
  )
}
