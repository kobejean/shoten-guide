import { forEach } from 'lodash-es'

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
  class HighlightablePolygonOverlay extends mapkit.PolygonOverlay {
    constructor(points, options) {
      super(points, options)

      this.style.strokeColor = 'green'
      this.style.fillColor = 'green'
      this._updated()
    }

    setHighlighted(highlighted) {
      this.data.highlighted = highlighted
      this._updated()
    }

    setId(id) {
      this.data.id = id
      if (HighlightablePolygonOverlay.instances[id]) {
        HighlightablePolygonOverlay.instances[id].push(this)
      } else {
        HighlightablePolygonOverlay.instances[id] = [this]
      }
    }

    get styleState() {
      if (this.data.highlighted) {
        return STATE.HIGHLIGHTED
      } else if (this.enabled) {
        return STATE.ENABLED
      } else {
        return STATE.DISABLED
      }
    }

    _updated() {
      const styleState = this.styleState
      this.style.strokeOpacity = STROKE_OPACITY[styleState]
      this.style.fillOpacity = FILL_OPACITY[styleState]
    }

    static setHighlightById(id) {
      if (HighlightablePolygonOverlay.highlighted)
        forEach(HighlightablePolygonOverlay.highlighted, item => {
          item.setHighlighted(false)
        })
      if (id && HighlightablePolygonOverlay.instances[id]) {
        HighlightablePolygonOverlay.highlighted =
          HighlightablePolygonOverlay.instances[id]
        forEach(HighlightablePolygonOverlay.highlighted, item => {
          item.setHighlighted(true)
        })
      } else {
        HighlightablePolygonOverlay.highlighted = null
      }
    }
  }

  HighlightablePolygonOverlay.instances = {}
  HighlightablePolygonOverlay.highlighted = null
  return HighlightablePolygonOverlay
}
