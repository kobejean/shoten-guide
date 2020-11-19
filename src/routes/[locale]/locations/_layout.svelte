<script context="module">
  import { get } from 'svelte/store'
  import { path as pathStore } from '../../../components/sidebar/store'
  export async function preload(page, session) {
    if (typeof get(pathStore) === 'undefined') {
      const { region } = page.params
      pathStore.set([region].filter(seg => seg))
    }
    return {}
  }
</script>

<script>
  import Map from '../../../components/map/Map.svelte'
  import Sidebar from '../../../components/sidebar/Sidebar.svelte'
  import { stores } from '@sapper/app'
  import { _ } from 'svelte-i18n'

  const { page } = stores()
  page.subscribe($page => {
    const { region } = $page.params
    pathStore.set([region].filter(seg => seg))
  })

  export let segment
  segment // silence warning
</script>

<main>
  <Sidebar />
  <section id="content">
    <Map region={$page.params.region} />
    <slot />
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    max-width: 1400px;
    #content {
      margin-left: 40px;
      width: 100%;
    }
  }
</style>
