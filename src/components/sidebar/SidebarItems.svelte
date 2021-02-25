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
      event.preventDefault()
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
    <li transition:fade|local class:disabled={!item.enabled}>
      <a
        class="btn"
        href={(item.enabled && item.path) || undefined}
        sapper:prefetch
        sapper:noscroll
        on:mouseover={e => setHighlight(item, true)}
        on:touchstart={setHighlightFactory(item, true)}
        on:mouseout={handleMouseOut}
        on:touchcancel={e => setHighlight(item, false)}
        on:touchend={e => setHighlight(item, false)}
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
    padding: 10px 10px 0 10px;
    border-top: solid 1px $border-shadow;
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    max-height: 130px;

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
        margin: -5px;
        padding: 5px 15px;
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
