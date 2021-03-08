<script>
  import { _ } from 'svelte-i18n'

  export let items = [],
    title
</script>

<section>
  <header>
    <h3>
      {$_('locations.resultsTitle', { values: { location: title } })}
    </h3>
  </header>
  <ul>
    {#each items as item (item.id)}
      <li />
    {:else}
      <li>{$_('locations.noResults')}</li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @import '../../../../styles/colors';

  section {
    background-color: $neutral-light-gray;
    border: solid 1px $border-shadow;
    border-radius: 10px;
  }

  header {
    padding: 10px;
    border-bottom: solid 1px $border-shadow;

    h3 {
      display: inline;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 10px;
    }
  }
</style>
