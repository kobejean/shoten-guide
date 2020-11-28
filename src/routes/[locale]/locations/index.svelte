<script>
  import { LOCATIONS_KEY } from './_models/LocationsModel.js'
  import { _ } from 'svelte-i18n'
  import { getContext } from 'svelte'
  import { get } from 'lodash-es'

  const { current, highlighted } = getContext(LOCATIONS_KEY)
  $: active = get($current, ['items', $highlighted], $current)
</script>

<svelte:head>
  <title>{$_('locations.title')}</title>
</svelte:head>

<h1>{active.title}</h1>

{#if active.description}
  <p>
    {@html active.description}
  </p>
{:else}
  <p>No Description Available</p>
{/if}

<hr />

<p style="opacity:{$highlighted ? 0.4 : 1.0}">
  Please select a region in the sidebar.
</p>
