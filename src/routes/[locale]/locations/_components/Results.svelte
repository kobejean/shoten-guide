<script>
  import { LOCATIONS_KEY } from '../_models/LocationsModel.js'
  import { _ } from 'svelte-i18n'
  import { getContext } from 'svelte'

  export let items = []

  const { current, highlighted } = getContext(LOCATIONS_KEY)
</script>

<section style="opacity:{$highlighted ? 0.4 : 1.0}">
  <header>
    <h3>
      {$_('locations.resultsTitle', { values: { location: $current.title } })}
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
