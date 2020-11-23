import * as sapper from '@sapper/app'
import { getInitialLocale } from './services/i18n/initialization.js'
import { FALLBACK_LOCAL } from './services/i18n/constants.js'
import { init } from 'svelte-i18n'

console.log('client js')
// initialize svelte-i18n as soon as possible to prevent flickering
init({
  fallbackLocale: FALLBACK_LOCAL,
  initialLocale: getInitialLocale(),
})

sapper.start({
  target: document.querySelector('#sapper'),
})
