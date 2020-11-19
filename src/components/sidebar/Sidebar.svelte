<script>
  import { locale } from 'svelte-i18n'
  import { parent, current } from '../../components/sidebar/store'
  import Breadcrumbs from './Breadcrumbs.svelte'
  import SidebarItems from './SidebarItems.svelte'

  $: items = ($current && Object.values($current.items)) || []
</script>

<aside>
  <Breadcrumbs />
  <SidebarItems />
</aside>

<style lang="scss">
  @import '../../styles/colors';

  aside {
    min-height: 320px;
    min-width: 280px;
    max-width: 320px;
    background-color: $neutral-lightgray;
    border: solid 1px $border-shadow;
    border-radius: 10px;
  }
</style>
