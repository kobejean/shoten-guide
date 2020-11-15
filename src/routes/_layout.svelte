<script context="module">
  export async function preload(page, session) {
    if (page.path === '/') return this.redirect(302, session.locale + '/')
  }
</script>

<script>
  export let segment
  segment // silence warning
</script>

<slot />

<style lang="scss">
  :global(html) {
    font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
      'Arial', sans-serif;
  }
</style>
