<script>
	import { Router, Route } from "svelte-routing";
	import { setupI18n, isLoadingLocale } from "./services/i18n/i18n";
	import { locale, _ } from 'svelte-i18n';
	import NavigationBar from './components/Layout/NavigationBar/NavigationBar.svelte';
	import Home from './components/Pages/Home/Home.svelte';
	import About from './components/Pages/About/About.svelte';
	import NotFound from './components/Pages/NotFound/NotFound.svelte';

	export let url = ''; // This property is necessary declare to avoid ignore the Router

	setupI18n(url)
	$: basepath = `/${$locale}`

</script>

{#if !$isLoadingLocale}
	<Router {basepath} {url}>
		<NavigationBar />
		<div>
			<Route path='about'><About /></Route>
			<Route path='/'><Home /></Route>
			<Route><NotFound /></Route>
		</div>
	</Router>
{:else}
	Loading...
{/if}

<style>
	:global(html) {
		font-family: 'SF Pro Text','SF Pro Icons','Helvetica Neue','Helvetica','Arial',sans-serif;
	}

	@media (min-width: 640px) { }
</style>