export const FALLBACK_LOCAL = 'ja'
const LOCALE_PATHNAME_REGEX = /^\/(.*?)([/]|$)/
const SUPPORTED_LOCALE = {
    en: true,
    ja: true,
    ko: true,
}

export const getServerSideI18nInitialization = (req) => {
    const locale = getInitialLocale(req)
    return {
        pathname: req.url,
        locale
    }
}

export const getAvailableLocaleFromPathname = (pathname) => {
    const match = LOCALE_PATHNAME_REGEX.exec(pathname)
    const matchedLocale = match && match[1]
    return SUPPORTED_LOCALE[matchedLocale] && matchedLocale
}

export const getAvailableLocaleFromNavigator = (lang) => {
    // just use prefix to keep simple
    lang = lang && lang.split('-')[0].toLocaleLowerCase()
    return SUPPORTED_LOCALE[lang] && lang
}

const getPathname = (req) => (typeof window !== 'undefined' && location.pathname) || (req && req.url)
const getAcceptedLanguage = (req) => (typeof window !== 'undefined' && (navigator.language || navigator.userLanguage)) || (req && req.headers["accept-language"])

export const getInitialLocale = (req) => {
    const pathname = getPathname(req)
    const acceptedlanguage = getAcceptedLanguage(req)
    return getAvailableLocaleFromPathname(pathname) || getAvailableLocaleFromNavigator(acceptedlanguage) || FALLBACK_LOCAL
}