<script>
  import { Link } from 'svelte-routing'
  import { _ } from 'svelte-i18n'
</script>

<svelte:head>
  <title>{$_('notFound.title')}</title>
</svelte:head>

<main>
  {$_('notFound.errorMessage')}
  <Link to="/">{$_('notFound.linkBackHome')}</Link>
</main>
