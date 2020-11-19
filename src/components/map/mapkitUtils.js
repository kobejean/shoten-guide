import { loadScript } from '../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

let map

const REGION_DATA = {
  aizu: {
    center: { latitude: 37.4967762, longitude: 139.9267593 },
    span: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
    annotations: [
      {
        color: '#f4a56d',
        title: '神明通り商店街',
        glyphText: '🛍',
        center: { latitude: 37.4967762, longitude: 139.9267593 },
      },
    ],
  },
  kobe: {
    center: { latitude: 34.688392, longitude: 135.18649 },
    span: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
    annotations: [
      {
        color: '#f4a56d',
        title: '元町商店街',
        glyphText: '🛍',
        center: { latitude: 34.688392, longitude: 135.18649 },
      },
    ],
  },
}
const COUNTRY_DATA = {
  japan: {
    center: { latitude: 37.998915, longitude: 137.191162 },
    span: { latitudeDelta: 15, longitudeDelta: 15 },
    annotations: [
      {
        color: '#f4a56d',
        title: '会津',
        center: REGION_DATA.aizu.center,
      },
      {
        color: '#f4a56d',
        title: '神戸',
        center: REGION_DATA.kobe.center,
      },
    ],
  },
}

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
const loadMap = async region => {
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

  moveToRegion(region, false)
}

/**
 * Used to keep mapkit's language state up-to-date with the site's language state.
 */
const handleLanguageChange = async language => {
  if (typeof mapkit === 'undefined') return
  // setting language is an expensive operation so let's let other updates occur first
  setTimeout(() => (mapkit.language = language), 0)
}

const moveToScene = (data, animated = false) => {
  const center = new mapkit.Coordinate(
    data.center.latitude,
    data.center.longitude
  )
  const span = new mapkit.CoordinateSpan(
    data.span.latitudeDelta,
    data.span.longitudeDelta
  )
  const region = new mapkit.CoordinateRegion(center, span)

  const annotations = data.annotations.map(annotation => {
    const center = new mapkit.Coordinate(
      annotation.center.latitude,
      annotation.center.longitude
    )
    const options = {
      color: annotation.color,
      title: annotation.title,
      glyphText: annotation.glyphText || '',
    }
    return new mapkit.MarkerAnnotation(center, options)
  })

  map.removeAnnotations(map.annotations)
  map.addAnnotations(annotations)
  map.setRegionAnimated(region, animated)
}

const moveToRegion = (region, animated = false) => {
  if (!region) {
    moveToScene(COUNTRY_DATA.japan, animated)
  } else {
    moveToScene(REGION_DATA[region], animated)
  }
}

/**
 * Used to keep mapkit's language state up-to-date with the site's language state.
 */
export const handleRegionChange = region => {
  if (typeof mapkit === 'undefined') return
  moveToRegion(region, true)
}

/**
 * Handles loading mapkit and any other setup that needs to happen when the Map component is mounted.
 */
export const mountMapkit = region => {
  if (typeof mapkit === 'undefined') {
    // load script, init map and load it on first mount
    loadScript(MAPKIT_SOURCE, () => {
      initMap()
      loadMap(region)
    })
  } else {
    // just load map on subsequent mounts
    loadMap(region)
  }
  // unsubscribe on unmount
  return locale.subscribe(handleLanguageChange)
}
