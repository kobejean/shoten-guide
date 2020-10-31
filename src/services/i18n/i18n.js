import {
    locale,
    register,
    isLoading,
    dictionary
} from 'svelte-i18n'
export { locale, _ } from 'svelte-i18n'
import { derived, writable, get } from 'svelte/store'
import { onDestroy } from 'svelte'
import { navigate, routerUtils } from 'svelte-routing'
import { getInitialLocale } from './serverSideData'
import { SUPPORTED_LOCALE, LOCALE_IMPORTS } from './localeDefinition'
import { relativePathToReplaceLocale } from '../../utils/path'

const IS_SERVER_SIDE = typeof window === 'undefined'

// register languages
Object.entries(LOCALE_IMPORTS).forEach(([locale, importFunction]) => register(locale, importFunction))

export const setupI18n = (serverInit) => {
    // get initial locale and set it
    const initialLocale = (serverInit && serverInit.locale) || getInitialLocale()
    preloadLanguageData(initialLocale)
    locale.set(initialLocale)

    // create server store to keep a reactive/updatable store to keep track of our server side data
    const serverStore = writable(IS_SERVER_SIDE ? serverInit : {})
    // subscribe to locale to handle navigation on change
    onDestroy(locale.subscribe(handleLocaleChange(serverStore)))

    return { serverStore, locale }
}

const preloadLanguageData = initialLocale => {
    if (get(locale)) return // skip if this is not the first time

    if (IS_SERVER_SIDE) {
        // server side preloading
        console.log('Preloading language data...')
        SUPPORTED_LOCALE.forEach(_locale => locale.set(_locale))
    } else {
        // client side preloading
        LOCALE_IMPORTS[initialLocale]() // prioritize initial locale
        Object.values(LOCALE_IMPORTS).forEach((importFunction) => importFunction())
    }
}

const handleLocaleChange = serverStore => newLocale => {
    if (newLocale) {
        // create relative url to replace locale path with new locale and navigate there
        const basePath = (!IS_SERVER_SIDE && location.pathname) || get(serverStore).pathname
        const newRelativePath = relativePathToReplaceLocale(basePath, newLocale)
        navigate(newRelativePath, { replace: false })

        if (IS_SERVER_SIDE) {
            // update server store if server side
            const pathname = routerUtils.resolve(newRelativePath, basePath)
            serverStore.set({ pathname, locale: newLocale })
        }
    }
}

export const isLoadingLocale = derived([isLoading, locale], ([$isLoading, $locale]) => {
    return typeof $locale !== 'string' || $isLoading
})
