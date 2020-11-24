import { derived, writable } from 'svelte/store'
import { last, forEach } from 'lodash'
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

  _getStack([data, path]) {
    const stack = [data.locations]
    forEach(path, seg => stack.push(last(stack).items[seg]))
    return stack
  }

  async fetchModel(ctx, path) {
    const data = await this._fetch(ctx, path)
    if (!data) return null
    path = path
      .split('/')
      .filter(seg => seg)
      .splice(2) // ignore /:locale/locations
    const model = this.getModelData(path, data)
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

  getModelData(path, data) {
    const stack = this._getStack([data, path])
    const current = last(stack)
    return { stack, current }
  }

  initStores(modelData) {
    console.log()
    // shared stores
    const model = writable(modelData)
    const stack = derived(model, $model => $model.stack)
    const current = derived(model, $model => $model.current)
    const highlighted = writable()
    const shared = { model, stack, current, highlighted }
    // breadcrumbs stores
    const breadcrumbs = { stack, current }
    // sidebar stores
    const sidebar = { stack, current, highlighted }
    // map stores
    const map = { current, highlighted }
    return { shared, breadcrumbs, sidebar, map }
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
