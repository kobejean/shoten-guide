import { forEach, map } from 'lodash-es'
import { get } from 'svelte/store'
import { getFromCacheOrFetch } from '../../../utils/cache.js'
import { FALLBACK_LOCAL } from '../../../services/i18n/constants'
import MapItemStyler from './MapItemStyler.js'

export default class MapDecoder {
  constructor(stores) {
    this.stores = stores
    this.styler = new MapItemStyler(stores)
  }

  addToItem = (item, ...add) => {
    const items = map(item.items || [item], i => i)
    return items.concat(add)
  }

  createLabel = geoJSON => {
    const { location } = get(this.stores.data)
    const { name, display_point, rank } = geoJSON.properties

    const { coordinates } = display_point
    const id = `${location.id}/${geoJSON.id}`

    const coordinate = new mapkit.Coordinate(coordinates[1], coordinates[0])
    const data = { name, rank, locale: location.locale }
    const annotation = new mapkit.TextAnnotation(id, coordinate, data)

    return annotation
  }

  polygonSetup = (overlay, geoJSON) => {
    const { enabled } = geoJSON.properties
    overlay.enabled = true //!!enabled
    overlay.style.strokeColor = 'green'
    overlay.style.fillColor = 'green'
    this.styler.styleOverlay(overlay)
  }

  processFeatureItems = (item, geoJSON) => {
    const { location } = get(this.stores.data)
    const items = item.items || [item]
    forEach(items, item => {
      item.data.id = `${location.id}/${geoJSON.id}`

      if (item.data.setup) {
        // now that we have property data, we can call setup
        item.data.setup(item, geoJSON)
        delete item.data.setup
      }
    })
  }

  getGeoJSONDelegate = () => {
    return {
      itemForFeature: (item, geoJSON) => {
        this.processFeatureItems(item, geoJSON)
        const label = this.createLabel(geoJSON)
        return this.addToItem(item, label)
      },
      itemForPolygon: (item, geoJSON) => {
        // call setup function later when we have properties data
        item.data.setup = this.polygonSetup
        return item
      },
    }
  }

  importGeoJSON = async geoJSON => {
    if (!geoJSON) return null
    const { location } = get(this.stores.data)
    const cacheKey = `importGeoJSON/${location.id}`
    return await getFromCacheOrFetch(MapDecoder.caches, cacheKey, () =>
      this.importGeoJSONNoCache(geoJSON)
    )
  }

  importGeoJSONNoCache = async geoJSON => {
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
