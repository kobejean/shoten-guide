<script>
  import { getContext, createEventDispatcher } from 'svelte'
  import { ROUTER, LOCATION, routerUtils } from 'svelte-routing'
  import { relativePathToReplaceLocale } from '../../utils/path'
  import { locale as localeStore } from 'svelte-i18n'

  export let locale = ''

  const { base } = getContext(ROUTER)
  const location = getContext(LOCATION)
  const dispatch = createEventDispatcher()

  let href, isPartiallyCurrent, isCurrent
  $: to = relativePathToReplaceLocale($location.pathname, locale)
  $: href = to === '/' ? $base.uri : routerUtils.resolve(to, $base.uri)
  $: isPartiallyCurrent = routerUtils.startsWith($location.pathname, href)
  $: isCurrent = href === $location.pathname
  $: ariaCurrent = isCurrent || isPartiallyCurrent ? 'page' : undefined

  function onClick(event) {
    dispatch('click', event)

    if (routerUtils.shouldNavigate(event)) {
      event.preventDefault()
      localeStore.set(locale)
    }
  }
</script>

<a {href} aria-current={ariaCurrent} on:click={onClick}>
  <slot />
</a>
