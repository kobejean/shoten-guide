import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import { fromPairs, map, forEach, get as getValue } from 'lodash-es'
import { goto } from '@sapper/app'
import HighlightablePolygonOverlay from './mixins/HighlightablePolygonOverlay.js'
import TextAnnotation from './mixins/TextAnnotation.js'
import Totoro from './mixins/Totoro.js'
import MapDecoder from './MapDecoder'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

export default class MapController {
  constructor(stores) {
    this.stores = stores
    this.prevState = {}
    this.decoder = new MapDecoder(stores)
  }

  mount(element) {
    this.element = element

    // unsubscriber is a promise that resolves once sunscriptions are complete
    // we do it this way to keep the mount method syncrounous
    const unsubscriber = (async () => {
      await this.initLoad()
      return this.subscriptions()
    })()

    return {
      destroy() {
        // unsubscribe after promise resolves if it hasn't been resolved yet
        unsubscriber.then(unsubscribe => unsubscribe())
      },
    }
  }

  async initLoad() {
    if (typeof mapkit === 'undefined') {
      await loadScript(MAPKIT_SOURCE)
      this.initMapKit()
    }
    this.initMap()
    this.loadMap(false)
  }

  /**
   * Handles initializing mapkit.
   */
  async initMapKit() {
    mapkit.init({
      authorizationCallback: function (done) {
        fetch('/api/jwt/mapkit-token')
          .then(response => response.json())
          .then(result => done(result.token))
      },
      language: get(locale),
    })
    // custom mapkit classes
    mapkit.HighlightablePolygonOverlay = HighlightablePolygonOverlay(mapkit)
    mapkit.TextAnnotation = TextAnnotation(mapkit)
    mapkit.Totoro = Totoro(mapkit)
  }

  /**
   * Handles loading the map with the desired region and annotations.
   */
  async initMap() {
    const mapType = mapkit.Map.MapTypes.MutedStandard

    const mapOptions = {
      mapType,
      showsCompass: mapkit.FeatureVisibility.Hidden,
      showsPointsOfInterest: false,
    }
    this.map = new mapkit.Map(this.element, mapOptions)

    this.spawnTotoro()
  }

  spawnTotoro() {
    const { location } = get(this.stores.data)
    const { latitude, longitude } = location.region.center
    const coordinate = new mapkit.Coordinate(latitude, longitude)
    this.totoro = new mapkit.Totoro(coordinate)
    this.map.addAnnotation(this.totoro)
  }

  moveTotoro(region) {
    const { latitude, longitude } = region.center
    const coordinate = new mapkit.Coordinate(latitude, longitude)
    return (this.totoro.coordinate = coordinate)
  }

  loadMap(animated = false) {
    const { location } = get(this.stores.data)
    const isNewLocation = this.prevState.lastId !== location.id

    if (isNewLocation) {
      this.loadGeoJSON(location.geoJSON)

      if (location.region) {
        this.setRegionAnimated(location.region, animated)
        this.moveTotoro(location.region)
      }
      this.loadChildMetadata(location)
      // remove any highlights
      this.handleHighlight(null)
    }

    this.prevState.lastId = location.id
  }

  loadChildMetadata(location) {
    this.paths = fromPairs(map(location.children, ({ id, path }) => [id, path]))
    const features = getValue(location, 'geoJSON.features')
    const childCoordinatePairs = map(features, ({ id, properties }) => {
      const [longitude, latitude] = properties.display_point.coordinates
      id = `${location.id}/${id}`
      const coordinate = new mapkit.Coordinate(latitude, longitude)
      return [id, coordinate]
    })
    this.childCoordinates = fromPairs(childCoordinatePairs)
  }

  async loadGeoJSON(geoJSON) {
    const items = await this.decoder.importGeoJSON(geoJSON)
    if (this.prevState.items) this.map.removeItems(this.prevState.items)
    if (items) this.map.addItems(items)
    this.prevState.items = items
  }

  setRegionAnimated(region, animated = false) {
    const { latitude, longitude } = region.center
    const { latitudeDelta, longitudeDelta } = region.span
    const center = new mapkit.Coordinate(latitude, longitude)
    const span = new mapkit.CoordinateSpan(latitudeDelta, longitudeDelta)
    this.region = new mapkit.CoordinateRegion(center, span)
    this.map.setRegionAnimated(this.region, animated)
  }

  subscriptions() {
    const mapView = this.element.querySelector('.mk-map-view')
    const eventListeners = [
      [this.map, 'select', this.handleSelection.bind(this)],
      [mapView, 'mousemove', this.handleMouseMove.bind(this)],
      [mapView, 'touchstart', this.handleTouchStart.bind(this)],
      [mapView, 'mouseout', this.handleMouseOut.bind(this)],
      [mapView, 'touchend', this.handleHighlightOff.bind(this)],
      [mapView, 'touchcancel', this.handleHighlightOff.bind(this)],
    ]

    forEach(eventListeners, ([object, eventType, method]) =>
      object.addEventListener(eventType, method)
    )

    const { data, highlighted } = this.stores
    const unsubscribers = {
      locale: locale.subscribe(this.handleLocaleChange.bind(this)),
      data: data.subscribe(this.loadMap.bind(this, true)),
      highlighted: highlighted.subscribe(this.handleHighlight.bind(this)),
    }

    return () => {
      forEach(eventListeners, ([object, eventType, method]) =>
        object.removeEventListener(eventType, method)
      )
      unsubscribers.locale()
      unsubscribers.data()
      unsubscribers.highlighted()
      MapDecoder.caches.clear()
    }
  }

  handleHighlight(id) {
    if (
      typeof mapkit === 'undefined' ||
      !this.map ||
      id === this.prevState.highlighted
    ) {
      return
    }

    mapkit.HighlightablePolygonOverlay.setHighlightById(id)
    mapkit.TextAnnotation.setHighlightById(id)
    if (this.childCoordinates[id]) {
      this.totoro.coordinate = this.childCoordinates[id]
    }
    this.prevState.highlighted = id
  }

  handleSelection(event) {
    const id = getValue(event, 'overlay.data.id')
    const path = this.paths[id]
    if (path) {
      goto(path, { noscroll: true })
    }
  }

  /**
   * Used to keep mapkit's language state up-to-date with the site's language state.
   */
  async handleLocaleChange(locale) {
    if (typeof mapkit === 'undefined') return
    // setting language is an expensive operation so let's let other updates occur first
    setTimeout(() => (mapkit.language = locale), 0)
    if (this.map) {
      mapkit.TextAnnotation.setLocale(locale)
    }
  }

  handleMouseMove(event) {
    const targetOverlay = this.map.topOverlayAtPoint(
      new DOMPoint(event.pageX, event.pageY)
    )
    if (targetOverlay && targetOverlay.enabled) {
      this.stores.highlighted.set(targetOverlay.data.id)
    } else {
      this.stores.highlighted.set(undefined)
    }
  }

  handleTouchStart(event) {
    if (event.touches.length !== 1) return
    const { pageX, pageY } = event.touches[0]
    const targetOverlay = this.map.topOverlayAtPoint(new DOMPoint(pageX, pageY))
    if (targetOverlay && targetOverlay.enabled) {
      this.stores.highlighted.set(targetOverlay.data.id)
    }
  }

  handleMouseOut(event) {
    if (!event.currentTarget.contains(event.relatedTarget))
      this.stores.highlighted.set(undefined) // must have truly moused out of map view
  }

  handleHighlightOff() {
    this.stores.highlighted.set(undefined)
  }
}
