import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { useLocale } from '../../i18n/locale-context'
import { formatPrice } from '../../lib/format'
import type { Product } from '../../types/product'
import { Badge } from '../../components/ui/buttonStyles'
import { Reveal } from '../../components/ui/Reveal'
import { AvailabilityBadge } from './AvailabilityBadge'

interface ProductCardProps {
  product: Product
  /** First visible image should load eagerly for a faster largest paint. */
  priority?: boolean
  /** Staggers the reveal animation. */
  index?: number
  /**
   * Heading level for the product name. Use `h2` when the grid is a top-level
   * section (shop) and `h3` when it follows a section heading (home).
   */
  headingLevel?: 'h2' | 'h3'
}

export function ProductCard({
  product,
  priority = false,
  index = 0,
  headingLevel = 'h3',
}: ProductCardProps) {
  const { t, locale, path } = useLocale()
  const image = product.images[0]
  const Heading = headingLevel

  return (
    <Reveal delay={Math.min(index * 70, 280)} className="h-full">
      <article className="group relative h-full">
        <div className="flex h-full flex-col">
          <div className="relative overflow-hidden rounded-[1.4rem] bg-cream">
            <img
              src={image.src}
              alt={image.alt[locale]}
              width={1000}
              height={1250}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <AvailabilityBadge status={product.availability} />
              {siteConfig.showExampleNotice && <Badge tone="muted">{t.common.exampleBadge}</Badge>}
            </div>
          </div>

          <div className="mt-4 flex flex-1 flex-col border-t border-line/70 pt-4">
            <p className="text-[10px] tracking-[0.18em] text-ink-muted uppercase">
              {t.categories[product.category]}
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <Heading className="font-serif text-[20px] leading-snug text-ink">
                {product.name[locale]}
              </Heading>
              <p className="shrink-0 text-[13px] text-ink">
                {product.priceAzn === null
                  ? t.common.priceOnRequest
                  : formatPrice(product.priceAzn, locale)}
              </p>
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-ink-muted">
              {product.shortDescription[locale]}
            </p>
          </div>
        </div>

        {/*
         * The link covers the card so the whole card is clickable, but its
         * accessible name is just "View <product>". Keeping the visual text
         * outside the link avoids the screen-reader name-mismatch problem
         * while preserving a large touch target.
         */}
        <Link
          to={path('product', { slug: product.slug })}
          className="absolute inset-0 rounded-[1.4rem]"
          aria-label={t.common.viewProduct.replace('{name}', product.name[locale])}
        />
      </article>
    </Reveal>
  )
}
