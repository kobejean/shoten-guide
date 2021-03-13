import root from './_data'

export function get(req, res) {
  let { locale, path } = req.params
  path = (path && path.filter(seg => !!seg)) || []

  const data = root.getSummary(locale, path)

  if (data) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })

    res.end(JSON.stringify({ data }))
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
