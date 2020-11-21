<script context="module">
  import LocationsModel, { LOCATIONS_KEY } from './_models/LocationsModel.js'

  export async function preload(page, session) {
    return LocationsModel.preload(this, page, session)
  }
</script>

<script>
  import Map, { MAP_KEY } from '../../../components/map/Map.svelte'
  import Sidebar, {
    SIDEBAR_KEY,
  } from '../../../components/sidebar/Sidebar.svelte'
  import Breadcrumbs, {
    BREADCRUMBS_KEY,
  } from '../../../components/breadcrumbs/Breadcrumbs.svelte'
  import { _ } from 'svelte-i18n'
  import { setContext } from 'svelte'

  export let segment, model
  segment // silence warning

  const stores = LocationsModel.initStores(model)
  setContext(LOCATIONS_KEY, stores.shared)
  setContext(BREADCRUMBS_KEY, stores.breadcrumbs)
  setContext(SIDEBAR_KEY, stores.sidebar)
  setContext(MAP_KEY, stores.map)
  $: LocationsModel.updateStores(stores, model)
</script>

<Breadcrumbs />
<main>
  <Sidebar />
  <section id="content">
    <slot />
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    padding: 0 2em;
    max-width: 1400px;
    #content {
      margin-left: 40px;
      width: 100%;
    }
  }
</style>
