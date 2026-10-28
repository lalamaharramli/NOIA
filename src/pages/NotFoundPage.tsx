import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { buttonClass } from '../components/ui/buttonClasses'
import { useLocale } from '../i18n/locale-context'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFoundPage() {
  const { t, path } = useLocale()

  usePageMeta({
    title: t.meta.notFound.title,
    description: t.meta.notFound.description,
    path: path('home'),
    noIndex: true,
  })

  return (
    <Container>
      <div className="flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-6 max-w-xl text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05]">
          {t.notFound.title}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-7">{t.notFound.text}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to={path('home')} className={buttonClass('primary', 'md')}>
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.7} />
            {t.notFound.cta}
          </Link>
          <Link to={path('shop')} className={buttonClass('secondary', 'md')}>
            {t.notFound.secondary}
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </Container>
  )
}
