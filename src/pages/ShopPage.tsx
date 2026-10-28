import { Search, SearchX, X } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/SectionHeading'
import { Container } from '../components/ui/Container'
import { buttonClass } from '../components/ui/buttonClasses'
import { products } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { fillTemplate } from '../lib/format'
import { filterProducts, isCategoryId, type CategoryFilter } from '../lib/products'
import { usePageMeta } from '../lib/usePageMeta'
import { CATEGORY_IDS } from '../types/product'
import { ProductCard } from '../features/products/ProductCard'
import { cn } from '../lib/cn'

export default function ShopPage() {
  const { t, locale, path } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()

  usePageMeta({
    title: t.meta.shop.title,
    description: t.meta.shop.description,
    path: path('shop'),
  })

  const search = searchParams.get('q') ?? ''
  const categoryParam = searchParams.get('category')
  const category: CategoryFilter = isCategoryId(categoryParam) ? categoryParam : 'all'

  const visibleProducts = useMemo(
    () => filterProducts(products, { search, category }, locale),
    [search, category, locale],
  )

  /** Writes filters into the URL so the view can be shared or bookmarked. */
  function updateFilters(changes: { search?: string; category?: CategoryFilter }) {
    const nextSearch = changes.search ?? search
    const nextCategory = changes.category ?? category
    const nextParams = new URLSearchParams(searchParams)

    if (nextSearch.trim()) nextParams.set('q', nextSearch.trim())
    else nextParams.delete('q')

    if (nextCategory !== 'all') nextParams.set('category', nextCategory)
    else nextParams.delete('category')

    setSearchParams(nextParams, { replace: true })
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const categoryOptions: Array<{ id: CategoryFilter; label: string }> = [
    { id: 'all', label: t.shop.all },
    ...CATEGORY_IDS.map((id) => ({ id, label: t.categories[id] })),
  ]

  return (
    <>
      <PageHeader eyebrow={t.shop.eyebrow} title={t.shop.title} intro={t.shop.intro} />

      <Container className="py-10 md:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="product-search" className="sr-only">
              {t.shop.searchLabel}
            </label>
            <Search
              aria-hidden="true"
              size={17}
              strokeWidth={1.7}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => updateFilters({ search: event.target.value })}
              placeholder={t.shop.searchPlaceholder}
              className="h-12 w-full rounded-full border border-line bg-cream/40 pr-11 pl-11 text-sm text-ink placeholder:text-ink-muted focus:border-clay focus:ring-2 focus:ring-clay/15 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => updateFilters({ search: '' })}
                aria-label={t.shop.clearSearch}
                className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
              >
                <X aria-hidden="true" size={16} strokeWidth={1.8} />
              </button>
            )}
          </div>

          <div role="group" aria-label={t.shop.filterLabel} className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => {
              const isActive = option.id === category

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => updateFilters({ category: option.id })}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[12px] transition-colors',
                    isActive
                      ? 'border-ink bg-ink text-ivory'
                      : 'border-line text-ink-soft hover:border-ink/40 hover:text-ink',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line/60 pb-4">
          <p
            aria-live="polite"
            className="text-[10.5px] tracking-[0.18em] text-ink-muted uppercase"
          >
            {fillTemplate(t.shop.resultsLabel, { count: visibleProducts.length })}
          </p>
          <p className="text-[11px] text-ink-muted">{t.shop.exampleNote}</p>
        </div>

        {visibleProducts.length > 0 && (
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={index}
                priority={index < 3}
                headingLevel="h2"
              />
            ))}
          </div>
        )}

        {visibleProducts.length === 0 && products.length > 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-line px-6 py-20 text-center">
            <SearchX aria-hidden="true" size={30} strokeWidth={1.4} className="mx-auto text-clay" />
            <h2 className="mt-5 text-2xl">{t.shop.emptyTitle}</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7">{t.shop.emptyText}</p>
            <button
              type="button"
              onClick={resetFilters}
              className={buttonClass('secondary', 'md', 'mt-7')}
            >
              {t.shop.resetFilters}
            </button>
          </div>
        )}

        {products.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-line px-6 py-20 text-center">
            <h2 className="text-2xl">{t.shop.emptyCatalogTitle}</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7">{t.shop.emptyCatalogText}</p>
          </div>
        )}
      </Container>
    </>
  )
}
