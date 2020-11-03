<script>
  import { onMount, onDestroy } from 'svelte'
  import { mountMapkit, unmountMapkit } from './mapkitUtils.js'

  onMount(mountMapkit)
  onDestroy(unmountMapkit)
</script>

<div id="map" />

<style>
  #map {
    width: 100%;
    height: 600px;
  }
</style>
