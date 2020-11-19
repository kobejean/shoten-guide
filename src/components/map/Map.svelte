<script>
  import { onMount } from 'svelte'
  import { mountMapkit, handleRegionChange } from './mapkitUtils.js'
  import { current } from '../sidebar/store'
  $: annotations = $current.annotations
  $: center = $current.center
  $: span = $current.span

  onMount(mountMapkit)

  $: handleRegionChange(annotations, center, span)
</script>

<div id="map" role="application" aria-label="Map of Shoutengai" />

<style type="scss">
  @import '../../styles/colors';

  #map {
    width: 320px;
    height: 320px;
    float: right;
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
