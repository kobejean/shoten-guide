<script context="module">
  import { get } from 'svelte/store'
  import { path as pathStore } from '../../../components/sidebar/store'
  import {
    current,
    updateNodeAtPathWithParams,
  } from '../../../components/sidebar/store'
  import { _, locale } from 'svelte-i18n'
  export async function preload(page, session) {
    const { locale, path } = page.params
    const [region] = path

    if (typeof get(pathStore) === 'undefined') {
      pathStore.set(path)
    }

    const pathString = path.reduce((acc, seg) => acc + '/' + seg, '')
    const res = await this.fetch(
      `api/locations${pathString}.json?locale=${locale}`
    )

    if (res.status === 200) {
      const sidebarParams = await res.json()
      updateNodeAtPathWithParams(path, sidebarParams)
      return { region, path, sidebarParams }
    } else {
      this.error(res.status, data.message)
    }
  }
</script>

<script>
  import { onMount } from 'svelte'
  export let region, path, sidebarParams
  onMount(() => updateNodeAtPathWithParams(path, sidebarParams))
  $: locationsPath = `${$locale}/locations`
</script>

<svelte:head>
  <title>{$_('locations.title')}{` | ${$current.title}`}</title>
</svelte:head>

<h1>{$_('locations.pageName')}</h1>
<p>Showing locations for: {region}</p>
