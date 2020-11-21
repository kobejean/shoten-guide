<script context="module">
  export const MAP_KEY = {}
</script>

<script>
  import { onMount, getContext } from 'svelte'
  import { mountMapkit, handleRegionChange } from './_models/MapModel.js'

  const stores = getContext(MAP_KEY)
  const { annotations, region } = stores

  onMount(() => mountMapkit(stores))

  $: handleRegionChange($annotations, $region)
</script>

<div id="map" role="application" aria-label="Map of store locations" />

<style type="scss">
  @import '../../styles/colors';

  #map {
    width: 320px;
    height: 320px;
    background-color: $neutral-lightgray;
  }
</style>
