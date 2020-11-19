import root from './_data'
import { FALLBACK_LOCAL } from '../../../services/i18n/constants'

function getLocationInfo(locale, path) {
  let node = root
  for (var i = 0; i < path.length; i++) {
    const next = node.items[path[i]]
    if (next) {
      node = next
    } else {
      return null
    }
  }
  return node.stringify(locale, FALLBACK_LOCAL)
}

export function get(req, res) {
  const { slug } = req.params
  const { locale } = req.query
  const path = slug.filter(id => id)

  const result = getLocationInfo(locale, path)

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
