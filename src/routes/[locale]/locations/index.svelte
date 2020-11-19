<script context="module">
  import {
    preloadLocationNode,
    updateNodeAtPathWithParams,
  } from '../../../components/sidebar/store'
  import { _ } from 'svelte-i18n'
  export async function preload(page, session) {
    const { locale } = page.params
    const path = []
    const locationNode = await preloadLocationNode(locale, path, this)
    return { path, locationNode }
  }
</script>

<script>
  import { onMount } from 'svelte'
  export let path, locationNode
  onMount(() => updateNodeAtPathWithParams(path, locationNode))
</script>

<svelte:head>
  <title>{$_('locations.title')}</title>
</svelte:head>

<h1>{$_('locations.pageName')}</h1>

<p>Please select a city.</p>
