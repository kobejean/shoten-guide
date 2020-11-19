import Annotation from './classes/Annotation'
import Coordinate from './classes/Coordinate'
import CoordinateSpan from './classes/CoordinateSpan'
import Localization from './classes/Localization'
import LocationNode from './classes/LocationNode'

const root = new LocationNode(
  'cities',
  {
    en: new Localization('Cities'),
    ja: new Localization('都市'),
    ko: new Localization('도시'),
  },
  new Coordinate(37.998915, 137.191162),
  new CoordinateSpan(15, 15)
)

// regions
new LocationNode(
  'aizu',
  {
    en: new Localization('Aizu'),
    ja: new Localization('会津'),
    ko: new Localization('아이즈'),
  },
  new Coordinate(37.4967762, 139.9267593),
  new CoordinateSpan(0.01, 0.01),
  new Annotation(new Coordinate(37.4967762, 139.9267593), {
    color: '#f4a56d',
    glyphText: '',
  }),
  root
)
new LocationNode(
  'kobe',
  {
    en: new Localization('Kobe'),
    ja: new Localization('神戸'),
    ko: new Localization('고베'),
  },
  new Coordinate(34.688392, 135.18649),
  new CoordinateSpan(0.01, 0.01),
  new Annotation(new Coordinate(34.688392, 135.18649), {
    color: '#f4a56d',
    glyphText: '',
  }),
  root
)

export default root

// const REGION_DATA = {
//   aizu: {
//     center: { latitude: 37.4967762, longitude: 139.9267593 },
//     span: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
//     annotations: [
//       {
//         color: '#f4a56d',
//         title: '神明通り商店街',
//         glyphText: '🛍',
//         center: { latitude: 37.4967762, longitude: 139.9267593 },
//       },
//     ],
//   },
//   kobe: {
//     center: { latitude: 34.688392, longitude: 135.18649 },
//     span: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
//     annotations: [
//       {
//         color: '#f4a56d',
//         title: '元町商店街',
//         glyphText: '🛍',
//         center: { latitude: 34.688392, longitude: 135.18649 },
//       },
//     ],
//   },
// }
