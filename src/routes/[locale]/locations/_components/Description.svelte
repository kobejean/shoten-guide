<script>
  import { _ } from 'svelte-i18n'
  import { afterUpdate } from 'svelte'
  import { fade } from 'svelte/transition'
  export let title, description

  let header,
    overflow = false,
    collapsed = true

  function updateOverflow() {
    setTimeout(() => (overflow = header.clientHeight < header.scrollHeight), 50)
  }

  function toggleExpand() {
    collapsed = !collapsed
    if (!collapsed) {
      header.style.maxHeight = `${header.scrollHeight}px`
    }
  }

  $: {
    title, description // subscribe to these props
    collapsed = true // collapse when we have new content
  }

  afterUpdate(updateOverflow)
</script>

<svelte:window on:resize={updateOverflow} />

<header class:collapsed bind:this={header}>
  <h1>{title}</h1>

  {#if description}
    <p>
      {@html description}
    </p>
  {:else}
    <p>{$_('locations.noDescription')}</p>
  {/if}
  {#if overflow || !collapsed}
    <span class="show-more-container" transition:fade|local={{ duration: 200 }}>
      <button on:click={toggleExpand}>
        {#if collapsed}
          {$_('locations.showMore')}
        {:else}{$_('locations.hideMore')}{/if}
      </button>
    </span>
  {/if}
</header>

<style lang="scss">
  header {
    position: relative;
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 2em;
    transition: all 0.2s ease-in-out;
    transition-property: max-height, padding-bottom;

    &.collapsed {
      max-height: calc(
        4 * (1.2em + 0.5em) + (3 * 1.5em)
      ) !important; /* exactly three lines */
    }

    &:not(.collapsed) {
      padding-bottom: 1.5em;
    }

    p {
      margin-block-end: 0;
    }

    .show-more-container {
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 70%;
      height: 1.5em;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1) 50%
      );
      button {
        background: none;
        text-decoration: underline;
        border: none;
        padding: 0 !important;
        cursor: pointer;
        font-size: inherit;
      }
    }
  }
</style>
