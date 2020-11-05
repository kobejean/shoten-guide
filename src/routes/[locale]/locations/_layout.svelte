<script context="module">
  export async function preload(page, session) {}
</script>

<script>
  import Map from '../../../components/map/Map.svelte'
  export let segment
</script>

<slot {segment} />
<Map />

<style lang="scss">
</style>
