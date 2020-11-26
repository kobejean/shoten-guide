import chubu from './chubu.geojson'
import chugoku from './chugoku.geojson'
import hokkaido from './hokkaido.geojson'
import kansai from './kansai.geojson'
import kanto from './kanto.geojson'
import kyushu from './kyushu.geojson'
import shikoku from './shikoku.geojson'
import tohoku from './tohoku.geojson'

export default [
  hokkaido,
  tohoku,
  kanto,
  chubu,
  kansai,
  chugoku,
  shikoku,
  kyushu,
].flatMap(data => data.features)
