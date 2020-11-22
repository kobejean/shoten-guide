import { derived, writable } from 'svelte/store'
import { last, forEach } from 'lodash'

class LocationsModel {
  async _fetch(ctx, path, locale) {
    const pathString = path.reduce((acc, seg) => `${acc}/${seg}`, '')
    const res = await ctx.fetch(`api/content/${locale}/locations${pathString}`)

    if (res.status === 200) {
      return await res.json()
    }
    ctx.error(res.status, res.message)
    return null
  }

  _getStack([locations, path]) {
    const stack = [locations]
    forEach(path, seg => stack.push(last(stack).items[seg]))
    return stack
  }

  async preload(ctx, page, session) {
    const path = page.path
      .split('/')
      .filter(seg => seg)
      .splice(2) // ignore /:locale/locations

    const data = await this._fetch(ctx, path, page.params.locale)

    const model = { path, data }
    return { model }
  }

  initStores(model) {
    // shared stores
    const path = writable(model.path)
    const locations = writable(model.locations)
    const highlighted = writable()
    const stack = derived([locations, path], this._getStack)
    const current = derived(stack, last)
    const shared = { path, locations, stack, current, highlighted }
    // breadcrumbs stores
    const breadcrumbs = { stack, current }
    // sidebar stores
    const sidebar = { stack, current, highlighted }
    // map stores
    const region = derived(current, $current => $current.region)
    const annotations = derived(current, $current => $current.annotations)
    const overlays = derived(current, $current => $current.overlays)
    const map = { region, annotations, overlays, highlighted }
    return { shared, breadcrumbs, sidebar, map }
  }

  updateStores(stores, model) {
    // sidebar stores
    const { path, locations } = stores.shared
    path.set(model.path)
    locations.set(model.data.locations)
    // map stores
  }
}

// singleton pattern
const instance = new LocationsModel()
Object.freeze(instance)
export default instance

export const LOCATIONS_KEY = {}
