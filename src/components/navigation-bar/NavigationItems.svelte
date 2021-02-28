<script>
  import { locale, _ } from 'svelte-i18n'

  $: navTabs = [
    // {
    //   title: $_('nav.home'),
    //   segment: undefined,
    // },
    {
      title: $_('nav.locations'),
      segment: 'locations',
      prefetch: true,
    },
    {
      title: $_('nav.about'),
      segment: 'about',
    },
    {
      title: $_('nav.blog'),
      segment: 'blog',
      prefetch: true,
    },
  ]

  export let segment
</script>

<ul>
  {#each navTabs as tab (tab.segment)}
    <li>
      <a
        class="btn"
        sapper:prefetch={tab.prefetch}
        aria-current={segment === tab.segment ? 'page' : undefined}
        href={`${$locale}/${tab.segment || ''}`}
      >
        {tab.title}
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    // display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
</style>
