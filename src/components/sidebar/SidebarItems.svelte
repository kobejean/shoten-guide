<script>
  import { _ } from 'svelte-i18n'
  import { sortBy } from 'lodash'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  export let items
  let list

  $: sorted = sortBy(items, 'title')
  $: {
    sorted
  }
</script>

<ol class="sidebar-items" bind:this={list}>
  {#each sorted as item (item.id)}
    <li animate:flip transition:fade|local>
      <a href={item.path} rel={'prefetch'} sapper:noscroll> {item.title} </a>
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
      padding: 0 10px;
      margin-right: 8px;
      height: 28px;
      line-height: 28px;
      list-style: none;
      border-radius: 5px;
      border: solid 1px $border-shadow;

      a {
        display: block;
      }

      &.error-message {
        text-align: center;
        background-color: unset;
        border: none;
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>
