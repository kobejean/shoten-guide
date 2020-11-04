import { getServerSideI18nInitialization } from '../src/services/i18n/initialization.js'
import app from '../public/App.js'

/**
 * Handles the requests for fetching mapkit json tokens.
 */
export default (req, res) => {
  const serverInit = getServerSideI18nInitialization(req)
  const { html } = app.render({ serverInit })

  res.type('html')
  res.write(`
  <!DOCTYPE html>
  <html lang="${serverInit.locale}">
    <head>
      <link rel='stylesheet' href='/module/bundle.css'>
      <link rel="icon" href="data:,">
    </head>
    <body id="app">
      ${html}
      <script type="module" src="/module/main.js"></script>
      <script nomodule src="/nomodule/main.js"></script>
    <body>
  </html>
    `)

  res.end()
}
