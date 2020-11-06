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
  <title>{$_('about.title')}</title>
</svelte:head>

<h1>{$_('about.pageName')}</h1>
<a href="{locationsPath}/aizu/">Aizu</a>
<a href="{locationsPath}/kobe/">Kobe</a>
<p>Region: {region}</p>

<style lang="scss">
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
