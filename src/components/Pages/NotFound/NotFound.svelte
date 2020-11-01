<script>
  import { Link } from 'svelte-routing'
  import { _ } from 'svelte-i18n'
</script>

{$_('notFound.errorMessage')}
<Link to="/">{$_('notFound.linkBackHome')}</Link>
