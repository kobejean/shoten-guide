import root from './_data'
import { FALLBACK_LOCAL } from '../../../services/i18n/constants'

function getLocationInfo(locale) {
  return root.stringify(locale, FALLBACK_LOCAL)
}

export function get(req, res) {
  const { locale } = req.query

  const result = getLocationInfo(locale)

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
