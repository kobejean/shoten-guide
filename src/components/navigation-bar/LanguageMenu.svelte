<script>
  import { locale, locales, _ } from 'svelte-i18n'
  import { pathWithReplacedLocale } from '../../utils/path.js'
  import { stores } from '@sapper/app'
  import { onMount } from 'svelte'
  const { page } = stores()

  let expanded = false
  let languageMenu

  function focusChanged() {
    expanded = languageMenu.matches(':focus-within')
  }

  onMount(() => {
    focusChanged()
    document.addEventListener('focus', focusChanged, true)
  })
</script>

<svelte:window on:focus={() => focusChanged()} />

<li
  bind:this={languageMenu}
  data-test="language-menu"
  on:mouseenter={() => (expanded = true)}
  on:mouseleave={() => (expanded = false)}
  aria-expanded={expanded}
>
  <button aria-haspopup="true" aria-label="Language Options"
    >{$_(`locale.${$locale}`)}</button
  >
  <ul role="menu" aria-label="Language Options">
    {#each $locales as _locale (_locale)}
      <li>
        <a
          role="menuitem"
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
  @import '../../styles/colors';

  li {
    min-width: 100px;
    display: block;

    ul {
      background-color: white;
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
    background-color: $primary;
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
