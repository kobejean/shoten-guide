import { FALLBACK_LOCAL } from '../../../../../../../services/i18n/constants'
import { forEach, get, map, values, size, first } from 'lodash-es'
import Annotation from './Annotation'
import Coordinate from './Coordinate'
import CoordinateRegion from './CoordinateRegion'
import CoordinateSpan from './CoordinateSpan'
import Localization from './Localization'

export default class LocationNode {
  constructor(segment, localizations, region, geoJSON, parent = null) {
    this.segment = segment
    this.localizations = localizations
    this.region = region
    this.geoJSON = geoJSON
    this.children = {}

    if (parent) {
      this.id = `${parent.id}/${segment}`
      parent.addChild(this)
    } else {
      this.id = '/locations'
    }
  }

  static fromFeatureAndMetadata(feature, metadata, parent) {
    const { id } = feature
    const { bounds, name } = feature.properties
    const lat = (bounds.yMin + bounds.yMax) / 2
    const long = (bounds.xMin + bounds.xMax) / 2
    const spanLat = bounds.yMax - bounds.yMin
    const spanLong = bounds.xMax - bounds.xMin
    LocationNode.fromData(
      metadata,
      id,
      {
        en: new Localization(name.en),
        ja: new Localization(name.ja),
      },
      new CoordinateRegion(
        new Coordinate(lat, long),
        new CoordinateSpan(spanLat, spanLong)
      ),
      parent
    )
  }

  static fromData(metadata, segment, localizations, region, parent = null) {
    const node = new LocationNode(
      segment,
      localizations,
      region,
      get(metadata, 'geoJSON'),
      parent
    )
    const features = get(metadata, 'geoJSON.features')
    forEach(features, feature => {
      const { id } = feature
      const childMetadata = metadata.items[id]
      const childFeatures = get(childMetadata, 'geoJSON.features')
      // LocationNode.fromFeatureAndMetadata(feature, childMetadata, node)
      if (
        childMetadata &&
        size(childMetadata.items) === 1 &&
        size(childFeatures) === 1 &&
        childMetadata.items[childFeatures[0].id]
      ) {
        const childFeature = childFeatures[0]
        const grandChildMetadata = childMetadata.items[childFeature.id]
        LocationNode.fromFeatureAndMetadata(
          childFeature,
          grandChildMetadata,
          node
        )
        // LocationNode.fromFeatureAndMetadata(feature, childMetadata, node)
      } else {
        LocationNode.fromFeatureAndMetadata(feature, childMetadata, node)
      }
    })
    return node
  }

  addChild(node) {
    this.children[node.segment] = node
  }

  getLocalization(locale) {
    const localization =
      this.localizations[locale] || this.localizations[FALLBACK_LOCAL]
    if (!localization) {
      return {}
    }
    return {
      ...localization,
      path: `${locale}${this.id}`,
      locale,
    }
  }

  getBreadcrumbSummary(locale) {
    const { title, path } = this.getLocalization(locale)
    return {
      title,
      path,
      id: this.id,
    }
  }

  getChildSummary(locale, rank) {
    const { title, path } = this.getLocalization(locale)
    return {
      title,
      path,
      id: this.id,
      rank,
      enabled: true, //!isEmpty(this.children),
    }
  }

  getNodeSummary(locale) {
    const children = map(values(this.children), (child, i) =>
      child.getChildSummary(locale, i + 1)
    )
    return {
      ...this.getLocalization(locale),
      id: this.id,
      segment: this.segment,
      region: this.region,
      children,
      geoJSON: this.geoJSON,
    }
  }

  getSummary(locale, path) {
    let node = this
    const breadcrumbs = [node.getBreadcrumbSummary(locale)]
    for (var i = 0; i < path.length; i++) {
      const next = node.children[path[i]]
      if (next) {
        breadcrumbs.push(next.getBreadcrumbSummary(locale))
        node = next
      } else {
        return null
      }
    }

    return {
      location: node.getNodeSummary(locale),
      breadcrumbs,
    }
  }
}
