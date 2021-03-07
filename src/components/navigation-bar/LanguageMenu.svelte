<script>
  import { locale, locales, _ } from 'svelte-i18n'
  import { pathWithReplacedLocale } from '../../utils/path.js'
  import { stores } from '@sapper/app'
  const { page } = stores()
</script>

<li data-test="language-menu">
  <button aria-haspopup="true">{$_(`locale.${$locale}`)}</button>
  <ul aria-label="submenu">
    {#each $locales as _locale (_locale)}
      <li>
        <a
          class="btn"
          aria-current={_locale === $locale ? 'page' : undefined}
          href={pathWithReplacedLocale($page.path, _locale)}
          sapper:noscroll
          lang={_locale}
        >
          {$_(`locale.${_locale}`)}
        </a>
      </li>
    {/each}
  </ul>
</li>

<style lang="scss">
  li {
    min-width: 100px;
    display: block;

    ul {
      visibility: hidden;
      position: absolute;
      z-index: 100;
      margin: 0;
      padding: 0;
      border: solid 1px rgba(255, 62, 0, 0.1);
    }

    /* clearfix */
    ul::after {
      content: '';
      display: block;
      clear: both;
    }

    &:hover ul,
    ul:hover,
    &:focus-within ul {
      visibility: visible;
    }
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::before {
    position: absolute;
    content: '';
    width: 2px;
    height: 100%;
    background-color: rgb(255, 62, 0);
    left: -1px;
    top: 0;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  button {
    text-decoration: none;
    margin: 0;
    padding: 1em 0.5em;
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-weight: inherit;
    font-size: inherit;
    color: inherit;
    box-sizing: content-box;
    line-height: inherit;
  }
</style>
