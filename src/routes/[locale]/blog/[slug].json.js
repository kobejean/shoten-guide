import * as POSTS from './_posts'
import {
  SUPPORTED_LOCALE,
  FALLBACK_LOCAL,
} from '../../../services/i18n/constants'

const lookup = new Map()
SUPPORTED_LOCALE.forEach(locale => {
  const posts = POSTS[locale] || []
  posts.forEach(post => {
    lookup.set(`${locale}/${post.slug}`, JSON.stringify(post))
  })
})

function lookupPost(locale, slug) {
  return (
    lookup.get(`${locale}/${slug}`) || lookup.get(`${FALLBACK_LOCAL}/${slug}`)
  )
}

export function get(req, res, next) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { locale, slug } = req.params
  const result = lookupPost(locale, slug)

  if (result) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })

    res.end(result)
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    })

    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    )
  }
}
