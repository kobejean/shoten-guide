<script context="module">
  import { setLocale } from '../../services/i18n/setup.js'
  import { LOCALE_IMPORTS } from '../../services/i18n/constants.js'
  import { register, waitLocale, isLoading, init, locale } from 'svelte-i18n'

  // register locale lifes
  Object.entries(LOCALE_IMPORTS).forEach(([locale, fn]) => register(locale, fn))

  export async function preload(page, session) {
    await setLocale(this, page, session)
    await waitLocale()
  }
</script>

<script>
  import Nav from '../../components/Nav.svelte'

  export let segment
</script>

{#if typeof $locale === 'string' && !$isLoading}
  <Nav {segment} />

  <slot />
{/if}

<style>
  :global(main) {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
