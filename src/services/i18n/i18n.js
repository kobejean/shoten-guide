import {
    locale,
    register,
    dictionary,
    isLoading,
} from 'svelte-i18n'
export { locale, _ } from 'svelte-i18n'
import { derived, writable, get } from 'svelte/store'
import { onDestroy } from 'svelte'
import { navigate, routerUtils } from 'svelte-routing'
import { getInitialLocale } from './serverSideData'
import { relativePathToReplaceLocale } from '../../utils/path'

// register languages
register('en', () => import(`../../../lang/en.json`))
register('ja', () => import(`../../../lang/ja.json`))
register('ko', () => import(`../../../lang/ko.json`))

export const setupI18n = (serverInit) => {
    const initialLocale = (serverInit && serverInit.locale) || getInitialLocale()
    locale.set(initialLocale)

    const requestPathname = writable(typeof window === 'undefined' ? serverInit.pathname : null)
    onDestroy(locale.subscribe(handleLocaleChange(requestPathname)))

    return { requestPathname, locale }
}

const handleLocaleChange = requestPathname => newLocale => {
    if (newLocale) {
        const basePath = (typeof window !== 'undefined' && location.pathname) || get(requestPathname)
        const newRelativePath = relativePathToReplaceLocale(basePath, newLocale)
        navigate(newRelativePath, { replace: false })

        if (typeof window === 'undefined') {
            requestPathname.set(routerUtils.resolve(newRelativePath, basePath))
        }
    }
}

export const isLoadingLocale = derived([isLoading, locale, dictionary], ([$isLoading, $locale, $dictionary]) => {
    return typeof $locale !== 'string' || $isLoading || !$dictionary || !$dictionary[$locale]
})
