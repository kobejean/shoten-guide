import jwt from 'jsonwebtoken'
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// Constants
const SERVER_DIRECTORY = dirname(fileURLToPath(import.meta.url))
const ROOT_DIRECTORY = join(SERVER_DIRECTORY, '../../../')
const HEADER = {
  alg: 'ES256',
  typ: 'JWT',
  kid: 'X9R5252D97',
}
const CERT = fs.readFileSync(join(ROOT_DIRECTORY, './certificates/mapkit.p8'))
/**
 * Handles the requests for fetching mapkit json tokens.
 */
export function get(req, res, next) {
  const timestamp = Date.now() / 1000
  const payload = {
    iss: 'Q74A2VY23K',
    iat: timestamp,
    exp: timestamp + 15778800,
  }
  const token = jwt.sign(payload, CERT, { header: HEADER })

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })
  res.end(JSON.stringify({ token }))
}
