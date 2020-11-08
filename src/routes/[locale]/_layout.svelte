<script context="module">
  import { preloadLocale } from '../../services/i18n/preload.js'
  import { waitLocale, locale } from 'svelte-i18n'

  export async function preload(page, session) {
    await preloadLocale(this, page, session)
    await waitLocale()
  }
</script>

<script>
  import NavigationBar from '../../components/NavigationBar.svelte'
  import { get } from 'svelte/store'
  import { stores } from '@sapper/app'

  export let segment

  // keep svelte-i18n locale store updated when locale url param changes
  const { page } = stores()
  page.subscribe(({ params }) => {
    if (get(locale) !== params.locale) {
      locale.set(params.locale)
    }
  })
</script>

<NavigationBar {segment} />
<slot />

<style>
  :global(main) {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(main h1) {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
