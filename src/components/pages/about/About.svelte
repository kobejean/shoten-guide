<script>
  import { _ } from 'svelte-i18n'
  import Map from '../../shared/map/Map.svelte'
</script>

<svelte:head>
  <title>{$_('about.title')}</title>
</svelte:head>

<h1>{$_('about.pageName')}</h1>
<p>
  {@html $_('about.welcome')}
</p>
<Map />

<style lang="scss">
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
