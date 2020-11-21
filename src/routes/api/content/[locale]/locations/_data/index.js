import Annotation from './classes/Annotation'
import Coordinate from './classes/Coordinate'
import CoordinateRegion from './classes/CoordinateRegion'
import CoordinateSpan from './classes/CoordinateSpan'
import Localization from './classes/Localization'
import LocationNode from './classes/LocationNode'

const root = new LocationNode(
  'japan',
  {
    en: new Localization('Japan'),
    ja: new Localization('全国'),
    ko: new Localization('일본'),
  },
  new CoordinateRegion(
    new Coordinate(37.998915, 137.191162),
    new CoordinateSpan(15, 15)
  )
)

// regions
const regions = {
  tohoku: new LocationNode(
    'tohoku',
    {
      en: new Localization('Tōhoku'),
      ja: new Localization('東北'),
      ko: new Localization('도호쿠'),
    },
    new CoordinateRegion(
      new Coordinate(39.15245085865503, 140.61050231135908),
      new CoordinateSpan(5, 5)
    ),
    new Annotation(new Coordinate(39.15245085865503, 140.61050231135908), {
      color: '#f4a56d',
      glyphText: '',
    }),
    root
  ),
  kansai: new LocationNode(
    'kansai',
    {
      en: new Localization('Kansai'),
      ja: new Localization('関西'),
      ko: new Localization('간사이'),
    },
    new CoordinateRegion(
      new Coordinate(34.60110581401916, 135.61687800686803),
      new CoordinateSpan(2.3, 2.3)
    ),
    new Annotation(new Coordinate(34.60110581401916, 135.61687800686803), {
      color: '#f4a56d',
      glyphText: '',
    }),
    root
  ),
}

// prefectures

const prefectures = {
  fukushima: new LocationNode(
    'fukushima',
    {
      en: new Localization('Fukushima'),
      ja: new Localization('福島県'),
      ko: new Localization('후쿠시마현'),
    },
    new CoordinateRegion(
      new Coordinate(37.37868022126601, 140.10356778964822),
      new CoordinateSpan(1.5, 1.5)
    ),
    new Annotation(new Coordinate(37.37868022126601, 140.10356778964822), {
      color: '#f4a56d',
      glyphText: '',
    }),
    regions.tohoku
  ),
  hyogo: new LocationNode(
    'hyogo',
    {
      en: new Localization('Hyōgo'),
      ja: new Localization('兵庫県'),
      ko: new Localization('효고현'),
    },
    new CoordinateRegion(
      new Coordinate(34.913663, 134.858898),
      new CoordinateSpan(1.63, 1.63)
    ),
    new Annotation(new Coordinate(34.913663, 134.858898), {
      color: '#f4a56d',
      glyphText: '',
    }),
    regions.kansai
  ),
  'osaka-prefecture': new LocationNode(
    'osaka-prefecture',
    {
      en: new Localization('Ōsaka Prefecture'),
      ja: new Localization('大阪県'),
      ko: new Localization('오사카 현'),
    },
    new CoordinateRegion(
      new Coordinate(34.660681, 135.497049),
      new CoordinateSpan(0.98, 0.98)
    ),
    new Annotation(new Coordinate(34.660681, 135.497049), {
      color: '#f4a56d',
      glyphText: '',
    }),
    regions.kansai
  ),
}

const cities = {
  'aizu-wakamatsu': new LocationNode(
    'aizu-wakamatsu',
    {
      en: new Localization('Aizu-Wakamatsu'),
      ja: new Localization('会津若松市'),
      ko: new Localization('아이즈 와카 마쓰시'),
    },
    new CoordinateRegion(
      new Coordinate(37.45245000176763, 139.9755647876439),
      new CoordinateSpan(0.42, 0.42)
    ),
    new Annotation(new Coordinate(37.45245000176763, 139.9755647876439), {
      color: '#f4a56d',
      glyphText: '',
    }),
    prefectures.fukushima
  ),
  kobe: new LocationNode(
    'kobe',
    {
      en: new Localization('Kobe'),
      ja: new Localization('神戸市'),
      ko: new Localization('고베시'),
    },
    new CoordinateRegion(
      new Coordinate(34.75744002805822, 135.10667798819213),
      new CoordinateSpan(0.4, 0.4)
    ),
    new Annotation(new Coordinate(34.75744002805822, 135.10667798819213), {
      color: '#f4a56d',
      glyphText: '',
    }),
    prefectures.hyogo
  ),
  osaka: new LocationNode(
    'osaka',
    {
      en: new Localization('Ōsaka'),
      ja: new Localization('大阪市'),
      ko: new Localization('오사카시'),
    },
    new CoordinateRegion(
      new Coordinate(34.660681, 135.497049),
      new CoordinateSpan(0.3, 0.3)
    ),
    new Annotation(new Coordinate(34.660681, 135.497049), {
      color: '#f4a56d',
      glyphText: '',
    }),
    prefectures['osaka-prefecture']
  ),
}

const districts = {
  'shimeidouri-shotengai': new LocationNode(
    'shimeidouri-shotengai',
    {
      en: new Localization('Shinmei-dōri Shōtengai'),
      ja: new Localization('神明通り商店街'),
      ko: new Localization('신명 도리 상점가'),
    },
    new CoordinateRegion(
      new Coordinate(37.4967762, 139.9267593),
      new CoordinateSpan(0.01, 0.01)
    ),
    new Annotation(new Coordinate(37.4967762, 139.9267593), {
      color: '#f4a56d',
      glyphText: '🛍',
    }),
    cities['aizu-wakamatsu']
  ),
  'motomachi-shotengai': new LocationNode(
    'motomachi-shotengai',
    {
      en: new Localization('Motomachi Shōtengai'),
      ja: new Localization('元町商店街'),
      ko: new Localization('모토마치 상점가'),
    },
    new CoordinateRegion(
      new Coordinate(34.688392, 135.18649),
      new CoordinateSpan(0.01, 0.01)
    ),
    new Annotation(new Coordinate(34.688392, 135.18649), {
      color: '#f4a56d',
      glyphText: '🛍',
    }),
    cities.kobe
  ),
}

export default root
