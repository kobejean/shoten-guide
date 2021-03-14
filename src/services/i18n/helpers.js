/** @module services/i18n/helpers */
import { derived } from 'svelte/store'
import { locale, dictionary } from 'svelte-i18n'

export const isLocaleLoaded = derived(
  [locale, dictionary],
  ([$locale, $dictionary]) => $locale && $dictionary[$locale]
)
