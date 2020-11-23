import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import {
  isEqual,
  find,
  get as getValue,
  forEach,
  orderBy,
  filter,
} from 'lodash'
import { goto } from '@sapper/app'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

const ENABLED_FILL_OPACITY = 0.2
const DISABLED_FILL_OPACITY = 0
const HIGHLIGHTED_FILL_OPACITY = 0.4
const ENABLED_STROKE_OPACITY = 0.5
const DISABLED_STROKE_OPACITY = 0.5
const HIGHLIGHTED_STROKE_OPACITY = 1

export default class MapModel {
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
        this.moveToScene(scene, false)
      })
    } else {
      // just load map on subsequent mounts
      this.loadMap()
      this.moveToScene(scene, false)
    }

    // unsubscribe on unmount
    const unsubscribe = locale.subscribe(this.handleLanguageChange)
    return async () => {
      if (this.map) {
        this.map.removeEventListener('select', this.handleSelection)
        const mapView = this.element.querySelector('.mk-map-view')

        mapView.removeEventListener('mousemove', this.handleMouseMove)
        mapView.removeEventListener('touchstart', this.handleTouchStart)

        mapView.removeEventListener('mouseout', this.handleHighlightOff)
        mapView.removeEventListener('touchend', this.handleHighlightOff)
        mapView.removeEventListener('touchcancel', this.handleHighlightOff)
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

  createTextAnnotation(coordinate, options) {
    options = {
      ...options,
      anchorOffset: new DOMPoint(0, 10),
      glyphColor: 'transparent',
      color: 'transparent',
      enabled: false,
    }
    return new mapkit.MarkerAnnotation(coordinate, options)
  }

  decodeAnnotation(coordinate, options) {
    coordinate = new mapkit.Coordinate(
      coordinate.latitude,
      coordinate.longitude
    )
    if (options.data.type === 'text') {
      return this.createTextAnnotation(coordinate, options)
    }
    return new mapkit.MarkerAnnotation(coordinate, options)
  }

  setAnnotations(annotations) {
    this.lastAnnotations = annotations
    annotations = annotations.map(annotation => {
      return this.decodeAnnotation(annotation.coordinate, annotation.options)
    })
    this.map.removeAnnotations(this.map.annotations)
    this.map.addAnnotations(annotations)
  }

  async setOverlays(overlays) {
    this.lastOverlayIds = overlays.map(overlay => overlay.options.data.id)
    const sorted = orderBy(
      overlays,
      ['options.enabled', 'options.data.id'],
      ['asc', 'desc']
    )
    const promises = sorted.map(({ geoJSON, options }) => {
      const style = (item, geoJSON) => {
        const properties = geoJSON.properties
        item.enabled = !!properties.enabled
        Object.assign(item.style, properties.style)
        item.data.id = geoJSON.id
        item.data.path = options.data.path

        item.style.fillOpacity = properties.enabled
          ? ENABLED_FILL_OPACITY
          : DISABLED_FILL_OPACITY
        item.style.strokeOpacity = properties.enabled
          ? ENABLED_STROKE_OPACITY
          : DISABLED_STROKE_OPACITY
      }
      return this._importGeoJSON(geoJSON, {
        // itemForPolygon: function (overlay, geoJSON) {
        //   overlay.data = options.data
        //   return overlay
        // },
        itemForFeature: function (item, geoJSON) {
          if (item.getFlattenedItemList)
            item.getFlattenedItemList().forEach(item => style(item, geoJSON))
          else style(item, geoJSON)

          const properties = geoJSON.properties || {}
          if (properties['display_point']) {
            const title = properties.name['en']
            const [longitude, latitude] = properties[
              'display_point'
            ].coordinates
            const coordinates = { longitude, latitude }
            const options = { data: { type: 'text' }, title }
            const annotation = this.decodeAnnotation(coordinates, options)
            return [item, annotation]
          }
          return item
        },
      })
    })
    const items = await Promise.all(promises)
    console.log('items', items)
    if (this.lastItems) this.map.removeItems(this.lastItems)
    if (items) this.map.addItems(items)
    this.lastItems = items
  }

  moveToScene(scene, animated = false) {
    if (scene.region && !isEqual(this.lastRegion, scene.region)) {
      this.setRegionAnimated(scene.region, animated)
    }
    if (
      typeof scene.annotations === 'object' &&
      !isEqual(this.lastAnnotations, scene.annotations)
    ) {
      this.setAnnotations(scene.annotations)
    }
    const overlayIds =
      scene.overlays && scene.overlays.map(overlay => overlay.options.data.id)
    if (!isEqual(overlayIds, this.lastOverlayIds)) {
      this.setOverlays(scene.overlays)
    }
  }

  handleHighlight(id) {
    if (
      typeof mapkit === 'undefined' ||
      !this.map ||
      id === this.lastHighlightId
    )
      return
    this._getItemsWithId(this.map.overlays, this.lastHighlightId).forEach(
      overlay => {
        if (overlay.enabled) {
          overlay.style.fillOpacity = ENABLED_FILL_OPACITY
          overlay.style.strokeOpacity = ENABLED_STROKE_OPACITY
        } else {
          overlay.style.fillOpacity = DISABLED_FILL_OPACITY
          overlay.style.strokeOpacity = DISABLED_STROKE_OPACITY
        }
      }
    )
    this._getItemsWithId(this.map.overlays, id).forEach(overlay => {
      if (overlay.enabled) {
        overlay.style.fillOpacity = HIGHLIGHTED_FILL_OPACITY
        overlay.style.strokeOpacity = HIGHLIGHTED_STROKE_OPACITY
      }
    })

    const annotation = this._getItemWithId(this.map.annotations, id)
    if (
      id !== getValue(this.map, ['selectedAnnotation', 'data', 'id']) &&
      (!annotation || annotation.enabled)
    ) {
      this.map.selectedAnnotation = annotation
    }
    this.lastHighlightId = id
  }

  handleSelection = event => {
    if (event.overlay && event.overlay.data.path) {
      goto(event.overlay.data.path, { noscroll: true })
    }
  }

  /**
   * Used to keep mapkit's language state up-to-date with the site's language state.
   */
  handleRegionChange(scene) {
    if (typeof mapkit === 'undefined' || !this.map) return
    this.moveToScene(scene, true)
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
    if (targetOverlay && targetOverlay.data.id) {
      this.handleHighlight(targetOverlay.data.id)
    } else {
      this.handleHighlight(undefined)
    }
  }

  handleTouchStart(event) {
    if (event.touches.length !== 1) return
    const { pageX, pageY } = event.touches[0]
    const targetOverlay = this.map.topOverlayAtPoint(new DOMPoint(pageX, pageY))
    if (targetOverlay && targetOverlay.data.id) {
      this.handleHighlight(targetOverlay.data.id)
    }
  }

  handleHighlightOff() {
    this.handleHighlight(undefined)
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

  async _importGeoJSON(data, delegate) {
    return new Promise((resolve, reject) =>
      mapkit.importGeoJSON(data, {
        ...delegate,
        geoJSONDidComplete: resolve,
        geoJSONDidError: reject,
      })
    )
  }
}
