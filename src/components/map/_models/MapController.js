import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import { find, get as getValue, filter, transform, forEach } from 'lodash'
import { goto } from '@sapper/app'
import MapDecoder from './MapDecoder.js'
import MapItemStyler from './MapItemStyler.js'
import TextAnnotation from './custom/TextAnnotation.js'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

export default class MapController {
  constructor() {
    this.stores = {}
  }

  static preload({ features, id }) {
    // only want to do this on client side
    if (typeof window === 'undefined') return
    MapDecoder.loadFeatures(features, id)
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
    mapkit.TextAnnotation = TextAnnotation(mapkit)
  }
  /**
   * Handles loading the map with the desired region and annotations.
   */
  async loadMap() {
    const mapType = mapkit.Map.MapTypes.Standard
    const pointOfInterestFilter = mapkit.PointOfInterestFilter.including([
      mapkit.PointOfInterestCategory.Airport,
      mapkit.PointOfInterestCategory.AmusementPark,
      mapkit.PointOfInterestCategory.Aquarium,
      mapkit.PointOfInterestCategory.ATM,
      mapkit.PointOfInterestCategory.Bakery,
      mapkit.PointOfInterestCategory.Bank,
      mapkit.PointOfInterestCategory.Beach,
      mapkit.PointOfInterestCategory.Brewery,
      mapkit.PointOfInterestCategory.Cafe,
      mapkit.PointOfInterestCategory.Campground,
      mapkit.PointOfInterestCategory.CarRental,
      mapkit.PointOfInterestCategory.EVCharger,
      mapkit.PointOfInterestCategory.FireStation,
      mapkit.PointOfInterestCategory.FitnessCenter,
      mapkit.PointOfInterestCategory.FoodMarket,
      mapkit.PointOfInterestCategory.GasStation,
      mapkit.PointOfInterestCategory.Hospital,
      mapkit.PointOfInterestCategory.Hotel,
      mapkit.PointOfInterestCategory.Laundry,
      mapkit.PointOfInterestCategory.Library,
      mapkit.PointOfInterestCategory.Marina,
      mapkit.PointOfInterestCategory.MovieTheater,
      mapkit.PointOfInterestCategory.Museum,
      mapkit.PointOfInterestCategory.NationalPark,
      mapkit.PointOfInterestCategory.Nightlife,
      mapkit.PointOfInterestCategory.Park,
      mapkit.PointOfInterestCategory.Parking,
      mapkit.PointOfInterestCategory.Pharmacy,
      mapkit.PointOfInterestCategory.Police,
      mapkit.PointOfInterestCategory.PostOffice,
      mapkit.PointOfInterestCategory.PublicTransport,
      mapkit.PointOfInterestCategory.Restaurant,
      mapkit.PointOfInterestCategory.Restroom,
      mapkit.PointOfInterestCategory.School,
      mapkit.PointOfInterestCategory.Stadium,
      mapkit.PointOfInterestCategory.Store,
      mapkit.PointOfInterestCategory.Theater,
      mapkit.PointOfInterestCategory.University,
      mapkit.PointOfInterestCategory.Winery,
      mapkit.PointOfInterestCategory.Zoo,
    ])

    const mapOptions = {
      mapType,
      pointOfInterestFilter,
      showsCompass: mapkit.FeatureVisibility.Adaptive,
    }
    this.map = new mapkit.Map(this.element, mapOptions)

    this.map.addEventListener('select', this.handleSelection.bind(this))

    const mapView = this.element.querySelector('.mk-map-view')

    mapView.addEventListener('mousemove', this.handleMouseMove.bind(this))
    mapView.addEventListener('touchstart', this.handleTouchStart.bind(this))

    mapView.addEventListener('mouseout', this.handleHighlightOff.bind(this))
    mapView.addEventListener('touchend', this.handleHighlightOff.bind(this))
    mapView.addEventListener('touchcancel', this.handleHighlightOff.bind(this))
  }

  mount(scene, element) {
    this.element = element
    if (typeof mapkit === 'undefined') {
      // load script, init map and load it on first mount
      loadScript(MAPKIT_SOURCE, () => {
        this.initMapKit()
        this.loadMap()
        this.setMapParameters(scene, false)
      })
    } else {
      // just load map on subsequent mounts
      this.loadMap()
      this.setMapParameters(scene, false)
    }

    // unsubscribe on unmount
    const unsubscribe = locale.subscribe(this.handleLanguageChange)
    return async () => {
      if (this.map) {
        this.map.removeEventListener('select', this.handleSelection.bind(this))
        const mapView = this.element.querySelector('.mk-map-view')

        mapView.removeEventListener(
          'mousemove',
          this.handleMouseMove.bind(this)
        )
        mapView.removeEventListener(
          'touchstart',
          this.handleTouchStart.bind(this)
        )

        mapView.removeEventListener(
          'mouseout',
          this.handleHighlightOff.bind(this)
        )
        mapView.removeEventListener(
          'touchend',
          this.handleHighlightOff.bind(this)
        )
        mapView.removeEventListener(
          'touchcancel',
          this.handleHighlightOff.bind(this)
        )
      }
      this.map = null
      this.element = null
      this.lastAnnotations = null
      this.lastRegion = null
      unsubscribe()
    }
  }

  setRegionAnimated(region, animated = false) {
    this.lastRegion = region
    const center = new mapkit.Coordinate(
      region.center.latitude,
      region.center.longitude
    )
    const span = new mapkit.CoordinateSpan(
      region.span.latitudeDelta,
      region.span.longitudeDelta
    )
    region = new mapkit.CoordinateRegion(center, span)
    this.map.setRegionAnimated(region, animated)
  }

  setAnnotations(annotations) {
    annotations = annotations.map(({ coordinate, options }) => {
      const annotation = MapDecoder.decodeAnnotation(coordinate, options)
      MapItemStyler.style(annotation)
      return annotation
    })
    this.map.removeAnnotations(this.map.annotations)
    this.map.addAnnotations(annotations)
  }

  async setFeatures(features, id) {
    const items = await MapDecoder.loadFeatures(features, id)
    if (this.lastFeatureItems) this.map.removeItems(this.lastFeatureItems)
    if (items) this.map.addItems(items)
    this.lastFeatureItems = items
  }

  setMapParameters(parameters, animated = false) {
    const isNewLocation = this.lastId !== parameters.id
    if (parameters.region && isNewLocation)
      this.setRegionAnimated(parameters.region, animated)
    this.setAnnotations(parameters.annotations)
    if (isNewLocation) this.setFeatures(parameters.features, parameters.id)

    this.paths = transform(
      parameters.items,
      (result, page, id) => {
        result[id] = page.path
      },
      {}
    )
    this.lastId = parameters.id
  }

  handleHighlight(id) {
    if (
      typeof mapkit === 'undefined' ||
      !this.map ||
      id === this.lastHighlightId
    ) {
      return
    }
    forEach(this.lastHighlightedOverlays, overlay => {
      overlay.data.highlighted = false
      const state = MapItemStyler.getStyleState(overlay)
      MapItemStyler.styleOverlay(overlay, state)
    })
    const highlightedOverlays = this._getItemsWithId(this.map.overlays, id)
    forEach(highlightedOverlays, overlay => {
      if (overlay.enabled) {
        overlay.data.highlighted = true
        MapItemStyler.styleOverlay(overlay, 'highlighted')
      }
    })
    // move overlays to top
    this.map.removeOverlays(highlightedOverlays)
    this.map.addOverlays(highlightedOverlays)

    const annotation = this._getItemWithId(this.map.annotations, id)
    if (
      id !== getValue(this.map, ['selectedAnnotation', 'data', 'id']) &&
      (!annotation || annotation.enabled)
    ) {
      this.map.selectedAnnotation = annotation
    }
    this.lastHighlightId = id
    this.lastHighlightedOverlays = highlightedOverlays
  }

  handleSelection(event) {
    if (
      event.overlay &&
      event.overlay.data.id &&
      this.paths[event.overlay.data.id]
    ) {
      goto(this.paths[event.overlay.data.id], { noscroll: true })
    }
  }

  /**
   * Used to keep mapkit's language state up-to-date with the site's language state.
   */
  handleRegionChange(scene) {
    if (typeof mapkit === 'undefined' || !this.map) return
    this.setMapParameters(scene, true)
  }

  /**
   * Used to keep mapkit's language state up-to-date with the site's language state.
   */
  async handleLanguageChange(language) {
    if (typeof mapkit === 'undefined') return
    // setting language is an expensive operation so let's let other updates occur first
    setTimeout(() => (mapkit.language = language), 0)
  }

  handleMouseMove(event) {
    const targetOverlay = this.map.topOverlayAtPoint(
      new DOMPoint(event.pageX, event.pageY)
    )
    if (targetOverlay && targetOverlay.enabled && targetOverlay.data.id) {
      this.stores.highlighted.set(targetOverlay.data.id)
    } else {
      this.stores.highlighted.set(undefined)
    }
  }

  handleTouchStart(event) {
    if (event.touches.length !== 1) return
    const { pageX, pageY } = event.touches[0]
    const targetOverlay = this.map.topOverlayAtPoint(new DOMPoint(pageX, pageY))
    if (targetOverlay && targetOverlay.enabled && targetOverlay.data.id) {
      this.stores.highlighted.set(targetOverlay.data.id)
    }
  }

  handleHighlightOff() {
    this.stores.highlighted.set(undefined)
  }

  _getItemWithId(collection, id) {
    return id && find(collection, item => getValue(item, ['data', 'id']) === id)
  }

  _getItemsWithId(collection, id) {
    return (
      (id &&
        filter(collection, item => getValue(item, ['data', 'id']) === id)) ||
      []
    )
  }
}
