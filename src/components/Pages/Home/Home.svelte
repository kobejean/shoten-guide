<script>
	import { _ } from "svelte-i18n";
</script>

<main>
    <h1>{$_('home.pageName')}</h1>
    <p>{@html $_('home.welcome')}</p>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>