<script context="module">
  export const SIDEBAR_KEY = {}
</script>

<script>
  import Map from '../map/Map.svelte'
  import SidebarHeader from './SidebarHeader.svelte'
  import SidebarItems from './SidebarItems.svelte'
  import { values } from 'lodash'
  import { getContext } from 'svelte'

  const { current, stack, highlighted } = getContext(SIDEBAR_KEY)

  $: items = values($current.items)
</script>

<aside>
  <article>
    <SidebarHeader stack={$stack} />
    <Map />
    <footer>
      <SidebarItems {items} bind:highlighted={$highlighted} />
    </footer>
  </article>
</aside>

<style lang="scss">
  @import '../../styles/colors';

  aside {
    min-width: 320px;
    article {
      margin-bottom: 2em;
      background-color: $neutral-light-gray;
      border: solid 1px $border-shadow;
      border-radius: 10px;
      overflow: hidden;
      /* to have content stay within border radius */
      -webkit-mask-image: -webkit-radial-gradient(white, black);
      -moz-mask-image: -moz-radial-gradient(white, black);
      mask-image: radial-gradient(white, black);
    }
  }

  @media (min-width: 720px) {
    aside {
      margin-right: 40px;
    }
  }
</style>
