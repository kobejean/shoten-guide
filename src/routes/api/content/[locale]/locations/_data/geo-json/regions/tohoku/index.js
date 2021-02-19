import akita from './akita.geojson'
import aomori from './aomori.geojson'
import fukushima from './fukushima.geojson'
import iwate from './iwate.geojson'
import miyagi from './miyagi.geojson'
import yamagata from './yamagata.geojson'

export default [aomori, iwate, akita, miyagi, yamagata, fukushima].flatMap(
  data => data.features
)
