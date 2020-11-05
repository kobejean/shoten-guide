<script>
  import { onMount, onDestroy } from 'svelte'
  import { mountMapkit, unmountMapkit } from './mapkitUtils.js'

  onMount(mountMapkit)
  onDestroy(unmountMapkit)
</script>

<div id="map" role="application" aria-label="Map of Shoutengai" />

<style type="scss">
  @import '../../styles/colors';

  #map {
    width: auto;
    height: 600px;
    background-color: $neutral-lightgray;
    border: solid 1px $border-shadow;
    border-radius: 10px;
    overflow: hidden;
    /* to have content stay within border radius */
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    -moz-mask-image: -moz-radial-gradient(white, black);
    mask-image: radial-gradient(white, black);
  }
</style>
