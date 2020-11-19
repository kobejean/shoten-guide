<script context="module">
  import { get } from 'svelte/store'
  import { path as pathStore } from '../../../components/sidebar/store'
  export async function preload(page, session) {}
</script>

<script>
  import Map from '../../../components/map/Map.svelte'
  import Sidebar from '../../../components/sidebar/Sidebar.svelte'
  import { stores } from '@sapper/app'
  import { _ } from 'svelte-i18n'

  const { page } = stores()
  page.subscribe($page => {
    const path =
      ($page.params.path && $page.params.path.filter(seg => !!seg)) || []
    pathStore.set(path)
  })

  export let segment
  segment // silence warning

  // if (typeof get(pathStore) === 'undefined') {
  //   pathStore.set($page.params.path.filter(seg => !!seg) || [])
  // }
</script>

<main>
  <Sidebar />
  <section id="content">
    <Map />
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
