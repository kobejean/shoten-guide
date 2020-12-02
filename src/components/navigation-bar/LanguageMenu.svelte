<script>
  import { locale, locales, _ } from 'svelte-i18n'
  import { pathWithReplacedLocale } from '../../utils/path.js'
  import { stores } from '@sapper/app'
  const { page } = stores()
</script>

<ul>
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

<style lang="scss">
  @import './styles/navigation-items.scss';
</style>
