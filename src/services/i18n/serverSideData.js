import { FALLBACK_LOCAL, SUPPORTED_LOCALE } from './localeDefinition.js'
const LOCALE_PATHNAME_REGEX = /^\/(.*?)([/]|$)/

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

const getClientPathname = () => typeof window !== 'undefined' && location.pathname
const getServerPathname = req => req && req.url
const getPathname = req => getClientPathname() || getServerPathname(req)

const getClientAcceptedLanguage  = () => typeof window !== 'undefined' && (navigator.language || navigator.userLanguage)
const getServerAcceptedLanguage = req => req && req.headers["accept-language"]
const getAcceptedLanguage = req => getClientAcceptedLanguage() || getServerAcceptedLanguage(req)

export const getInitialLocale = (req) => {
    const pathname = getPathname(req)
    const acceptedlanguage = getAcceptedLanguage(req)
    return getAvailableLocaleFromPathname(pathname) || getAvailableLocaleFromNavigator(acceptedlanguage) || FALLBACK_LOCAL
}

export const getServerSideI18nInitialization = (req) => {
    const locale = getInitialLocale(req)
    return {
        pathname: req.url,
        locale
    }
}