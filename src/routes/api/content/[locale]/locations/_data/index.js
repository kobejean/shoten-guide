import Annotation from './classes/Annotation'
import Coordinate from './classes/Coordinate'
import CoordinateRegion from './classes/CoordinateRegion'
import CoordinateSpan from './classes/CoordinateSpan'
import Localization from './classes/Localization'
import LocationNode from './classes/LocationNode'

// geojson
import regionsFeatures from './geo-json/regions'

import kansaiFeatures from './geo-json/regions/kansai'
import hyogoFeatures from './geo-json/regions/kansai/hyogo'

import tohokuFeatures from './geo-json/regions/tohoku'

// localizations
import japanLocalizations from './localizations/japan.js'

import kansaiLocalizations from './localizations/regions/kansai.js'
import osakaPrefectureLocalizations from './localizations/prefectures/kansai/osaka'
import hyogoLocalizations from './localizations/prefectures/kansai/hyogo'

import tohokuLocalizations from './localizations/regions/tohoku'
import fukushimaPrefectureLocalizations from './localizations/prefectures/tohoku/fukushima'

import metadata from './new/geo-json'

const root = LocationNode.fromStatic(metadata)

// const root = new LocationNode(
//   'japan',
//   japanLocalizations,
// new CoordinateRegion(
//   new Coordinate(37.998915, 137.191162),
//   new CoordinateSpan(16, 16)
// ),
//   null,
//   regionsFeatures
// )

// // regions
// const regions = {
//   chubu: new LocationNode(
//     'chubu',
//     {
//       en: new Localization('Chūbu'),
//       ja: new Localization('中部'),
//       ko: new Localization('중부'),
//     },
//     new CoordinateRegion(
//       new Coordinate(36.325202, 138.073215),
//       new CoordinateSpan(4.7, 4.7)
//     ),
//     new Annotation(new Coordinate(35.825202, 137.473215), {
//       data: { type: 'text' },
//     }),
//     null,
//     root
//   ),
//   chugoku: new LocationNode(
//     'chugoku',
//     {
//       en: new Localization('Chūgoku'),
//       ja: new Localization('中国'),
//       ko: new Localization('주고쿠'),
//     },
//     new CoordinateRegion(
//       new Coordinate(34.757729, 132.866525),
//       new CoordinateSpan(4.7, 4.7)
//     ),
//     new Annotation(new Coordinate(34.857729, 132.866525), {
//       data: { type: 'text' },
//     }),
//     null,
//     root
//   ),
//   hokkaido: new LocationNode(
//     'hokkaido',
//     {
//       en: new Localization('Hokkaidō'),
//       ja: new Localization('北海道'),
//       ko: new Localization('홋카이도'),
//     },
//     new CoordinateRegion(
//       new Coordinate(43.351133, 142.569544),
//       new CoordinateSpan(5, 5)
//     ),
//     new Annotation(new Coordinate(43.451133, 143.069544), {
//       data: { type: 'text' },
//     }),
//     null,
//     root
//   ),
//   kansai: new LocationNode(
//     'kansai',
//     kansaiLocalizations,
//     new CoordinateRegion(
//       new Coordinate(34.601106, 135.616878),
//       new CoordinateSpan(3.7, 3.7)
//     ),
//     new Annotation(new Coordinate(34.701106, 135.616878), {
//       data: { type: 'text' },
//     }),
//     kansaiFeatures,
//     root
//   ),
//   kanto: new LocationNode(
//     'kanto',
//     {
//       en: new Localization('Kantō'),
//       ja: new Localization('関東'),
//       ko: new Localization('관동'),
//     },
//     new CoordinateRegion(
//       new Coordinate(36.023515, 139.634759),
//       new CoordinateSpan(2.7, 2.7)
//     ),
//     new Annotation(new Coordinate(36.123515, 139.634759), {
//       data: { type: 'text' },
//     }),
//     null,
//     root
//   ),
//   kyushu: new LocationNode(
//     'kyushu',
//     {
//       en: new Localization('Kyūshū'),
//       ja: new Localization('九州'),
//       ko: new Localization('규슈'),
//     },
//     new CoordinateRegion(
//       new Coordinate(28.51352098415286, 127.62517679286353),
//       new CoordinateSpan(12.7, 12.7)
//     ),
//     new Annotation(new Coordinate(32.58890848826727, 130.82414415737875), {
//       data: { type: 'text' },
//     }),
//     null,
//     root
//   ),
//   shikoku: new LocationNode(
//     'shikoku',
//     {
//       en: new Localization('Shikoku'),
//       ja: new Localization('四国'),
//       ko: new Localization('시코쿠'),
//     },
//     new CoordinateRegion(
//       new Coordinate(33.560814, 133.382417),
//       new CoordinateSpan(2.7, 2.7)
//     ),
//     new Annotation(new Coordinate(33.749498, 133.637592), {
//       data: { type: 'text' },
//     }),
//     null,
//     root
//   ),
//   tohoku: new LocationNode(
//     'tohoku',
//     tohokuLocalizations,
//     new CoordinateRegion(
//       new Coordinate(39.152451, 140.610502),
//       new CoordinateSpan(5, 5)
//     ),
//     new Annotation(new Coordinate(39.152451, 140.780502), {
//       data: { type: 'text' },
//     }),
//     tohokuFeatures,
//     root
//   ),
// }

// // prefectures

// const prefectures = {
//   tohoku: {
//     fukushima: new LocationNode(
//       'fukushima',
//       fukushimaPrefectureLocalizations,
//       new CoordinateRegion(
//         new Coordinate(37.37868022126601, 140.10356778964822),
//         new CoordinateSpan(1.5, 1.5)
//       ),
//       new Annotation(new Coordinate(37.37868022126601, 140.10356778964822), {
//         data: { type: 'text' },
//       }),
//       null,
//       regions.tohoku
//     ),
//   },
//   kansai: {
//     hyogo: new LocationNode(
//       'hyogo',
//       hyogoLocalizations,
//       new CoordinateRegion(
//         new Coordinate(34.913663, 134.858898),
//         new CoordinateSpan(1.63, 1.63)
//       ),
//       new Annotation(new Coordinate(34.913663, 134.858898), {
//         data: { type: 'text' },
//       }),
//       hyogoFeatures,
//       regions.kansai
//     ),
//     'osaka-prefecture': new LocationNode(
//       'osaka-prefecture',
//       osakaPrefectureLocalizations,
//       new CoordinateRegion(
//         new Coordinate(34.660681, 135.497049),
//         new CoordinateSpan(0.98, 0.98)
//       ),
//       new Annotation(new Coordinate(34.660681, 135.557049), {
//         data: { type: 'text' },
//       }),
//       null,
//       regions.kansai
//     ),
//   },
// }

// const cities = {
//   'aizu-wakamatsu': new LocationNode(
//     'aizu-wakamatsu',
//     {
//       en: new Localization('Aizu-Wakamatsu'),
//       ja: new Localization('会津若松市'),
//       ko: new Localization('아이즈 와카 마쓰시'),
//     },
//     new CoordinateRegion(
//       new Coordinate(37.45245000176763, 139.9755647876439),
//       new CoordinateSpan(0.42, 0.42)
//     ),
//     new Annotation(new Coordinate(37.45245000176763, 139.9755647876439), {
//       color: '#f4a56d',
//       glyphText: '',
//     }),
//     null,
//     prefectures.tohoku.fukushima
//   ),
//   kobe: new LocationNode(
//     'kobe',
//     {
//       en: new Localization('Kobe'),
//       ja: new Localization('神戸市'),
//       ko: new Localization('고베시'),
//     },
//     new CoordinateRegion(
//       new Coordinate(34.75744002805822, 135.10667798819213),
//       new CoordinateSpan(0.4, 0.4)
//     ),
//     new Annotation(new Coordinate(34.75744002805822, 135.10667798819213), {
//       color: '#f4a56d',
//       glyphText: '',
//     }),
//     null,
//     prefectures.kansai.hyogo
//   ),
//   osaka: new LocationNode(
//     'osaka',
//     {
//       en: new Localization('Ōsaka'),
//       ja: new Localization('大阪市'),
//       ko: new Localization('오사카시'),
//     },
//     new CoordinateRegion(
//       new Coordinate(34.660681, 135.497049),
//       new CoordinateSpan(0.3, 0.3)
//     ),
//     new Annotation(new Coordinate(34.660681, 135.497049), {
//       color: '#f4a56d',
//       glyphText: '',
//     }),
//     null,
//     prefectures.kansai['osaka-prefecture']
//   ),
// }

// const districts = {
//   'shimeidouri-shotengai': new LocationNode(
//     'shimeidouri-shotengai',
//     {
//       en: new Localization('Shinmei-dōri Shōtengai'),
//       ja: new Localization('神明通り商店街'),
//       ko: new Localization('신명 도리 상점가'),
//     },
//     new CoordinateRegion(
//       new Coordinate(37.4967762, 139.9267593),
//       new CoordinateSpan(0.01, 0.01)
//     ),
//     new Annotation(new Coordinate(37.4967762, 139.9267593), {
//       color: '#f4a56d',
//       glyphText: '🛍',
//     }),
//     null,
//     cities['aizu-wakamatsu']
//   ),
//   'motomachi-shotengai': new LocationNode(
//     'motomachi-shotengai',
//     {
//       en: new Localization('Motomachi Shōtengai'),
//       ja: new Localization('元町商店街'),
//       ko: new Localization('모토마치 상점가'),
//     },
//     new CoordinateRegion(
//       new Coordinate(34.688392, 135.18649),
//       new CoordinateSpan(0.01, 0.01)
//     ),
//     new Annotation(new Coordinate(34.688392, 135.18649), {
//       color: '#f4a56d',
//       glyphText: '🛍',
//     }),
//     null,
//     cities.kobe
//   ),
// }

export default root
