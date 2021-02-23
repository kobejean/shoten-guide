import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import {
  fromPairs,
  filter,
  map,
  forEach,
  find,
  get as getValue,
} from 'lodash-es'
import { goto } from '@sapper/app'
import { FALLBACK_LOCAL } from '../../../services/i18n/constants'
import TextAnnotation from './custom/TextAnnotation.js'
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
    mapkit.TextAnnotation = TextAnnotation(mapkit)
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
  }

  loadMap(animated = false) {
    const { location } = get(this.stores.data)
    const isNewLocation = this.prevState.lastId !== location.id

    // this.setAnnotations(parameters.annotations)
    if (isNewLocation) {
      this.loadGeoJSON(location.geoJSON)

      if (location.region) this.setRegionAnimated(location.region, animated)
    }

    this.paths = fromPairs(map(location.children, ({ id, path }) => [id, path]))
    this.prevState.lastId = location.id
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
    region = new mapkit.CoordinateRegion(center, span)
    this.map.setRegionAnimated(region, animated)
  }

  subscriptions() {
    const mapView = this.element.querySelector('.mk-map-view')
    this.map.addEventListener('select', this.handleSelection.bind(this))
    // this.addEventListener(mapView, 'mousemove', this.handleMouseMove)
    // mapView.addEventListener('touchstart', this.handleTouchStart.bind(this))
    // mapView.addEventListener('mouseout', this.handleMouseOut.bind(this))
    // mapView.addEventListener('touchend', this.handleHighlightOff.bind(this))
    // mapView.addEventListener('touchcancel', this.handleHighlightOff.bind(this))
    const { data, highlighted } = this.stores
    const unsubscribers = {
      locale: locale.subscribe(this.handleLocaleChange.bind(this)),
      data: data.subscribe(this.loadMap.bind(this, true)),
      highlighted: highlighted.subscribe(this.handleHighlight.bind(this)),
    }

    return () => {
      unsubscribers.locale()
      unsubscribers.data()
      unsubscribers.highlighted()

      if (this.map) {
        this.map.removeEventListener('select', this.handleSelection.bind(this))
        // this.removeEventListener(mapView, 'mousemove', this.handleMouseMove)
      }
    }
  }

  // setAnnotations(annotations) {
  //   annotations = annotations.map(({ coordinate, options }) => {
  //     const annotation = MapDecoder.decodeAnnotation(coordinate, options)
  //     MapItemStyler.style(annotation)
  //     return annotation
  //   })
  //   this.map.removeAnnotations(this.map.annotations)
  //   this.map.addAnnotations(annotations)
  // }

  // async setFeatures(features, id) {
  //   const items = await MapDecoder.loadFeatures(features, id)
  //   if (this.lastFeatureItems) this.map.removeItems(this.lastFeatureItems)
  //   if (items) this.map.addItems(items)
  //   this.lastFeatureItems = items
  // }

  // setMapParameters(parameters, animated = false) {
  //   const isNewLocation = this.lastId !== parameters.id
  //   this.setAnnotations(parameters.annotations)
  //   if (isNewLocation) {
  //     this.handleHighlightOff()
  //     this.setFeatures(parameters.features, parameters.id)
  //   }
  //   if (parameters.region && isNewLocation)
  //     this.setRegionAnimated(parameters.region, animated)

  //   this.paths = transform(
  //     parameters.items,
  //     (result, page, id) => {
  //       result[id] = page.path
  //     },
  //     {}
  //   )
  //   this.lastId = parameters.id
  // }

  highlightOverlays(id) {
    forEach(this.prevState.highlightedOverlays, overlay => {
      overlay.data.highlighted = false
      this.decoder.styler.styleOverlay(overlay)
    })
    const highlightedOverlays = id && filter(this.map.overlays, ['data.id', id])
    if (id) {
      forEach(highlightedOverlays, overlay => {
        if (overlay.enabled) {
          overlay.data.highlighted = true
          this.decoder.styler.styleOverlay(overlay)
        }
      })
      // move overlays to top
      this.map.removeOverlays(highlightedOverlays)
      this.map.addOverlays(highlightedOverlays)
    }

    this.prevState.highlightedOverlays = highlightedOverlays
  }

  handleHighlight(id) {
    if (
      typeof mapkit === 'undefined' ||
      !this.map ||
      id === this.prevState.highlighted
    ) {
      return
    }
    this.highlightOverlays(id)
    mapkit.TextAnnotation.setHighlightById(id)
    this.prevState.highlighted = id
  }

  handleSelection(event) {
    const id = getValue(event, 'overlay.data.id')
    const path = this.paths[id]
    if (path) {
      goto(path, { noscroll: true })
    }
  }

  // /**
  //  * Used to keep mapkit's language state up-to-date with the site's language state.
  //  */
  // handleRegionChange(scene) {
  //   if (typeof mapkit === 'undefined' || !this.map) return
  //   this.setMapParameters(scene, true)
  // }

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

  // handleMouseMove(event) {
  //   const targetOverlay = this.map.topOverlayAtPoint(
  //     new DOMPoint(event.pageX, event.pageY)
  //   )
  //   if (targetOverlay && targetOverlay.enabled) {
  //     this.stores.highlighted.set(targetOverlay.data.id)
  //   } else {
  //     this.stores.highlighted.set(undefined)
  //   }
  // }

  // handleTouchStart(event) {
  //   if (event.touches.length !== 1) return
  //   const { pageX, pageY } = event.touches[0]
  //   const targetOverlay = this.map.topOverlayAtPoint(new DOMPoint(pageX, pageY))
  //   if (targetOverlay && targetOverlay.enabled) {
  //     this.stores.highlighted.set(targetOverlay.data.id)
  //   }
  // }

  // handleMouseOut(event) {
  //   if (!event.currentTarget.contains(event.relatedTarget))
  //     this.stores.highlighted.set(undefined) // must have truly moused out of map view
  // }

  // handleHighlightOff() {
  //   this.stores.highlighted.set(undefined)
  // }

  // _getItemWithId(collection, id) {
  //   return id && find(collection, item => getValue(item, ['data', 'id']) === id)
  // }

  // _getItemsWithId(collection, id) {
  //   return (
  //     (id &&
  //       filter(collection, item => getValue(item, ['data', 'id']) === id)) ||
  //     []
  //   )
  // }
}
