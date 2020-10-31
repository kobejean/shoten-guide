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
import { SUPPORTED_LOCALE } from './localeDefinition'
import { relativePathToReplaceLocale } from '../../utils/path'

const IS_SERVER_SIDE = typeof window === 'undefined'

// register languages
register('en', () => import(`../../../lang/en.json`))
register('ja', () => import(`../../../lang/ja.json`))
register('ko', () => import(`../../../lang/ko.json`))

export const setupI18n = (serverInit) => {

    if (IS_SERVER_SIDE && !get(locale)) {
        // load all languages on first load
        preloadLanguageData()
    }

    const initialLocale = (serverInit && serverInit.locale) || getInitialLocale()
    locale.set(initialLocale)

    const serverStore = writable(IS_SERVER_SIDE ? serverInit : {})
    onDestroy(locale.subscribe(handleLocaleChange(serverStore)))

    return { serverStore, locale }
}

const preloadLanguageData = () => {
    if (get(locale)) return // 
    console.log('Preloading language data...')
    SUPPORTED_LOCALE.forEach(_locale => locale.set(_locale))
}

const handleLocaleChange = serverStore => newLocale => {
    if (newLocale) {
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
