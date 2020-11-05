import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import mapkitTokenRequestHandler from './api/jwt/mapkit-token/mapkitTokenRequestHandler.js'
import { i18nMiddleware } from './services/i18n/middleware.js'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const server = polka()
// services
server.get('/api/jwt/mapkit-token', mapkitTokenRequestHandler)

// sapper
server
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    i18nMiddleware,
    sapper.middleware({
      session: (req, res) => ({ locale: req.locale }),
    })
  )
  .listen(PORT, err => {
    if (err) console.log('error', err)
  })
