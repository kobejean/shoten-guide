<script>
  import { _ } from 'svelte-i18n'
  import { orderBy } from 'lodash-es'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  export let items,
    highlighted = undefined

  $: sorted = orderBy(items, ['enabled', 'rank'], ['desc', 'asc'])

  function setHighlight(item, on) {
    if (item.enabled) highlighted = on ? item.id : null
  }
  function setHighlightFactory(item, on) {
    return event => {
      event.stopPropagation()
      setHighlight(item, on)
    }
  }

  function handleMouseOut(event) {
    const isToEnabledButton =
      event.relatedTarget &&
      event.relatedTarget.className.split(' ').includes('btn') &&
      !event.relatedTarget.parentNode.className.split(' ').includes('disabled')
    if (!isToEnabledButton) highlighted = null
  }
</script>

<ol class="sidebar-items">
  {#each sorted as item (item.id)}
    <li
      transition:fade|local
      class:disabled={!item.enabled}
      on:mouseover={setHighlightFactory(item, true)}
      on:touchstart={setHighlightFactory(item, true)}
      on:mouseout={handleMouseOut}
      on:touchcancel={setHighlightFactory(item, false)}
      on:touchend={setHighlightFactory(item, false)}
    >
      <a
        class="btn"
        href={(item.enabled && item.path) || undefined}
        sapper:prefetch
        sapper:noscroll
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
    padding: 6px;
    border-top: solid 1px $border-shadow;
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    max-height: 130px;

    li {
      text-decoration: none;
      padding: 4px;
      height: 28px;
      line-height: 28px;
      list-style: none;

      a {
        background-color: $neutral-super-light-gray;
        border-radius: 5px;
        border: solid 1px $border-shadow;
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
        opacity: 0.4;
      }
    }
  }
</style>
