<script context="module">
  import { preloadLocale } from '../../services/i18n/preload.js'
  import { waitLocale } from 'svelte-i18n'

  export async function preload(page, session) {
    await preloadLocale(this, page, session)
    await waitLocale()
  }
</script>

<script>
  import NavigationBar from '../../components/navigation-bar/NavigationBar.svelte'
  import { stores } from '@sapper/app'
  import { locale } from 'svelte-i18n'

  export let segment

  // keep svelte-i18n locale store updated when locale url param changes
  const { page } = stores()
  $: {
    if ($locale !== $page.params.locale) locale.set($page.params.locale)
  }
</script>

<header>
  <NavigationBar {segment} />
</header>
<slot />

<style lang="scss">
  @import '../../styles/colors';

  :global(main) {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(main h1) {
    color: $primary;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
