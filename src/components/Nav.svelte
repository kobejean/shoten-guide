<script>
  import { locale, locales, _ } from 'svelte-i18n'
  import { pathWithReplacedLocale } from '../utils/path.js'
  import { stores } from '@sapper/app'
  const { page } = stores()

  export let segment
</script>

<nav>
  <ul>
    <li>
      <a
        aria-current={segment === undefined ? 'page' : undefined}
        href="{$locale}/">{$_('nav.home')}</a>
    </li>
    <li>
      <a
        aria-current={segment === 'about' ? 'page' : undefined}
        href="{$locale}/about/">{$_('nav.about')}</a>
    </li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'blog' ? 'page' : undefined}
        href="{$locale}/blog/">{$_('nav.blog')}</a>
    </li>
  </ul>
  <ul>
    {#each $locales as _locale}
      <li>
        <a
          aria-current={_locale === $locale ? 'page' : undefined}
          href={pathWithReplacedLocale($page.path, _locale)}>{$_(`locale.${_locale}`)}</a>
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
