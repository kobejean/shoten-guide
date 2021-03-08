import Coordinate from './classes/Coordinate'
import CoordinateRegion from './classes/CoordinateRegion'
import CoordinateSpan from './classes/CoordinateSpan'
import Localization from './classes/Localization'
import LocationNode from './classes/LocationNode'
import metadata from './geo-json/index.js'

const root = LocationNode.fromData(
  metadata,
  'locations',
  {
    en: new Localization('Japan'),
    ja: new Localization('全国'),
    ko: new Localization('일본'),
  },
  new CoordinateRegion(
    new Coordinate(37.998915, 137.191162),
    new CoordinateSpan(16, 16)
  )
)

export default root
