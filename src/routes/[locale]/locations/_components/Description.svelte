<script>
  import { _ } from 'svelte-i18n'
  export let active
</script>

<header class="fade">
  <h1>{active.title}</h1>

  {#if active.description}
    <p>
      {@html active.description}
    </p>
  {:else}
    <p>{$_('locations.noDescription')}</p>
  {/if}
</header>

<style lang="scss">
  header {
    position: relative;
    height: calc(4 * (1.2em + 0.5em) + (3 * 1.5em)); /* exactly three lines */
    overflow: hidden;
    box-sizing: content-box;
    margin-bottom: 2em;

    &:after {
      content: '';
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 70%;
      height: 1.2em;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1) 50%
      );
    }
  }
</style>
