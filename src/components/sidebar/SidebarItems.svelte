<script>
  import { locale } from 'svelte-i18n'
  import { current } from '../../components/sidebar/store'

  $: items = ($current && Object.values($current.items)) || []
</script>

<ol class="sidebar-items">
  {#each items as item (item.id)}
    <a href={`${$locale}${item.pathFromLocale}`} sapper:noscroll>
      <li>{item.title}</li>
    </a>
  {:else}
    <li>No locations to display.</li>
  {/each}
</ol>

<style lang="scss">
  @import '../../styles/colors';

  ol {
    margin: 0;
    padding: 0;
    li {
      padding: 10px;
      line-height: 30px;
      list-style: none;
      border-bottom: solid 1px $border-shadow;
    }
  }
</style>
