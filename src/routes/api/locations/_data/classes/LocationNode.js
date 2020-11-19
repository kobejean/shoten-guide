export default class LocationNode {
  constructor(
    id,
    localizations,
    center,
    span,
    annotation = null,
    parent = null
  ) {
    this.id = id
    this.localizations = localizations
    this.center = center
    this.span = span
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

  stringify(locale, fallback) {
    const items = {}
    const annotations = []
    // get only important details of children
    Object.entries(this.items).forEach(([id, item]) => {
      const localization =
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
    const localization =
      this.localizations[locale] || this.localizations[fallback]
    return JSON.stringify({
      ...localization,
      id: this.id,
      center: this.center,
      span: this.span,
      items,
      annotations,
    })
  }
}
