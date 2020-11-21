<script context="module">
  export const MAP_KEY = {}
</script>

<script>
  import { onMount, getContext } from 'svelte'
  import {
    mountMapkit,
    handleRegionChange,
    selectAnnotationWithId,
  } from './_models/MapModel.js'

  const stores = getContext(MAP_KEY)
  const { annotations, region, highlighted } = stores

  onMount(() => mountMapkit(stores))

  $: handleRegionChange($annotations, $region)
  $: selectAnnotationWithId($highlighted)
</script>

<div id="map" role="application" aria-label="Map of store locations" />

<style type="scss">
  @import '../../styles/colors';

  #map {
    min-width: 320px;
    height: 320px;
    background-color: $neutral-light-gray;
  }

  @media (max-width: 420px) {
    #map {
      height: 200px;
    }
  }
</style>
