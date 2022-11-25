// import fetch from 'node-fetch'
import { SHOTEN_GUIDE_PROD } from '../constants/domains'
import { SUPPORTED_LOCALE } from '../services/i18n/constants'
import * as POSTS from './[locale]/blog/_posts'
import { forEach } from 'lodash-es'

const prefixPathsWithLocale = paths => {
  const prefixed = []
  SUPPORTED_LOCALE.forEach(locale => {
    paths.forEach(path => prefixed.push(`/${locale}${path}`))
  })
  return prefixed
}
const STATIC_PATHS = (() => {
  const paths = prefixPathsWithLocale(['/', '/about/', '/blog/', '/locations/'])
  // blog paths
  forEach(POSTS, (posts, locale) => {
    forEach(posts, post => paths.push(`/${locale}/blog/${post.slug}/`))
  })
  return paths
})()

const getSiteMap = paths => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
  .map(
    path => `
  <url>
    <loc>https://${SHOTEN_GUIDE_PROD}${path}</loc>
  </url>`
  )
  .join('')}
</urlset>
`

// const getEventPaths = async () => {
//   const { future, past } = await getCallendarEvents(fetch)
//   if (future.status === 200 && past.status === 200) {
//     const futureData = await future.json()
//     const pastData = await past.json()
//     const events = pastData.items.concat(futureData.items).reverse()
//     const pathWithoutLocale = events.map(({ id }) => `/events/${id}/`)
//     return prefixPathsWithLocale(pathWithoutLocale)
//   }
//   return []
// }

export async function get(req, res) {
  res.setHeader('Content-Type', 'application/xml')

  let paths = STATIC_PATHS //.concat(await getEventPaths())
  const xml = getSiteMap(paths)
  res.end(xml)
}
