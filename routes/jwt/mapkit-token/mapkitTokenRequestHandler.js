import jwt from 'jsonwebtoken'
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// Constants
const CURRENT_DIRECTORY = dirname(fileURLToPath(import.meta.url))
const HEADER = {
  alg: 'ES256',
  typ: 'JWT',
  kid: 'X9R5252D97',
}

/**
 * Handles the requests for fetching mapkit json tokens.
 */
export default (req, res) => {
  const timestamp = Date.now() / 1000
  const payload = {
    iss: 'Q74A2VY23K',
    iat: timestamp,
    exp: timestamp + 15778800,
  }
  const cert = fs.readFileSync(join(CURRENT_DIRECTORY, './private.p8'))
  const token = jwt.sign(payload, cert, { header: HEADER })
  res.json({ token })
}
