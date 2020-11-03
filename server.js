import express from 'express'
import mapkitTokenRequestHandler from './routes/jwt/mapkit-token/mapkitTokenRequestHandler.js'
import appRequestHandler from './routes/appRequestHandler.js'

const server = express()

// static paths
server.use(express.static('public'))
server.use(express.static('lang'))

// services
server.get('/services/jwt/mapkit-token', mapkitTokenRequestHandler)

// all other routes map to svelte
server.get('*', appRequestHandler)

const port = 3000
server.listen(port, () => console.log(`Listening on port ${port}`))
