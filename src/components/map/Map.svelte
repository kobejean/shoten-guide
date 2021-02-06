<script context="module">
  export const MAP_KEY = {}
</script>

<script>
  import { onMount, getContext } from 'svelte'
  import MapController from './_models/MapController.js'

  const controller = new MapController(getContext(MAP_KEY))
  const { current, highlighted } = controller.stores

  let map

  onMount(() => controller.mount($current, map))

  $: controller.handleRegionChange($current)
  $: controller.handleHighlight($highlighted)
</script>

<div bind:this={map} role="application" aria-label="Map of store locations" />

<style type="scss">
  @import '../../styles/colors';

  div {
    min-width: 320px;
    height: 320px;
    background-color: $neutral-super-light-gray;
  }

  @media (max-width: 420px) {
    div {
      height: 200px;
    }
  }
</style>
