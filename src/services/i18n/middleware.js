import { getInitialLocale } from './initialization.js'

// currently we have to use a hacky monkey patching solution to replacing the lang attribute with correct locale
export const i18nMiddleware = (req, res, next) => {
  let resEnd = res.end
  res.end = function () {
    let body = arguments[0]
    if (typeof body === 'string') {
      const initialLocale = getInitialLocale(req)
      body = body.replace('%sapper.locale%', initialLocale)
      arguments[0] = body
    }
    resEnd.call(this, ...arguments)
  }
  next()
}
