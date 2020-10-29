import {
    register,
    locale,
    init,
    dictionary,
    getLocaleFromNavigator,
    _,
    isLoading,
} from "svelte-i18n"
import { derived } from 'svelte/store'
import { navigate } from "svelte-routing"

const FALLBACK_LOCAL = 'ja'
const LOCALE_PATHNAME_REGEX = /^\/(.*?)([/]|$)/
const LOCALE_PATHNAME_REPLACE_REGEX = /^.+?([/]|$)/

// register languages
register('en', () => import(`../../../lang/en.json`))
register('ja', () => import(`../../../lang/ja.json`))
register('ko', () => import(`../../../lang/ko.json`))

let currentDictionary = {}
dictionary.subscribe(newDictionary => console.log(currentDictionary = newDictionary))

export const setupI18n = async url => {
    // set initial pathname to be used when server side rendering
    if (url && url !== '') initialPathname = url

    const initialLocale = getAvailableLocaleFromPathname() || getAvailableLocaleFromNavigator() || FALLBACK_LOCAL
    init({ initialLocale, fallbackLocale: FALLBACK_LOCAL })
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

const getAvailableLocaleFromPathname = () => {
    const match = LOCALE_PATHNAME_REGEX.exec(getPathname())
    const matchedLocale = match && match[1]
    return currentDictionary[matchedLocale] && matchedLocale
}

const getAvailableLocaleFromNavigator = () => {
    const localeFromNavigator = getLocaleFromNavigator()
    // just use prefix to keep simple
    const lang = localeFromNavigator && localeFromNavigator.split('-')[0].toLocaleLowerCase()
    return currentDictionary[lang] && lang
}

let initialPathname;
const getPathname = () => (typeof window !== 'undefined' && window.location.pathname) || initialPathname

locale.subscribe(newLocale => {
    if (newLocale && getAvailableLocaleFromPathname() !== newLocale) {
        const pathname = getPathname()
        const newPath = relativePathToReplaceLocale(pathname, newLocale)
        navigate(newPath, { replace: true })
    }
})