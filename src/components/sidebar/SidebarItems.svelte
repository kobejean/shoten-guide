<script>
  import { _ } from 'svelte-i18n'
  import { orderBy } from 'lodash'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  export let items,
    highlighted = undefined

  $: sorted = orderBy(items, ['enabled', 'title'], ['desc', 'asc'])
</script>

<ol class="sidebar-items">
  {#each sorted as item (item.id)}
    <li animate:flip transition:fade|local class:disabled={!item.enabled}>
      <a
        class="btn"
        href={(item.enabled && item.path) || undefined}
        rel={'prefetch'}
        sapper:noscroll
        on:mouseover={() => item.enabled && (highlighted = item.id)}
        on:touchstart={() => item.enabled && (highlighted = item.id)}
        on:mouseout={() => item.enabled && (highlighted = null)}
        on:touchcancel={() => item.enabled && (highlighted = null)}
        on:touchend={() => item.enabled && (highlighted = null)}
      >
        {item.title}
      </a>
    </li>
  {:else}
    <li class="error-message">{$_('locations.sidebar.emptyMessage')}</li>
  {/each}
</ol>

<style lang="scss">
  @import '../../styles/colors';

  ol {
    margin: 0;
    padding: 10px;
    border-top: solid 1px $border-shadow;
    display: flex;
    flex-wrap: wrap;

    li {
      background-color: $neutral-super-light-gray;
      text-decoration: none;
      margin-right: 8px;
      margin-bottom: 8px;
      height: 28px;
      line-height: 28px;
      list-style: none;
      border-radius: 5px;
      border: solid 1px $border-shadow;

      a {
        padding: 0 10px;
        display: block;
      }

      &.error-message {
        padding: 0 10px;
        text-align: center;
        background-color: unset;
        border: none;
        height: 30px;
        line-height: 30px;
      }

      &.disabled {
        opacity: 0.6;
      }
    }
  }
</style>
