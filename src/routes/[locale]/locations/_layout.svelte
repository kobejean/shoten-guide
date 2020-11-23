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

  console.log('model', model)

  const stores = LocationsModel.initStores(model)
  setContext(LOCATIONS_KEY, stores.shared)
  setContext(BREADCRUMBS_KEY, stores.breadcrumbs)
  setContext(SIDEBAR_KEY, stores.sidebar)
  setContext(MAP_KEY, stores.map)
  $: LocationsModel.updateStores(stores, model)
</script>

<header>
  <Breadcrumbs />
</header>
<main>
  <Sidebar />
  <section id="content">
    <slot />
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-wrap: nowrap;
  }

  main,
  header {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 2em;
    max-width: 1400px;
  }

  @media (max-width: 720px) {
    main {
      flex-direction: column;
    }

    main,
    header {
      padding: 0 1em;
    }
  }
</style>
