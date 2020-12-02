<script>
  import { _ } from 'svelte-i18n'
  import { afterUpdate } from 'svelte'
  export let title, description

  let header,
    overflow = false,
    collapsed = true

  function updateOverflow() {
    overflow = header.clientHeight < header.scrollHeight
  }

  function toggleExpand() {
    collapsed = !collapsed
  }

  afterUpdate(updateOverflow)
</script>

<svelte:window on:resize={updateOverflow} />

<header class:overflow class:collapsed bind:this={header}>
  <h1>{title}</h1>

  {#if description}
    <p>
      {@html description}
    </p>
  {:else}
    <p>{$_('locations.noDescription')}</p>
  {/if}
  {#if overflow || !collapsed}
    <span class="show-more-btn" on:click={toggleExpand}>
      {#if collapsed}
        {$_('locations.showMore')}
      {:else}{$_('locations.hideMore')}{/if}</span>
  {/if}
</header>

<style lang="scss">
  header {
    position: relative;
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 2em;

    &.collapsed {
      max-height: calc(
        4 * (1.2em + 0.5em) + (3 * 1.5em)
      ); /* exactly three lines */
    }

    &:not(.collapsed) {
      padding-bottom: 1.5em;
    }

    p {
      margin-block-end: 0;
    }

    .show-more-btn {
      text-align: right;
      text-decoration: underline;
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
    }
  }
</style>
