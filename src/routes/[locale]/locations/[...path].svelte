<script context="module">
  import {
    preloadLocationNode,
    updateNodeAtPathWithParams,
    current,
  } from '../../../components/sidebar/store'
  import { _ } from 'svelte-i18n'
  export async function preload(page, session) {
    let { locale, path } = page.params
    path = (path && path.filter(seg => !!seg)) || []
    console.log(path, locale)
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
  <title>{$_('locations.title')}{` | ${$current.title}`}</title>
</svelte:head>

<h1>{$_('locations.pageName')}</h1>
<p>Showing locations for: {$current.title}</p>
