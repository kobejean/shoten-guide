<script context="module">
  export const BREADCRUMBS_KEY = {}
</script>

<script>
  import { getContext } from 'svelte'
  const { current, stack } = getContext(BREADCRUMBS_KEY)
</script>

<nav>
  <ol>
    {#each $stack as page (page.id)}
      <li>
        {#if page.id === $current.id}
          {page.title}
        {:else}
          <a href={page.path} rel={'prefetch'} sapper:noscroll>{page.title}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style lang="scss">
  @import '../../styles/colors';
  nav {
    display: flex;
    padding: 0 2em;
    max-width: 1400px;
    margin: 0 auto;
    box-sizing: border-box;

    ol {
      list-style: none;
      padding-left: 0;
      display: inline-flex;
      flex-wrap: wrap;

      li {
        a::after {
          display: inline-block;
          color: #000;
          content: '>';
          font-size: 80%;
          font-weight: bold;
          padding: 0 5px;
        }
      }
    }
  }
</style>
