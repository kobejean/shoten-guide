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

export default class MapItemStyler {
  static getStyleState(item) {
    if (item.data.highlighted) {
      return STATE.HIGHLIGHTED
    } else if (item.enabled) {
      return STATE.ENABLED
    } else {
      return STATE.DISABLED
    }
  }

  static styleOverlay(overlay, state) {
    overlay.style.strokeOpacity = STROKE_OPACITY[state]
    overlay.style.fillOpacity = FILL_OPACITY[state]
  }

  static styleMarkerAnnotation(annotation, state) {
    if (annotation.data.color) item.color = item.data.color
    if (annotation.data.glyphColor) item.glyphColor = item.data.glyphColor
    if (annotation.data.name) {
      const locale = document.documentElement.lang
      annotation.title = annotation.data.name[locale]
    }
  }

  static style(item) {
    const state = this.getStyleState(item)
    if (item instanceof mapkit.MarkerAnnotation) {
      this.styleMarkerAnnotation(item, state)
    } else if (!(item instanceof mapkit.Annotation)) {
      // must be overlay
      this.styleOverlay(item, state)
    }
  }
}
