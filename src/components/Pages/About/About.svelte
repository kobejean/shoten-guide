<script>
	import { _ } from "svelte-i18n";
</script>

<h1>{$_('about.pageName')}</h1>
<p>{@html $_('about.welcome')}</p>

<style>
    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
</style>