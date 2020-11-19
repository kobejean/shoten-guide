<script context="module">
  import { updateNodeAtPath } from '../../../components/sidebar/store'
  export async function preload(page, session) {
    const path = []
    const sidebarParams = {
      title: 'Cities',
      items: {
        kobe: {
          title: 'Kobe',
          id: 'kobe',
          pathFromLocale: `/locations/kobe`,
          items: {},
        },
        aizu: {
          title: 'Aizu',
          id: 'aizu',
          pathFromLocale: `/locations/aizu`,
          items: {},
        },
      },
    }

    updateNodeAtPath(path, $current => Object.assign($current, sidebarParams))
    return { path, sidebarParams }
  }
</script>

<script>
  import { locale, _ } from 'svelte-i18n'
  import { onMount } from 'svelte'

  export let path, sidebarParams

  onMount(() =>
    updateNodeAtPath(path, $current => Object.assign($current, sidebarParams))
  )

  $: pathPrefix = `${$locale}/locations`
</script>

<svelte:head>
  <title>{$_('locations.title')}</title>
</svelte:head>

<h1>{$_('locations.pageName')}</h1>

<p>Please select a city.</p>
