<script>
  import NavigationBar from '../components/NavigationBar.svelte'
  import { stores } from '@sapper/app'
  import { isLocaleLoaded } from '../services/i18n/helpers.js'
  import { locale as localeStore } from 'svelte-i18n'
  const { session } = stores()

  export let status, error

  const dev = process.env.NODE_ENV === 'development'

  // if we're at root or locale was never initialized we need to get it from session
  $: locale = $localeStore || $session.sessionLocale
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

{#if $isLocaleLoaded}
  <NavigationBar segment="error" />
{/if}
<main>
  <h1>{status}</h1>

  <p>{error.message}</p>
  <p>
    <a href="#back" on:click|preventDefault={() => history.go(-1)}>Go Back</a>
    or go to
    <a href={`${locale}/`}>Home</a>
  </p>

  {#if dev && error.stack}
    <pre>{error.stack}</pre>
  {/if}
</main>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
