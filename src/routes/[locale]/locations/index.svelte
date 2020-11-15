<script context="module">
  import { updateNodeAtPath } from '../../../components/sidebar/store'

  export async function preload(page, session) {
    const sidebarItems = {
      kobe: {
        title: 'Kobe',
        id: 'kobe',
        pathFromLocale: `/locations/kobe`,
        items: {},
      },
      aizu: {
        title: 'Aizu',
        id: 'aizu',
        pathFromLocale: `/locations/aizu`,
        items: {},
      },
    }
    return { sidebarItems }
  }
</script>

<script>
  import { locale, _ } from 'svelte-i18n'

  export let sidebarItems

  updateNodeAtPath([], $current => {
    $current.items = sidebarItems
    return $current
  })

  $: pathPrefix = `${$locale}/locations`
</script>

<h1>{$_('locations.pageName')}</h1>
