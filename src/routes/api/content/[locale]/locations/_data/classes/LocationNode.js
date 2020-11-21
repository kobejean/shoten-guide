import { FALLBACK_LOCAL } from '../../../../../../../services/i18n/constants'
import { forEach } from 'lodash'
export default class LocationNode {
  constructor(id, localizations, region, annotation = null, parent = null) {
    this.id = id
    this.localizations = localizations
    this.region = region
    this.annotation = annotation
    this.items = {}

    if (parent) {
      this.pathFromLocale = `${parent.pathFromLocale}/${id}`
      parent.addChild(this)
    } else {
      this.pathFromLocale = '/locations'
    }
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
    return {
      coordinate: this.annotation.coordinate,
      options: {
        ...this.annotation.options,
        ...this.getLocalization(locale),
      },
    }
  }

  getMinimalSummary(locale) {
    return {
      ...this.getLocalization(locale),
      id: this.id,
      items: {},
    }
  }

  getNodeSummary(locale) {
    const items = {}
    const annotations = []
    // get only important details of children
    forEach(this.items, (item, id) => {
      items[id] = item.getMinimalSummary(locale)
      annotations.push(item.getProcessedAnnotation(locale))
    })
    return {
      ...this.getLocalization(locale),
      id: this.id,
      region: this.region,
      annotations,
      items,
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
