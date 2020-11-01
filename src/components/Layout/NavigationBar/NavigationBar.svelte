<script>
  import { Link } from 'svelte-routing'
  import LocaleLink from '../../Shared/LocaleLink.svelte'
  import { _ } from 'svelte-i18n'
</script>

<nav>
  <Link to="/">{$_('nav.home')}</Link>
  <Link to="about">{$_('nav.about')}</Link>
</nav>
<nav>
  <LocaleLink locale="en">{$_('locale.en')}</LocaleLink>
  <LocaleLink locale="ja">{$_('locale.ja')}</LocaleLink>
  <LocaleLink locale="ko">{$_('locale.ko')}</LocaleLink>
</nav>
