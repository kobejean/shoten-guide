import amagasaki from './amagasaki.geojson'
import kobe from './kobe.geojson'

export default [amagasaki, kobe].flatMap(data => data.features)
