<script>
  import { LOCATIONS_KEY } from './_models/LocationsModel.js'
  import { _ } from 'svelte-i18n'
  import { getContext } from 'svelte'
  import { get } from 'lodash'

  const { current, highlighted } = getContext(LOCATIONS_KEY)
  $: highlightTitle =
    get($current, ['items', $highlighted, 'title']) || $current.title
</script>

<svelte:head>
  <title>{$_('locations.titlePrefix') + $current.title}</title>
</svelte:head>

<h1>{highlightTitle}</h1>
<p>Showing locations for: {$current.title}</p>
