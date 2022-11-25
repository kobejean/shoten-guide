<script>
  import { getContext } from 'svelte'
  import { CONTEXT_KEYS } from '../../../../../utils/context.js'
  import MapController from './classes/MapController.js'

  const stores = getContext(CONTEXT_KEYS.LOCATIONS)
  const controller = new MapController(stores)
</script>

<div
  use:controller.mount
  role="application"
  aria-label="Map of store locations"
/>

<style type="scss">
  @import '../../../../../styles/colors';

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
