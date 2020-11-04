import { loadScript } from '../../../utils/scriptLoad'
import { locale } from 'svelte-i18n'
import { get } from 'svelte/store'

const MAPKIT_SOURCE = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

/**
 * Handles initializing mapkit.
 */
const initMap = () => {
  mapkit.init({
    authorizationCallback: function (done) {
      fetch('/services/jwt/mapkit-token')
        .then(response => response.json())
        .then(result => done(result.token))
    },
    language: get(locale),
  })
}

/**
 * Handles loading the map with the desired region and annotations.
 */
const loadMap = () => {
  const MarkerAnnotation = mapkit.MarkerAnnotation
  const shimeiDouriShoutengai = new mapkit.Coordinate(37.4967762, 139.9267593)
  const shimeiDouriShoutengaiRegion = new mapkit.CoordinateRegion(
    new mapkit.Coordinate(37.4967762, 139.9267593),
    new mapkit.CoordinateSpan(0.01, 0.01)
  )
  const map = new mapkit.Map('map')

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
const handleLanguageChange = language => {
  if (typeof mapkit === 'undefined') return
  // setting language is an expensive operation so let's let other updates occur first
  setTimeout(() => (mapkit.language = language), 0)
}

// need to keep the localeUnsubscriber until time to unmount and unsubscribe
let localeUnsubscriber
/**
 * Handles loading mapkit and any other setup that needs to happen when the Map component is mounted.
 */
export const mountMapkit = () => {
  localeUnsubscriber = locale.subscribe(handleLanguageChange)
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
}

/**
 * Handles things like unsubscribing to stores when mapkit is no longer in use.
 */
export const unmountMapkit = () => {
  localeUnsubscriber && localeUnsubscriber()
}
