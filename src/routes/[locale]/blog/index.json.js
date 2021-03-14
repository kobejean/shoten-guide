import * as POSTS from './_posts'
import {
  SUPPORTED_LOCALE,
  FALLBACK_LOCAL,
} from '../../../services/i18n/constants'

const lookup = new Map()
SUPPORTED_LOCALE.forEach(locale => {
  const posts = POSTS[locale] || []

  const contents = JSON.stringify(
    posts.map(post => {
      return {
        title: post.title,
        slug: post.slug,
      }
    })
  )
  lookup.set(locale, contents)
})

function lookupContents(locale) {
  return lookup.get(locale) || lookup.get(FALLBACK_LOCAL)
}

export function get(req, res) {
  const { locale } = req.params
  res.writeHead(200, {
    'Content-Type': 'application/json',
  })

  const contents = lookupContents(locale)
  res.end(contents)
}
