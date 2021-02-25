import { tweened, spring } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export default mapkit =>
  class Totoro extends mapkit.Annotation {
    constructor(coordinate) {
      const options = {
        enabled: false,
        calloutEnabled: false,
        collisionMode: mapkit.Annotation.CollisionMode.None,
      }
      super(coordinate, Totoro.factory, options)

      this.coordinateStore = tweened(coordinate, {
        duration: 500,
        easing: cubicOut,
      })
      this.coordinateStore.subscribe(coordinate => {
        super.coordinate = Object.assign(super.coordinate, coordinate)
      })
    }

    get coordinate() {
      return super.coordinate
    }

    set coordinate(coordinate) {
      this.coordinateStore.set(coordinate)
    }

    static factory(coordinate, options) {
      const div = document.createElement('div')
      div.textContent = '🛸'
      div.className = 'totoro'
      return div
    }
  }
