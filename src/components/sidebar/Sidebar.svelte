<script context="module">
  export const SIDEBAR_KEY = {}
</script>

<script>
  import Map from '../map/Map.svelte'
  import SidebarHeader from './SidebarHeader.svelte'
  import SidebarItems from './SidebarItems.svelte'
  import { values } from 'lodash'
  import { getContext } from 'svelte'

  const { current, stack } = getContext(SIDEBAR_KEY)

  $: items = values($current.items)
</script>

<aside>
  <SidebarHeader stack={$stack} />
  <Map />
  <footer>
    <SidebarItems {items} />
  </footer>
</aside>

<style lang="scss">
  @import '../../styles/colors';

  aside {
    min-width: 320px;
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
