<script>
  import { _ } from 'svelte-i18n'
</script>

<svelte:head>
  <title>{$_('home.title')}</title>
</svelte:head>

<main>
  <h1>{$_('home.pageName')}</h1>
  <p>
    {@html $_('home.welcome')}
  </p>
</main>

<style lang="scss">
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
