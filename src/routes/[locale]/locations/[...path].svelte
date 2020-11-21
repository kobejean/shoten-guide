<script>
  import { LOCATIONS_KEY } from './_models/LocationsModel.js'
  import { _ } from 'svelte-i18n'
  import { getContext } from 'svelte'

  const { current } = getContext(LOCATIONS_KEY)
</script>

<svelte:head>
  <title>{$_('locations.titlePrefix') + $current.title}</title>
</svelte:head>

<h1>{$current.title}</h1>
<p>Showing locations for: {$current.title}</p>
