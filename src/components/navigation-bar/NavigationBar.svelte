<script>
  import LanguageMenu from './LanguageMenu.svelte'
  import NavigationItems from './NavigationItems.svelte'

  export let segment
</script>

<nav>
  <NavigationItems {segment} />
  <LanguageMenu />
</nav>

<style lang="scss">
  nav {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }
</style>
