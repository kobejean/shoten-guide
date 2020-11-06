import jwt from 'jsonwebtoken'

// Constants
const HEADER = {
  alg: 'ES256',
  typ: 'JWT',
  kid: 'X9R5252D97',
}

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
  const token = jwt.sign(payload, process.env.MAPKIT_SERCET, { header: HEADER })

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })
  res.end(JSON.stringify({ token }))
}
