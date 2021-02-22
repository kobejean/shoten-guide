import { getFromCacheOrFetch } from '../../../utils/cache.js'
import MapItemStyler from './MapItemStyler.js'

export default class MapDecoder {
  static async loadFeatures(features, id) {
    const cacheKey = `featureItems/${id}`
    return await getFromCacheOrFetch(MapDecoder.caches, cacheKey, async () => {
      const promises = (features || []).map(feature =>
        MapDecoder.importFeature(feature)
      )
      return await Promise.all(promises)
    })
  }

  static getGeoJSONDelegate(feature) {
    const properties = feature.properties
    return {
      itemForPolygon: function (item, geoJSON) {
        Object.assign(item.style, properties.style)
        item.enabled = !!properties.enabled
        Object.assign(item.data, properties.data)
        item.data.id = feature.id
        MapItemStyler.style(item)
        return item
      },
    }
  }

  static decodeAnnotation(coordinate, options) {
    coordinate = new mapkit.Coordinate(
      coordinate.latitude,
      coordinate.longitude
    )
    if (options.data.type === 'text') {
      return new mapkit.TextAnnotation(coordinate, options)
    }
    return new mapkit.MarkerAnnotation(coordinate, options)
  }

  static async importFeature(feature) {
    return new Promise((resolve, reject) =>
      mapkit.importGeoJSON(feature, {
        ...MapDecoder.getGeoJSONDelegate(feature),
        geoJSONDidComplete: resolve,
        geoJSONDidError: reject,
      })
    )
  }
}
// static properties
MapDecoder.caches = new Map()
