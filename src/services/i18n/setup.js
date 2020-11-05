import { get } from 'svelte/store'
import { locale as localeStore, init, locales } from 'svelte-i18n'
import {
  SUPPORTED_LOCALE,
  LOCALE_IMPORTS,
  FALLBACK_LOCAL,
} from './constants.js'

let hasPreloaded = false

const preloadLanguageData = locale => {
  if (hasPreloaded) return
  hasPreloaded = true
  if (typeof window === 'undefined') {
    // server side preloading
    console.log('Preloading language data...')
    SUPPORTED_LOCALE.forEach(_locale => localeStore.set(_locale))
  } else {
    // client side preloading
    // LOCALE_IMPORTS[locale]() // prioritize initial locale
    // Object.values(LOCALE_IMPORTS).forEach((importFunction) => importFunction())
  }
}

export const setLocale = async (preloadMethods, page, session) => {
  const currentLocale = get(localeStore)
  const { locale } = page.params

  preloadLanguageData(locale)

  if (!SUPPORTED_LOCALE.has(locale)) {
    preloadMethods.error(404, 'Not found')
  }

  if (!currentLocale) {
    // if locale is currently null
    init({ fallbackLocale: FALLBACK_LOCAL, initialLocale: locale })
  } else if (currentLocale !== locale) {
    // if locale has changed
    localeStore.set(locale)
  }
}
