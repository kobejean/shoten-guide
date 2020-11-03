<script>
  import { Router, Route } from 'svelte-routing'
  import { _ } from 'svelte-i18n'
  import { setupI18n, isLoadingLocale } from './services/i18n/client'
  import NavigationBar from './components/layout/navigation-bar/NavigationBar.svelte'
  import Home from './components/pages/home/Home.svelte'
  import About from './components/pages/about/About.svelte'
  import NotFound from './components/pages/not-found/NotFound.svelte'

  export let serverInit // This property is necessary to pass server data and ensure smooth hydration

  const { serverStore, locale } = setupI18n(serverInit)

  $: basepath = '/' + ($locale || '')
</script>

{#if !$isLoadingLocale}
  <Router {basepath} url={$serverStore.pathname}>
    <NavigationBar />
    <!-- One of these route components will display depending on the path-->
    <Route path="about" component={About} />
    <Route path="/" component={Home} />
    <Route component={NotFound} />
  </Router>
{/if}

<style lang="scss">
  :global(html) {
    font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
      'Arial', sans-serif;
  }

  :global(main) {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    :global(main) {
      max-width: none;
    }
  }
</style>
