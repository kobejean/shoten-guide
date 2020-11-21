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
