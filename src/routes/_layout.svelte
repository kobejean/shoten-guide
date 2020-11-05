<script context="module">
  export async function preload(page, session) {
    if (page.path === '/') return this.redirect(302, 'en')
    return {}
  }
</script>

<script>
  export let segment
</script>

<slot {segment} />

<style lang="scss">
  :global(html) {
    font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
      'Arial', sans-serif;
  }
</style>
