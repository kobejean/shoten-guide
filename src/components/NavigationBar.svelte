<script>
  import { locale, locales, _ } from 'svelte-i18n'
  import { pathWithReplacedLocale } from '../utils/path.js'
  import { stores } from '@sapper/app'
  const { page } = stores()

  const navTabs = [
    {
      localizationKey: 'nav.home',
      segment: undefined,
    },
    {
      localizationKey: 'nav.locations',
      segment: 'locations',
    },
    {
      localizationKey: 'nav.about',
      segment: 'about',
    },
    {
      localizationKey: 'nav.blog',
      segment: 'blog',
      prefetch: true,
    },
  ]

  export let segment
</script>

<nav>
  <ul>
    {#each navTabs as tab (tab.localizationKey)}
      <li>
        <a
          rel={tab.prefetch ? 'prefetch' : undefined}
          aria-current={segment === tab.segment ? 'page' : undefined}
          href={`${$locale}/${tab.segment || ''}`}>{$_(tab.localizationKey)}</a>
      </li>
    {/each}
  </ul>
  <ul>
    {#each $locales as _locale (_locale)}
      <li>
        <a
          aria-current={_locale === $locale ? 'page' : undefined}
          href={pathWithReplacedLocale($page.path, _locale)}
          sapper:noscroll>{$_(`locale.${_locale}`)}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
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
