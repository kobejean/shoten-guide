import { get } from 'svelte/store'
import { locale as localeStore, init, register } from 'svelte-i18n'
import {
  SUPPORTED_LOCALE,
  LOCALE_IMPORTS,
  FALLBACK_LOCAL,
} from './constants.js'

// register locale lifes
Object.entries(LOCALE_IMPORTS).forEach(([locale, fn]) => register(locale, fn))

let hasPreloaded = false

const preloadAllLanguageData = locale => {
  if (hasPreloaded) return

  if (typeof window === 'undefined') {
    // server side preloading
    console.log('Preloading language data...')
    SUPPORTED_LOCALE.forEach(_locale => localeStore.set(_locale))
    hasPreloaded = true
  }
}

export const preloadLocale = async (preloadMethods, page, session) => {
  const currentLocale = get(localeStore)
  const { locale } = page.params

  preloadAllLanguageData(locale)

  if (!SUPPORTED_LOCALE.has(locale)) {
    return
    // preloadMethods.error(404, 'Not found')
  }

  if (!currentLocale) {
    // if locale is currently null we probably missed initialization
    init({ fallbackLocale: FALLBACK_LOCAL, initialLocale: locale })
  }
}
