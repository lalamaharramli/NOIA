import { az, type Translation } from './az'
import { en } from './en'
import { ru } from './ru'

/**
 * One dictionary per language. To add a language:
 * 1. Copy az.ts, translate it and import it here.
 * 2. Add the locale to LOCALES and the route segments in src/i18n/locales.ts.
 */
export const translations = { az, en, ru } satisfies Record<'az' | 'en' | 'ru', Translation>

export type { Translation } from './az'
