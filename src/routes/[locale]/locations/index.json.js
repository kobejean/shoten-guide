import root from './_data'

export function get(req, res) {
  let { locale } = req.params
  const path = []

  const data = root.getSummary(locale, path)

  if (data) {
    res.writeHead(200, {
      'Content-Type': 'application/json;charset=utf-8',
    })

    res.end(JSON.stringify({ data }))
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json;charset=utf-8',
    })

    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    )
  }
}
