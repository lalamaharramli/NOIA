import { ArrowLeft, ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { CopyButton } from '../components/ui/CopyButton'
import { Eyebrow } from '../components/ui/Eyebrow'
import { buttonClass } from '../components/ui/buttonClasses'
import { Badge } from '../components/ui/buttonStyles'
import { siteConfig } from '../config/site'
import { ProductCard } from '../features/products/ProductCard'
import { AvailabilityBadge } from '../features/products/AvailabilityBadge'
import { ProductGallery } from '../features/products/ProductGallery'
import { useLocale } from '../i18n/locale-context'
import { formatPrice } from '../lib/format'
import { buildProductEmailSubject, buildProductInquiryMessage } from '../lib/inquiry'
import { getMailtoUrl, getWhatsAppUrl } from '../lib/links'
import { findProductBySlug, getRelatedProducts } from '../lib/products'
import { usePageMeta } from '../lib/usePageMeta'
import type { Product, ProductSelections } from '../types/product'
import { cn } from '../lib/cn'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = findProductBySlug(slug)

  if (!product) return <MissingProduct />
  // `key` resets the selected options when navigating between products.
  return <ProductDetail key={product.slug} product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const { t, locale, path } = useLocale()

  const productPath = path('product', { slug: product.slug })
  const productUrl = `${siteConfig.url}${productPath}`

  usePageMeta({
    title: `${product.name[locale]} — NOIA`,
    description: product.shortDescription[locale],
    path: productPath,
    // usePageMeta ignores SVG here, so placeholder artwork falls back to the
    // branded PNG. Real JPEG/WebP product photos will be used automatically.
    image: product.images[0]?.src,
  })

  const relatedProducts = getRelatedProducts(product)

  return (
    <>
      <Container className="pt-8 md:pt-12">
        <Link
          to={path('shop')}
          className="inline-flex items-center gap-2 text-[10.5px] tracking-[0.16em] text-ink-muted uppercase transition-colors hover:text-clay"
        >
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.7} />
          {t.product.back}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>{t.categories[product.category]}</Eyebrow>
              {siteConfig.showExampleNotice && <Badge tone="muted">{t.common.exampleBadge}</Badge>}
            </div>

            <h1 className="mt-5 text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.03] tracking-[-0.03em]">
              {product.name[locale]}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-8">
              {product.shortDescription[locale]}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-line/70 py-4">
              <div>
                <p className="text-[9.5px] tracking-[0.18em] text-ink-muted uppercase">
                  {t.product.priceLabel}
                </p>
                <p className="mt-1 font-serif text-2xl text-ink">
                  {product.priceAzn === null
                    ? t.common.priceOnRequest
                    : formatPrice(product.priceAzn, locale)}
                </p>
              </div>
              <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />
              <AvailabilityBadge status={product.availability} />
            </div>

            <ProductOrderPanel product={product} productUrl={productUrl} />

            <div className="mt-10 space-y-8 border-t border-line/70 pt-8">
              <section>
                <h2 className="text-[21px]">{t.product.aboutTitle}</h2>
                <p className="mt-3 text-sm leading-7">{product.description[locale]}</p>
              </section>

              <dl className="grid gap-x-8 gap-y-5 border-t border-line/60 pt-6 sm:grid-cols-2">
                <div>
                  <dt className="text-[9.5px] tracking-[0.18em] text-ink-muted uppercase">
                    {t.product.materialsLabel}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-6">{product.materials[locale]}</dd>
                </div>
                <div>
                  <dt className="text-[9.5px] tracking-[0.18em] text-ink-muted uppercase">
                    {t.product.careLabel}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-6">{product.care[locale]}</dd>
                </div>
              </dl>

              <section className="rounded-2xl bg-cream/60 px-5 py-5">
                <h2 className="text-lg">{t.product.handmadeTitle}</h2>
                <p className="mt-2 text-[13px] leading-7">{t.product.handmadeText}</p>
              </section>
            </div>
          </div>
        </div>
      </Container>

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-line/60 bg-cream/40 py-16 md:py-20">
          <Container>
            <h2 className="text-[clamp(1.7rem,3vw,2.25rem)]">{t.product.relatedTitle}</h2>
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related, index) => (
                <ProductCard key={related.slug} product={related} index={index} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}

/**
 * Options + inquiry actions.
 * Selecting an option updates the prepared message, so the visitor sees
 * exactly what will be sent before opening WhatsApp or their e-mail app.
 */
function ProductOrderPanel({ product, productUrl }: { product: Product; productUrl: string }) {
  const { t, locale, path } = useLocale()

  const [selections, setSelections] = useState<ProductSelections>(() =>
    Object.fromEntries(
      (product.options ?? []).map((option) => [option.id, option.values[0]?.id ?? '']),
    ),
  )

  const message = buildProductInquiryMessage(product, selections, t.inquiry, locale, productUrl)
  const whatsappUrl = getWhatsAppUrl(message)
  const mailtoUrl = getMailtoUrl(buildProductEmailSubject(product, t.inquiry, locale), message)

  return (
    <section className="mt-8 rounded-2xl border border-line/80 bg-cream/35 px-5 py-6">
      <h2 className="text-[21px]">{t.product.orderTitle}</h2>
      <p className="mt-2 text-[13px] leading-6 text-ink-muted">{t.product.orderText}</p>

      {product.availability === 'sold-out' && (
        <p className="mt-4 rounded-xl bg-ivory/80 px-4 py-3 text-[12.5px] leading-6">
          {t.product.soldOutNote}
        </p>
      )}

      {(product.options ?? []).length > 0 && (
        <div className="mt-6 space-y-5">
          {(product.options ?? []).map((option) => (
            <fieldset key={option.id}>
              <legend className="text-[9.5px] tracking-[0.18em] text-ink-muted uppercase">
                {option.label[locale]}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selections[option.id] === value.id

                  return (
                    <label
                      key={value.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-clay',
                        isSelected
                          ? 'border-ink bg-ivory text-ink'
                          : 'border-line text-ink-soft hover:border-ink/40',
                      )}
                    >
                      <input
                        type="radio"
                        name={`option-${option.id}`}
                        value={value.id}
                        checked={isSelected}
                        onChange={() =>
                          setSelections((current) => ({ ...current, [option.id]: value.id }))
                        }
                        className="sr-only"
                      />
                      {value.swatch && (
                        <span
                          aria-hidden="true"
                          className="size-3 rounded-full border border-ink/15"
                          style={{ backgroundColor: value.swatch }}
                        />
                      )}
                      {value.label[locale]}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2.5">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('primary', 'md')}
          >
            <MessageCircle aria-hidden="true" size={16} strokeWidth={1.8} />
            {t.product.inquiryWhatsApp}
          </a>
        )}
        {mailtoUrl && (
          <a href={mailtoUrl} className={buttonClass('secondary', 'md')}>
            <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
            {t.product.inquiryEmail}
          </a>
        )}
        <CopyButton text={message} label={t.product.copyInquiry} />
      </div>

      {!whatsappUrl && !mailtoUrl && (
        <p className="mt-4 text-[12px] leading-6 text-ink-muted">{t.product.noChannels}</p>
      )}

      <details className="mt-5 border-t border-line/60 pt-4">
        <summary className="cursor-pointer text-[10px] tracking-[0.16em] text-ink-muted uppercase transition-colors hover:text-clay">
          {t.customOrder.previewTitle}
        </summary>
        <pre className="mt-3 font-sans text-[12.5px] leading-6 whitespace-pre-wrap text-ink-soft">
          {message}
        </pre>
      </details>

      <Link
        to={path('customOrder', { query: { product: product.slug } })}
        className="group mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.14em] text-clay uppercase"
      >
        {t.product.customise}
        <ArrowRight
          aria-hidden="true"
          size={14}
          strokeWidth={1.8}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </section>
  )
}

function MissingProduct() {
  const { t, path } = useLocale()

  usePageMeta({
    title: `${t.product.notFoundTitle} — NOIA`,
    description: t.product.notFoundText,
    path: path('shop'),
    noIndex: true,
  })

  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <Eyebrow>{t.shop.eyebrow}</Eyebrow>
        <h1 className="mt-5 text-4xl">{t.product.notFoundTitle}</h1>
        <p className="mt-4 max-w-md text-sm leading-7">{t.product.notFoundText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={path('shop')} className={buttonClass('primary', 'md')}>
            {t.product.back}
          </Link>
          <Link to={path('home')} className={buttonClass('secondary', 'md')}>
            {t.notFound.cta}
          </Link>
        </div>
      </div>
    </Container>
  )
}
