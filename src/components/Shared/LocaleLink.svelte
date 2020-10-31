<script>
    import { Link, LOCATION } from "svelte-routing"
    import { getContext } from 'svelte'
    import { relativePathToReplaceLocale } from '../../utils/path'
    import { locale as localeStore } from "svelte-i18n"
  
    export let locale = ""
    export let getProps
    const location = getContext(LOCATION)

    $: to = relativePathToReplaceLocale($location.pathname, locale)

    function onClick(event) {
        event.preventDefault()
        localeStore.set(locale)
    }
</script>

<Link {to} {getProps} on:click={onClick}>
    <slot />
</Link>