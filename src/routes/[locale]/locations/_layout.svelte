<script context="module">
  export async function preload(page, session) {
    const res = await this.fetch(`api/content${page.path}`)

    if (res.status === 200) {
      const { data } = await res.json()
      return { data }
    }
    this.error(res.status, res.message)
    return null
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { CONTEXT_KEYS } from '../../../utils/context'
  import Sidebar from '../../../components/sidebar/Sidebar.svelte'
  import Breadcrumbs from '../../../components/breadcrumbs/Breadcrumbs.svelte'
  import Description from './_components/Description.svelte'
  import Results from './_components/Results.svelte'

  export let segment, data
  segment // silence warning

  const highlighted = writable(null)
  const dataStore = writable(data)
  $: dataStore.set(data)

  setContext(CONTEXT_KEYS.LOCATIONS, {
    data: dataStore,
    highlighted,
  })

  $: breadcrumbs = data.breadcrumbs || []
  $: title = data.location.title
  $: description = data.location.description
</script>

<svelte:head>
  <title>{$_('locations.title', { values: { title } })}</title>
</svelte:head>

<header>
  <Breadcrumbs {title} {breadcrumbs} />
</header>
<main>
  <Sidebar />
  <article id="content">
    <Description {title} {description} />
    <slot />
    <Results {title} />
  </article>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-wrap: nowrap;
  }

  #content {
    width: 100%;
  }

  main,
  header {
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 2em;
    max-width: 1400px;
  }

  @media (max-width: 720px) {
    main {
      flex-direction: column;
    }

    main,
    header {
      padding: 0 1em;
    }
  }
</style>
