export const FALLBACK_LOCAL = 'ja'

export const LOCALE_IMPORTS = {
  en: () => import(`./locale/en.json`),
  ja: () => import(`./locale/ja.json`),
  ko: () => import(`./locale/ko.json`),
}

export const SUPPORTED_LOCALE = new Set(Object.keys(LOCALE_IMPORTS))
