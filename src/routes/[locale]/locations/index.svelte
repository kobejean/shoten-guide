<script>
  import { locale, _ } from 'svelte-i18n'
  $: pathPrefix = `${$locale}/locations`
</script>

<a href="{pathPrefix}/aizu/">Aizu</a>
<a href="{pathPrefix}/kobe/">Kobe</a>
