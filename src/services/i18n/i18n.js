import {
    register,
    locale,
    init,
    dictionary,
    _,
    isLoading,
} from "svelte-i18n"
import { derived, writable } from 'svelte/store'
import { navigate } from "svelte-routing"
import { getInitialLocale, FALLBACK_LOCAL } from './serverSideData'

const LOCALE_PATHNAME_REPLACE_REGEX = /^.+?([/]|$)/

// register languages
register('en', () => import(`../../../lang/en.json`))
register('ja', () => import(`../../../lang/ja.json`))
register('ko', () => import(`../../../lang/ko.json`))

let currentDictionary = {}
dictionary.subscribe(newDictionary => currentDictionary = newDictionary)

export const setupI18n = (serverInit) => {
    if (serverInit && serverInit.pathname && typeof window === 'undefined') serverSidePathname.set(serverInit.pathname)
    const initialLocale = (serverInit && serverInit.locale) || getInitialLocale()
    init({ initialLocale, fallbackLocale: FALLBACK_LOCAL })
    console.log('initialLocale', initialLocale)
}

export const isLoadingLocale = derived([isLoading, locale, dictionary], ([$isLoading, $locale, $dictionary]) => {
    return typeof $locale !== 'string' || $isLoading || !$dictionary || !$dictionary[$locale]
})

// helpers

export const relativePath = (fromPath, toPath) => {
    if (!fromPath || fromPath === '/' || fromPath === '') return toPath

    let extraSlashesCount = 0
    if (fromPath.slice(0, 1) === '/') extraSlashesCount += 1
    if (fromPath.slice(-1) === '/') extraSlashesCount += 1
    const dirCount = fromPath.split('/').length - extraSlashesCount
    return '../'.repeat(dirCount) + toPath
}

export const relativePathToReplaceLocale = (fromPath, locale) => {
    const newPath = fromPath.replace(LOCALE_PATHNAME_REPLACE_REGEX, locale + '/')
    return relativePath(fromPath, newPath)
}

let currentSrverSidePathname
export const serverSidePathname = writable()
serverSidePathname.subscribe(newPath => currentSrverSidePathname = newPath)

const getPathname = () => (typeof window !== 'undefined' && location.pathname) || currentSrverSidePathname

locale.subscribe(newLocale => {
    const pathname = getPathname()
    console.log('newLocale', pathname, newLocale)
    if (newLocale) {
        console.log('pathname', pathname, newLocale)
        const newPath = relativePathToReplaceLocale(pathname, newLocale)
        navigate(newPath, { replace: false })

        if (typeof window === 'undefined') {
            serverSidePathname.set(newPath)
        }
    }
})