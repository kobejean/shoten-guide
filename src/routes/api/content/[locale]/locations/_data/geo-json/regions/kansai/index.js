import hyogo from './hyogo.geojson'
import kyotoPrefecture from './kyoto-prefecture.geojson'
import mie from './mie.geojson'
import nara from './nara.geojson'
import osakaPrefecture from './osaka-prefecture.geojson'
import shiga from './shiga.geojson'
import wakayamaPrefecture from './wakayama-prefecture.geojson'

export default [
  shiga,
  kyotoPrefecture,
  mie,
  nara,
  wakayamaPrefecture,
  osakaPrefecture,
  hyogo,
].flatMap(data => data.features)
