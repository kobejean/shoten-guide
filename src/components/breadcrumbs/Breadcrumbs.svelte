<script>
  import { last } from 'lodash-es'
  export let breadcrumbs
  $: current = last(breadcrumbs)
</script>

<nav aria-label="breadcrumbs">
  <p>
    {#each breadcrumbs.slice(0, -1) as page (page.id)}
      <a href={page.path} sapper:prefetch sapper:noscroll data-test={page.id}
        >{page.title}</a
      >
    {/each}
    <span aria-current="location">{current.title}</span>
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

    a:not(:last-child)::after {
      display: inline-block;
      color: #000;
      content: '>';
      font-size: 80%;
      font-weight: bold;
      padding: 0 5px;
    }
  }
</style>
