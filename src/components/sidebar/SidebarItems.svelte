<script>
  import { locale, _ } from 'svelte-i18n'
  import { current, tree } from '../../components/sidebar/store'

  $: items = ($current && Object.values($current.items)) || []
  $: console.log(JSON.stringify($tree, null, 2))
</script>

<ol class="sidebar-items">
  {#each items as item (item.id)}
    <a
      href={`${$locale}${item.pathFromLocale}`}
      rel={'prefetch'}
      sapper:noscroll
    >
      <li>{item.title}</li>
    </a>
  {:else}
    <li class="error-message">{$_('locations.sidebar.emptyMessage')}</li>
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

      &.error-message {
        text-align: center;
      }
    }
  }
</style>
