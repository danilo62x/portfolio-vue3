import { createI18n } from 'vue-i18n'

import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'
import es from './locales/es.json'

export const LANGUAGES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

type Messages = { [key: string]: string | Messages }

/**
 * The locale files are shared byte-for-byte with the other framework builds,
 * which use the i18next `{{name}}` placeholder syntax. vue-i18n expects
 * `{name}`, so normalize the delimiters once at boot.
 */
function normalize(node: Messages): Messages {
  const out: Messages = {}
  for (const [key, value] of Object.entries(node)) {
    out[key] = typeof value === 'string' ? value.replace(/\{\{\s*(\w+)\s*\}\}/g, '{$1}') : normalize(value)
  }
  return out
}

const stored = localStorage.getItem('lang')
const browser = navigator.language
const initial =
  stored ?? (LANGUAGES.find((l) => l.code === browser)?.code ?? (browser.startsWith('pt') ? 'pt-BR' : 'pt-BR'))

const i18n = createI18n({
  legacy: false,
  locale: initial,
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': normalize(ptBR as Messages),
    en: normalize(en as Messages),
    es: normalize(es as Messages),
  },
})

export function setLanguage(code: LanguageCode) {
  i18n.global.locale.value = code
  localStorage.setItem('lang', code)
  document.documentElement.lang = code
}

export default i18n
