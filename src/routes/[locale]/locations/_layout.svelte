<script context="module">
  import LocationsModel, { LOCATIONS_KEY } from './_models/LocationsModel.js'

  export async function preload(page, session) {
    return LocationsModel.preload(this, page, session)
  }
</script>

<script>
  import Sidebar, {
    SIDEBAR_KEY,
  } from '../../../components/sidebar/Sidebar.svelte'
  import Breadcrumbs, {
    BREADCRUMBS_KEY,
  } from '../../../components/breadcrumbs/Breadcrumbs.svelte'
  import { _ } from 'svelte-i18n'
  import { setContext } from 'svelte'
  import Description from './_components/Description.svelte'
  import Results from './_components/Results.svelte'

  export let segment, model
  segment // silence warning

  const stores = LocationsModel.initStores(model)
  setContext(LOCATIONS_KEY, stores.shared)
  setContext(BREADCRUMBS_KEY, stores.breadcrumbs)
  setContext(SIDEBAR_KEY, stores.sidebar)
  $: LocationsModel.updateStores(stores, model)

  const { current } = stores.shared
</script>

<svelte:head>
  <title>{$_('locations.title', { values: { title: $current.title } })}</title>
</svelte:head>

<header>
  <Breadcrumbs />
</header>
<main>
  <Sidebar />
  <article id="content">
    <Description title={$current.title} description={$current.description} />
    <slot />
    <Results />
  </article>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-wrap: nowrap;
  }

  #content {
    width: 100%;
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
