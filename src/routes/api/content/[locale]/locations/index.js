import root from './_data'

export async function get(req, res) {
  let { locale } = req.params
  const path = []

  const data = (await root).getSummary(locale, path)

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
