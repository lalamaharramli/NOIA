import { useState } from 'react'
import { useLocale } from '../../i18n/locale-context'
import { cn } from '../../lib/cn'
import type { ProductImage } from '../../types/product'

/** Large image with thumbnails. Clicking a thumbnail changes the main image. */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const { t, locale } = useLocale()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? images[0]

  if (!activeImage) return null

  return (
    <div>
      <div className="overflow-hidden rounded-[1.75rem] border border-line/60 bg-cream">
        <img
          src={activeImage.src}
          alt={activeImage.alt[locale]}
          width={1000}
          height={1250}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="mt-3 grid grid-cols-4 gap-3"
          role="group"
          aria-label={t.product.galleryLabel}
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${t.product.galleryLabel} ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                'overflow-hidden rounded-xl border transition-colors',
                index === activeIndex ? 'border-clay' : 'border-transparent hover:border-line',
              )}
            >
              <img
                src={image.src}
                alt=""
                width={1000}
                height={1250}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
