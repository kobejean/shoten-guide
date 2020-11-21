import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'
import { isEqual } from 'lodash'

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

  const annotations = get(mapStores.annotations)
  const region = get(mapStores.region)
  moveToScene({ annotations, region }, false)
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
    return new mapkit.MarkerAnnotation(coordinate, annotation.options)
  })
  map.removeAnnotations(map.annotations)
  map.addAnnotations(annotations)
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
}

/**
 * Used to keep mapkit's language state up-to-date with the site's language state.
 */
export const handleRegionChange = (annotations, region) => {
  if (typeof mapkit === 'undefined' || !map) return
  moveToScene({ annotations, region }, true)
}

/**
 * Handles loading mapkit and any other setup that needs to happen when the Map component is mounted.
 */
export const mountMapkit = mapStores => {
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
    map = null
    lastAnnotations = null
    lastRegion = null
    unsubscribe()
  }
}
