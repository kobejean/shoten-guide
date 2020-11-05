import { getInitialLocale } from './initialization.js'
import { FALLBACK_LOCAL } from './constants'
import { locale as localeStore, init, locales } from 'svelte-i18n'

const DOCUMENT_REGEX = /^([^.?#@]+)?([?#](.+)?)?$/
// currently we have to use a hacky monkey patching solution to replacing the lang attribute with correct locale
export const i18nMiddleware = (req, res, next) => {
  if (!DOCUMENT_REGEX.test(req.originalUrl)) {
    next() // skip resource files
    return
  }
  req.locale = getInitialLocale(req)

  let resEnd = res.end
  res.end = function () {
    let body = arguments[0]
    if (typeof body === 'string') {
      body = body.replace('%sapper.locale%', req.locale)
      arguments[0] = body
    }
    resEnd.call(this, ...arguments)
  }
  next()
}
