import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import { isEqual, find, get as getValue, forEach } from 'lodash'
import { goto } from '@sapper/app'
import TextAnnotation from '../TextAnnotation.svelte'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

let map

/**
 * Handles initializing mapkit.
 */
const initMap = async () => {
  mapkit.init({
    authorizationCallback: function (done) {
      fetch('/api/jwt/mapkit-token')
        .then(response => response.json())
        .then(result => done(result.token))
    },
    language: get(locale),
  })
  console.log('initMap')
}

/**
 * Handles loading the map with the desired region and annotations.
 */
const loadMap = async mapStores => {
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
  map = new mapkit.Map('map', mapOptions)

  map.addEventListener('select', handleSelection)

  const annotations = get(mapStores.annotations)
  const region = get(mapStores.region)
  const overlays = get(mapStores.overlays)
  moveToScene({ annotations, region, overlays }, false)
  console.log({ annotations, region, overlays })
}

/**
 * Used to keep mapkit's language state up-to-date with the site's language state.
 */
const handleLanguageChange = async language => {
  if (typeof mapkit === 'undefined') return
  // setting language is an expensive operation so let's let other updates occur first
  setTimeout(() => (mapkit.language = language), 0)
}

let lastRegion
const setRegionAnimated = (region, animated = false) => {
  lastRegion = region
  const center = new mapkit.Coordinate(
    region.center.latitude,
    region.center.longitude
  )
  const span = new mapkit.CoordinateSpan(
    region.span.latitudeDelta,
    region.span.longitudeDelta
  )
  region = new mapkit.CoordinateRegion(center, span)
  map.setRegionAnimated(region, animated)
}

let lastAnnotations
const setAnnotations = annotations => {
  lastAnnotations = annotations
  annotations = annotations.map(annotation => {
    const coordinate = new mapkit.Coordinate(
      annotation.coordinate.latitude,
      annotation.coordinate.longitude
    )
    let options = annotation.options
    if (options.data.type === 'text') {
      options = {
        ...options,
        anchorOffset: new DOMPoint(0, 10),
        glyphColor: 'transparent',
        color: 'transparent',
        enabled: false,
      }
    }
    return new mapkit.MarkerAnnotation(coordinate, options)
  })
  map.removeAnnotations(map.annotations)
  map.addAnnotations(annotations)
}

let lastOverlayIds
const setOverlays = overlays => {
  lastOverlayIds = overlays.map(overlay => overlay.options.data.id)
  if (!overlays || overlays.length === 0) map.removeOverlays(map.overlays)
  let oldOverlays = map.overlays
  forEach(overlays, ({ geoJSON, options }) => {
    mapkit.importGeoJSON(geoJSON, {
      styleForOverlay: function (overlay) {
        Object.assign(overlay.style, options.style)
        overlay.style.fillOpacity = 0.2
        return overlay.style
      },
      itemForPolygon: function (overlay, geoJSON) {
        overlay.data = options.data
        return overlay
      },
      geoJSONDidComplete: function (itemCollection) {
        if (oldOverlays) {
          map.removeOverlays(oldOverlays)
          oldOverlays = null
        }
        if (itemCollection) map.addItems(itemCollection)
      },
      geoJSONDidError: function (err) {
        console.error(err)
      },
    })
  })
}

const moveToScene = (scene, animated = false) => {
  if (scene.region && !isEqual(lastRegion, scene.region)) {
    setRegionAnimated(scene.region, animated)
  }
  if (
    typeof scene.annotations === 'object' &&
    !isEqual(lastAnnotations, scene.annotations)
  ) {
    setAnnotations(scene.annotations)
  }
  const overlayIds =
    scene.overlays && scene.overlays.map(overlay => overlay.options.data.id)
  if (!isEqual(overlayIds, lastOverlayIds)) {
    setOverlays(scene.overlays)
  }
  console.log('scene', scene)
}

const getItemWithId = (collection, id) => {
  return id && find(collection, item => getValue(item, ['data', 'id']) === id)
}

let lastHighlightId
export const selectAnnotationWithId = id => {
  if (typeof mapkit === 'undefined' || !map || id === lastHighlightId) return
  const lastOverlay = getItemWithId(map.overlays, lastHighlightId)
  const overlay = getItemWithId(map.overlays, id)
  if (lastOverlay) lastOverlay.style.fillOpacity = 0.2
  if (overlay) overlay.style.fillOpacity = 0.4

  lastHighlightId = id
  const ann = getItemWithId(map.annotations, id)
  if (
    id !== getValue(map, ['selectedAnnotation', 'data', 'id']) &&
    (!ann || ann.enabled)
  ) {
    map.selectedAnnotation = ann
  }
}

/**
 * Used to keep mapkit's language state up-to-date with the site's language state.
 */
export const handleRegionChange = (annotations, region, overlays) => {
  if (typeof mapkit === 'undefined' || !map) return
  moveToScene({ annotations, region, overlays }, true)
}

export const handleSelection = event => {
  if (event.overlay && event.overlay.data.path) {
    goto(event.overlay.data.path, { noscroll: true })
  }
}

/**
 * Handles loading mapkit and any other setup that needs to happen when the Map component is mounted.
 */
export const mountMapkit = mapStores => {
  console.log('mountMapkit')
  if (typeof mapkit === 'undefined') {
    // load script, init map and load it on first mount
    loadScript(MAPKIT_SOURCE, () => {
      initMap()
      loadMap(mapStores)
    })
  } else {
    // just load map on subsequent mounts
    loadMap(mapStores)
  }

  // unsubscribe on unmount
  const unsubscribe = locale.subscribe(handleLanguageChange)
  return async () => {
    if (map) map.removeEventListener('select', handleSelection)
    map = null
    lastAnnotations = null
    lastRegion = null
    unsubscribe()
  }
}
