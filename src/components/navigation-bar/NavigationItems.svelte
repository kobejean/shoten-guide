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
        rel={tab.prefetch ? 'prefetch' : undefined}
        aria-current={segment === tab.segment ? 'page' : undefined}
        href={`${$locale}/${tab.segment || ''}`}
      >
        {tab.title}
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  @import './styles/navigation-items.scss';
</style>
