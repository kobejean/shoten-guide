import express from 'express'
import { getServerSideI18nInitialization } from './src/services/i18n/serverSideData.js'
import app from './public/App.js'

const server = express();

// static paths
server.use(express.static('public'));
server.use(express.static('lang'));

// all others map to svelte
server.get('*', function(req, res) {
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
  <body>
    <div id="app">${html}</div>
    <script type="module" src="/module/main.js"></script>
    <script nomodule src="/nomodule/main.js"></script>
  <body>
</html>
  `);

  res.end();
});

const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));