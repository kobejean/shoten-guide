import { loadScript } from '../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

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
const loadMap = async () => {
  const MarkerAnnotation = mapkit.MarkerAnnotation
  const shimeiDouriShoutengai = new mapkit.Coordinate(37.4967762, 139.9267593)
  const shimeiDouriShoutengaiRegion = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(37.4967762, 139.9267593),
    new mapkit.CoordinateSpan(0.01, 0.01)
  )
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
  const map = new mapkit.Map('map', mapOptions)

  const shimeiDouriShoutengaiAnnotation = new MarkerAnnotation(
    shimeiDouriShoutengai,
    {
      color: '#f4a56d',
      title: '神明通り商店街',
      glyphText: '🛍',
    }
  )
  map.showItems([shimeiDouriShoutengaiAnnotation])
  map.region = shimeiDouriShoutengaiRegion
}

/**
 * Used to keep mapkit's language state up-to-date with the site's language state.
 */
const handleLanguageChange = async language => {
  if (typeof mapkit === 'undefined') return
  // setting language is an expensive operation so let's let other updates occur first
  setTimeout(() => (mapkit.language = language), 0)
}

/**
 * Handles loading mapkit and any other setup that needs to happen when the Map component is mounted.
 */
export const mountMapkit = () => {
  if (typeof mapkit === 'undefined') {
    // load script, init map and load it on first mount
    loadScript(MAPKIT_SOURCE, () => {
      initMap()
      loadMap()
    })
  } else {
    // just load map on subsequent mounts
    loadMap()
  }
  // unsubscribe on unmount
  return locale.subscribe(handleLanguageChange)
}
