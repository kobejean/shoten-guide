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

  _getLocalization(locale, fallback, localizations) {
    let localization = localizations[locale]
    if (localization) {
      return { ...localization, locale }
    } else if (localizations[fallback]) {
      localization = localizations[fallback]
      return { ...localization, locale: fallback }
    }
    return {}
  }

  stringify(locale, fallback) {
    const items = {}
    const annotations = []
    // get only important details of children
    Object.entries(this.items).forEach(([id, item]) => {
      const localization = this._getLocalization(
        locale,
        fallback,
        item.localizations
      )
      item.localizations[locale] || item.localizations[fallback]
      const processedItem = {
        ...localization,
        id,
        pathFromLocale: item.pathFromLocale,
      }
      const processedAnnotation = {
        coordinate: item.annotation.coordinate,
        options: {
          ...item.annotation.options,
          title: processedItem.title,
        },
      }
      items[id] = processedItem
      annotations.push(processedAnnotation)
    })
    const localization = this._getLocalization(
      locale,
      fallback,
      this.localizations
    )
    return JSON.stringify({
      ...localization,
      id: this.id,
      region: this.region,
      annotations,
      items,
      pathFromLocale: this.pathFromLocale,
    })
  }
}
