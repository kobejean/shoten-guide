<script context="module">
  export const MAP_KEY = {}
</script>

<script>
  import { onMount, getContext } from 'svelte'
  import MapModel from './_models/MapModel.js'

  const model = new MapModel()

  const stores = getContext(MAP_KEY)
  const { annotations, region, overlays, highlighted } = stores
  $: scene = { annotations: $annotations, region: $region, overlays: $overlays }

  let map

  onMount(() => model.mount(scene, map))

  $: model.handleRegionChange(scene)
  $: model.handleHighlight($highlighted)
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
