import { FALLBACK_LOCAL, SUPPORTED_LOCALE } from './localeDefinition.js'
const LOCALE_PATHNAME_REGEX = /^\/(.*?)([/]|$)/

export const getServerSideI18nInitialization = (req) => {
    const locale = getInitialLocale(req)
    return {
        pathname: req.url,
        locale
    }
}

const getAvailableLocaleFromPathname = pathname => {
    const match = LOCALE_PATHNAME_REGEX.exec(pathname)
    const matchedLocale = match && match[1]
    return SUPPORTED_LOCALE.has(matchedLocale) && matchedLocale
}

const getAvailableLocaleFromNavigator = lang => {
    // just use prefix to keep simple
    lang = lang && lang.split('-')[0].toLocaleLowerCase()
    return SUPPORTED_LOCALE.has(lang) && lang
}

const getPathname = (req) => (typeof window !== 'undefined' && location.pathname) || (req && req.url)
const getAcceptedLanguage = (req) => (typeof window !== 'undefined' && (navigator.language || navigator.userLanguage)) || (req && req.headers["accept-language"])

export const getInitialLocale = (req) => {
    const pathname = getPathname(req)
    const acceptedlanguage = getAcceptedLanguage(req)
    return getAvailableLocaleFromPathname(pathname) || getAvailableLocaleFromNavigator(acceptedlanguage) || FALLBACK_LOCAL
}