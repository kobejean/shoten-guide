<script context="module">
  import { _, locale } from 'svelte-i18n'
  export async function preload({ params }) {
    return { region: params.region }
  }
</script>

<script>
  export let region
  $: locationsPath = `${$locale}/locations`
</script>

<svelte:head>
  <title>{$_('locations.title')}</title>
</svelte:head>

<h1>{$_('locations.pageName')}</h1>
<a href="{locationsPath}/aizu/">Aizu</a>
<a href="{locationsPath}/kobe/">Kobe</a>
<p>Region: {region}</p>
