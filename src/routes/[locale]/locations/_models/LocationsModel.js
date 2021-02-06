import { derived, writable } from 'svelte/store'
import { last, forEach, get } from 'lodash-es'
import MapController from '../../../../components/map/_models/MapController.js'
import { getFromCacheOrFetch } from '../../../../utils/cache.js'

class LocationsModel {
  async _fetch(ctx, path) {
    const res = await ctx.fetch(`api/content${path}`)

    if (res.status === 200) {
      return await res.json()
    }
    ctx.error(res.status, res.message)
    return null
  }

  _getStack([data, segments]) {
    const stack = [data.locations]
    forEach(segments, seg => stack.push(last(stack).items[seg]))
    return stack
  }

  _getSegments(path) {
    return path
      .split('/')
      .filter(seg => seg)
      .splice(2) // ignore /:locale/locations
  }

  async fetchModel(ctx, path) {
    const data = await this._fetch(ctx, path)
    if (!data) return null
    const segments = this._getSegments(path)
    const model = this.getModelData(segments, data)
    MapController.preload(model.current)
    return model
  }

  async preload(ctx, page, session) {
    const model = await getFromCacheOrFetch(
      LocationsModel.caches,
      `model/${page.path}`,
      async () => this.fetchModel(ctx, page.path)
    )
    return { model }
  }

  getModelData(segments, data) {
    const stack = this._getStack([data, segments])
    const current = last(stack)
    return { stack, current }
  }

  initStores(modelData) {
    // shared stores
    const model = writable(modelData)
    const stack = derived(model, $model => $model.stack)
    const current = derived(model, $model => $model.current)
    const highlighted = writable()
    const shared = {
      model,
      stack,
      current,
      highlighted,
    }
    // breadcrumbs stores
    const breadcrumbs = { stack, current }
    // sidebar stores
    const sidebar = { stack, current, highlighted }
    return { shared, breadcrumbs, sidebar }
  }

  updateStores(stores, model) {
    stores.shared.model.set(model)
  }
}
// static properties
LocationsModel.caches = new Map()

// singleton pattern
const instance = new LocationsModel()
Object.freeze(instance)
export default instance

export const LOCATIONS_KEY = {}
