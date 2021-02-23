import { forEach } from 'lodash-es'
import { FALLBACK_LOCAL } from '../../../../services/i18n/constants'

const STATE = {
  HIGHLIGHTED: 'highlighted',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
}

const FILL_OPACITY = {
  [STATE.HIGHLIGHTED]: 0.5,
  [STATE.ENABLED]: 0.3,
  [STATE.DISABLED]: 0.15,
}

const STROKE_OPACITY = {
  [STATE.HIGHLIGHTED]: 1.0,
  [STATE.ENABLED]: 0.8,
  [STATE.DISABLED]: 0.0,
}

export default mapkit => {
  class TextAnnotation extends mapkit.MarkerAnnotation {
    constructor(id, coordinate, data) {
      data = {
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
    _updated() {}

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
