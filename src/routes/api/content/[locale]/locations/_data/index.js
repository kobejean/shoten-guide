import Coordinate from './classes/Coordinate'
import CoordinateRegion from './classes/CoordinateRegion'
import CoordinateSpan from './classes/CoordinateSpan'
import Localization from './classes/Localization'
import LocationNode from './classes/LocationNode'

const root = (async () => {
  const { default: metadata } = await import('./geo-json/index.js')
  return LocationNode.fromData(
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
})()

export default root
