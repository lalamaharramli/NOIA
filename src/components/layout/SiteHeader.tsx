import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useLocale } from '../../i18n/locale-context'
import type { RouteKey } from '../../i18n/locales'
import { buttonClass } from '../ui/buttonClasses'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV_ITEMS: Array<{
  route: RouteKey
  labelKey: 'home' | 'shop' | 'about' | 'customOrder' | 'contact'
}> = [
  { route: 'home', labelKey: 'home' },
  { route: 'shop', labelKey: 'shop' },
  { route: 'about', labelKey: 'about' },
  { route: 'customOrder', labelKey: 'customOrder' },
  { route: 'contact', labelKey: 'contact' },
]

export function SiteHeader() {
  const { t, path } = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Escape closes the mobile menu and returns focus to its trigger.
  useEffect(() => {
    if (!isMenuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between px-5 sm:px-8 md:h-20">
        <Link
          to={path('home')}
          className="group flex flex-col leading-none"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="font-serif text-[26px] tracking-[0.3em] text-ink transition-colors group-hover:text-clay">
            NOIA
          </span>
          <span className="mt-1 text-[9px] tracking-[0.22em] text-ink-muted uppercase">
            {t.common.brandTagline}
          </span>
        </Link>

        <nav aria-label={t.common.mainNavigation} className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.route}
              to={path(item.route)}
              end={item.route === 'home'}
              className={({ isActive }) =>
                [
                  'relative py-2 text-[13px] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-clay after:transition-transform after:duration-300',
                  isActive
                    ? 'text-ink after:scale-x-100'
                    : 'text-ink-soft after:scale-x-0 hover:text-ink hover:after:scale-x-100',
                ].join(' ')
              }
            >
              {t.nav[item.labelKey]}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitcher />
          <Link to={path('customOrder')} className={buttonClass('primary', 'sm')}>
            {t.common.customOrder}
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? t.common.closeMenu : t.common.openMenu}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={22} strokeWidth={1.6} />
          ) : (
            <Menu aria-hidden="true" size={22} strokeWidth={1.6} />
          )}
        </button>
      </div>

      {/*
        The mobile menu is a disclosure panel, not a modal: it pushes content
        down, keeps normal tab order and needs no focus trap.
      */}
      <div
        id="mobile-menu"
        hidden={!isMenuOpen}
        className="border-t border-line/60 bg-ivory lg:hidden"
      >
        <nav aria-label={t.common.mainNavigation} className="px-5 pt-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.route}
              to={path(item.route)}
              end={item.route === 'home'}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                [
                  'block border-b border-line/50 py-4 font-serif text-[19px]',
                  isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                ].join(' ')
              }
            >
              {t.nav[item.labelKey]}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
          <LanguageSwitcher onNavigate={() => setIsMenuOpen(false)} />
          <Link
            to={path('customOrder')}
            onClick={() => setIsMenuOpen(false)}
            className={buttonClass('primary', 'sm')}
          >
            {t.common.customOrder}
          </Link>
        </div>
      </div>
    </header>
  )
}
