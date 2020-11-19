<script context="module">
  import { current, updateNodeAtPath } from '../../../components/sidebar/store'
  import { _, locale } from 'svelte-i18n'

  const TITLES = {
    aizu: 'Aizu',
    kobe: 'Kobe',
  }
  export async function preload({ params }) {
    const { region } = params
    const path = [region]
    const sidebarParams = {
      title: TITLES[region],
      items: {},
    }

    updateNodeAtPath(path, $current => Object.assign($current, sidebarParams))
    return { region, path, sidebarParams }
  }
</script>

<script>
  import { onMount } from 'svelte'
  export let region, path, sidebarParams
  onMount(() =>
    updateNodeAtPath(path, $current => Object.assign($current, sidebarParams))
  )
  $: locationsPath = `${$locale}/locations`
</script>

<svelte:head>
  <title>{$_('locations.title')}{` | ${$current.title}`}</title>
</svelte:head>

<h1>{$_('locations.pageName')}</h1>
<p>Showing locations for: {region}</p>
