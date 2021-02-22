import { get } from 'svelte/store'
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
  constructor(stores) {
    this.stores = stores
  }

  getStyleState(item) {
    if (item.data.highlighted) {
      return STATE.HIGHLIGHTED
    } else if (item.enabled) {
      return STATE.ENABLED
    } else {
      return STATE.DISABLED
    }
  }

  getDisplayPriority(state, rank) {
    if (state === STATE.HIGHLIGHTED) {
      return 1000
    }
    const { location } = get(this.stores.data)
    const count = location.geoJSON.features.length
    const normalized = 1 - rank / count
    const [min, max] = [900, 990]
    return normalized * (max - min) + min
  }

  styleOverlay(overlay) {
    const state = this.getStyleState(overlay)
    overlay.style.strokeOpacity = STROKE_OPACITY[state]
    overlay.style.fillOpacity = FILL_OPACITY[state]
  }
}
