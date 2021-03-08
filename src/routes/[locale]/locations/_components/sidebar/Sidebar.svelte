<script>
  import Map from '../../../../../components/map/Map.svelte'
  import SidebarHeader from './SidebarHeader.svelte'
  import SidebarItems from './SidebarItems.svelte'
  import { nth } from 'lodash-es'
  import { getContext } from 'svelte'
  import { CONTEXT_KEYS } from '../../../../../utils/context'

  const { data, highlighted } = getContext(CONTEXT_KEYS.LOCATIONS)

  $: items = $data.location.children
  $: current = nth($data.breadcrumbs, -1)
  $: parent = nth($data.breadcrumbs, -2)
</script>

<aside>
  <article data-test="map-navigation">
    <SidebarHeader {current} {parent} />
    <Map />
    <footer>
      <SidebarItems {items} bind:highlighted={$highlighted} />
    </footer>
  </article>
</aside>

<style lang="scss">
  @import '../../../../../styles/colors';

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
      width: 320px;
      margin-right: 2em;
    }
  }
</style>
