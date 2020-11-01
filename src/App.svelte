<script>
  import { Router, Route } from 'svelte-routing'
  import { _ } from 'svelte-i18n'
  import { setupI18n, isLoadingLocale } from './services/i18n/client'
  import NavigationBar from './components/Layout/NavigationBar/NavigationBar.svelte'
  import Home from './components/Pages/Home/Home.svelte'
  import About from './components/Pages/About/About.svelte'
  import NotFound from './components/Pages/NotFound/NotFound.svelte'

  export let serverInit // This property is necessary to pass server data and ensure smooth hydration

  const { serverStore, locale } = setupI18n(serverInit)

  $: basepath = '/' + ($locale || '')
</script>

{#if !$isLoadingLocale}
  <Router {basepath} url={$serverStore.pathname}>
    <NavigationBar />
    <main>
      <Route path="about" component={About} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </main>
  </Router>
{/if}

<style lang="scss">
  :global(html) {
    font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
      'Arial', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
