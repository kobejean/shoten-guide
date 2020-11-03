<script>
  import LocaleLink from '../../shared/LocaleLink.svelte'
  import NavigationLink from './NavigationLink.svelte'
  import { _ } from 'svelte-i18n'
</script>

<nav>
  <NavigationLink to="/">{$_('nav.home')}</NavigationLink>
  <NavigationLink to="about">{$_('nav.about')}</NavigationLink>
</nav>
<nav>
  <LocaleLink locale="en">{$_('locale.en')}</LocaleLink>
  <LocaleLink locale="ja">{$_('locale.ja')}</LocaleLink>
  <LocaleLink locale="ko">{$_('locale.ko')}</LocaleLink>
</nav>

<style lang="scss">
  nav :global(a[aria-current]) {
    color: red;
  }
</style>
