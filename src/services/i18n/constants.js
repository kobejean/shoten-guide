export const FALLBACK_LOCAL = 'ja'

export const LOCALE_IMPORTS = {
  en: () => import(`../../../lang/en.json`),
  ja: () => import(`../../../lang/ja.json`),
  ko: () => import(`../../../lang/ko.json`),
}

export const SUPPORTED_LOCALE = new Set(Object.keys(LOCALE_IMPORTS))
