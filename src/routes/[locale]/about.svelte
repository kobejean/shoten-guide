<script>
  import { _ } from 'svelte-i18n'
</script>

<svelte:head>
  <title>{$_('about.title')}</title>
</svelte:head>

<main>
  <h1>{$_('about.pageName')}</h1>
  {@html $_('about.info')}
</main>
