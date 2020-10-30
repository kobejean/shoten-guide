<script>
    import { Link, LOCATION } from "svelte-routing"
    import { getContext } from 'svelte'
    import { relativePathToReplaceLocale } from "../../services/i18n/i18n"
    import { locale as localeStore } from "svelte-i18n"
  
    export let locale = ""
    export let getProps
    const location = getContext(LOCATION)
    $: {
        console.log('$location.pathname', $location.pathname, locale, relativePathToReplaceLocale($location.pathname, locale))
    }
    $: to = relativePathToReplaceLocale($location.pathname, locale)

    function onClick() {
        localeStore.set(locale)
    }
</script>

<Link {to} {getProps} on:click={onClick}>
    <slot />
</Link>