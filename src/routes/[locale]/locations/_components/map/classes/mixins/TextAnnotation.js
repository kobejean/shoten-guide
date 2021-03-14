import { forEach } from 'lodash-es'
import { FALLBACK_LOCAL } from '../../../../../../../services/i18n/constants'

export default mapkit => {
  class TextAnnotation extends mapkit.MarkerAnnotation {
    constructor(id, coordinate, data) {
      data = {
        id,
        name: {},
        rank: 0,
        highlighted: false,
        locale: 'ja',
        ...data,
      }
      const options = {
        data,
        animates: false,
        anchorOffset: new DOMPoint(0, 10),
        glyphColor: 'transparent',
        color: 'transparent',
        enabled: false,
        calloutEnabled: false,
        collisionMode: mapkit.Annotation.CollisionMode.Rectangle,
        padding: new mapkit.Padding(35, 2, 2, 2), // reduce bounding box from above since marker is invisible
      }
      super(coordinate, options)
      TextAnnotation.instances[id] = this
      this._updated()
    }

    setHighlighted(highlighted) {
      super.data.highlighted = highlighted
      this._updated()
    }

    setLocale(locale) {
      super.data.locale = locale
      this._updated()
    }

    _updated() {
      this.displayPriority = (() => {
        if (this.data.highlighted) return 1000
        const min = 900
        const max = 990
        return max - this.data.rank * (max - min)
      })()

      this.title =
        this.data.name[this.data.locale] || this.data.name[FALLBACK_LOCAL]
    }

    static setHighlightById(id) {
      if (TextAnnotation.highlighted)
        TextAnnotation.highlighted.setHighlighted(false)
      if (id && TextAnnotation.instances[id]) {
        TextAnnotation.highlighted = TextAnnotation.instances[id]
        TextAnnotation.highlighted.setHighlighted(true)
      } else {
        TextAnnotation.highlighted = null
      }
    }

    static setLocale(locale) {
      forEach(TextAnnotation.instances, annotation => {
        annotation.setLocale(locale)
      })
    }
  }

  TextAnnotation.instances = {}
  TextAnnotation.highlighted = null
  return TextAnnotation
}
