<script context="module">
  export async function preload(page, session) {
    return this.redirect(302, session.locale + '/locations')
  }
</script>
