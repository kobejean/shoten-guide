import { FALLBACK_LOCAL } from '../../../../../../../services/i18n/constants'
import { forEach, isEmpty } from 'lodash-es'
import Annotation from './Annotation'
import Coordinate from './Coordinate'
import CoordinateRegion from './CoordinateRegion'
import CoordinateSpan from './CoordinateSpan'
import Localization from './Localization'

export default class LocationNode {
  constructor(
    id,
    localizations,
    region,
    annotation = null,
    features = null,
    parent = null
  ) {
    this.id = id
    this.localizations = localizations
    this.region = region
    this.annotation = annotation
    this.features = features
    this.items = {}

    if (parent) {
      this.pathFromLocale = `${parent.pathFromLocale}/${id}`
      parent.addChild(this)
    } else {
      this.pathFromLocale = '/locations'
    }
  }

  static fromStatic(
    metadata = {},
    data = {
      id: 'japan',
      localizations: {
        en: new Localization('Japan'),
        ja: new Localization('全国'),
        ko: new Localization('일본'),
      },
      region: new CoordinateRegion(
        new Coordinate(37.998915, 137.191162),
        new CoordinateSpan(16, 16)
      ),
    }
  ) {
    const node = new LocationNode(
      data.id,
      data.localizations,
      data.region,
      data.annotation,
      metadata.features,
      data.parent
    )
    forEach(metadata.features, feature => {
      const { id } = feature
      feature.properties.enabled = true //!!metadata.items[id]
      // feature.properties.style = { strokeColor: 'blue', fillColor: 'blue' }
      const { interiorPoint, bounds, name } = feature.properties
      const lat = (bounds.yMin + bounds.yMax) / 2
      const long = (bounds.xMin + bounds.xMax) / 2
      const spanLat = bounds.yMax - bounds.yMin
      const spanLong = bounds.xMax - bounds.xMin
      LocationNode.fromStatic(metadata.items[id], {
        id,
        localizations: {
          en: new Localization(name.en),
          ja: new Localization(name.ja),
        },
        region: new CoordinateRegion(
          new Coordinate(lat, long),
          new CoordinateSpan(spanLat, spanLong)
        ),
        annotation: new Annotation(
          new Coordinate(interiorPoint.y, interiorPoint.x),
          {
            data: { type: 'text' },
          }
        ),
        parent: node,
      })
    })
    return node
  }

  addChild(node) {
    this.items[node.id] = node
  }

  getLocalization(locale) {
    const localization =
      this.localizations[locale] || this.localizations[FALLBACK_LOCAL]
    if (!localization) {
      return {}
    }
    return {
      ...localization,
      path: `${locale}${this.pathFromLocale}`,
      locale,
    }
  }

  getProcessedAnnotation(locale) {
    const { title } = this.getLocalization(locale)
    return {
      coordinate: this.annotation.coordinate,
      options: {
        ...this.annotation.options,
        data: {
          ...this.annotation.options.data,
          id: this.id,
        },
        title,
      },
    }
  }

  getMinimalSummary(locale) {
    return {
      ...this.getLocalization(locale),
      id: this.id,
      items: {},
      enabled: !isEmpty(this.items),
    }
  }

  getNodeSummary(locale) {
    const items = {}
    const annotations = []
    // get only important details of children
    forEach(this.items, (item, id) => {
      items[id] = item.getMinimalSummary(locale)
      if (item.annotation) annotations.push(item.getProcessedAnnotation(locale))
    })
    return {
      ...this.getLocalization(locale),
      id: this.id,
      region: this.region,
      annotations,
      items,
      features: this.features,
      enabled: !isEmpty(items),
    }
  }

  getPathSummary(locale, path) {
    if (path.length === 0) return this.getNodeSummary(locale)

    let node = this
    let rootSummary, currentSummary
    for (var i = 0; i < path.length; i++) {
      const next = node.items[path[i]]
      if (next) {
        const summary = node.getMinimalSummary(locale)
        if (currentSummary) currentSummary.items[node.id] = summary
        else rootSummary = summary
        // prepare next iter
        node = next
        currentSummary = summary
      } else {
        return null
      }
    }
    // last node should have non-minimal summary
    const summary = node.getNodeSummary(locale)
    if (currentSummary) currentSummary.items[node.id] = summary
    else rootSummary = summary
    return rootSummary
  }
}
