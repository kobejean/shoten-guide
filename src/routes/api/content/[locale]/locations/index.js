import root from './_data'

export function get(req, res) {
  let { locale } = req.params
  const path = []

  const locations = root.getPathSummary(locale, path)

  if (locations) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })

    res.end(JSON.stringify({ locations }))
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
