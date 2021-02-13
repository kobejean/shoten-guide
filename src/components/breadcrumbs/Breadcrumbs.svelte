<script context="module">
  export const BREADCRUMBS_KEY = {}
</script>

<script>
  import { getContext } from 'svelte'
  const { current, stack } = getContext(BREADCRUMBS_KEY)
</script>

<nav>
  <p>
    {#each $stack as page (page.id)}
      {#if page.id === $current.id}
        {page.title}
      {:else}
        <a href={page.path} sapper:prefetch sapper:noscroll>{page.title}</a>
      {/if}
    {/each}
  </p>
</nav>

<style lang="scss">
  @import '../../styles/colors';
  nav {
    display: flex;
    margin: 0 auto;
    box-sizing: border-box;

    p {
      white-space: nowrap;
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;

      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }

    a::after {
      display: inline-block;
      color: #000;
      content: '>';
      font-size: 80%;
      font-weight: bold;
      padding: 0 5px;
    }
  }
</style>
