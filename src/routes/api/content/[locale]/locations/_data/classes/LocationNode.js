import { FALLBACK_LOCAL } from '../../../../../../../services/i18n/constants'
import { forEach, isEmpty } from 'lodash-es'
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
