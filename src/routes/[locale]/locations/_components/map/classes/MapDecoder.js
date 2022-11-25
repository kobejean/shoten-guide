/** @module components/map/classes */
import { forEach, map } from 'lodash-es'
import { get } from 'svelte/store'
import { getFromCacheOrFetch } from '../../../../../../utils/cache.js'

export default class MapDecoder {
  constructor(stores) {
    this.stores = stores
  }

  addToItem(item, ...add) {
    const items = map(item.items || [item], i => i)
    return items.concat(add)
  }

  createLabel(geoJSON) {
    const { location } = get(this.stores.data)
    const { name, display_point, rank } = geoJSON.properties

    const { coordinates } = display_point
    const id = `${location.id}/${geoJSON.id}`

    const coordinate = new mapkit.Coordinate(coordinates[1], coordinates[0])
    const data = { name, rank, locale: location.locale }
    const annotation = new mapkit.TextAnnotation(id, coordinate, data)

    return annotation
  }

  processFeatureItems(item, geoJSON) {
    const { location } = get(this.stores.data)
    const items = item.items || [item]
    forEach(items, item => {
      if (item instanceof mapkit.HighlightablePolygonOverlay) {
        item.setId(`${location.id}/${geoJSON.id}`)
      }
    })
  }

  getGeoJSONDelegate() {
    return {
      itemForFeature: (item, geoJSON) => {
        this.processFeatureItems(item, geoJSON)
        const label = this.createLabel(geoJSON)
        return this.addToItem(item, label)
      },
      itemForPolygon: (overlay, geoJSON) => {
        return new mapkit.HighlightablePolygonOverlay(overlay.points)
      },
    }
  }

  async importGeoJSON(geoJSON) {
    if (!geoJSON) return null
    const { location } = get(this.stores.data)
    const cacheKey = `importGeoJSON/${location.id}`
    return await getFromCacheOrFetch(MapDecoder.caches, cacheKey, () =>
      this.importGeoJSONNoCache(geoJSON)
    )
  }

  async importGeoJSONNoCache(geoJSON) {
    return new Promise((resolve, reject) =>
      mapkit.importGeoJSON(geoJSON, {
        ...this.getGeoJSONDelegate(),
        geoJSONDidComplete: resolve,
        geoJSONDidError: reject,
      })
    )
  }
}
// static properties
MapDecoder.caches = new Map()
