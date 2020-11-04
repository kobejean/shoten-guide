<script>
  import { Link } from 'svelte-routing'
  export let to = '#'

  function getProps({ location, href, isCurrent, isPartiallyCurrent }) {
    const isActive = to === '/' ? isCurrent : isPartiallyCurrent
    return {
      'aria-current': isActive ? 'page' : undefined,
    }
  }
</script>

<Link {to} {getProps}>
  <slot />
</Link>
