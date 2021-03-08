<script>
  import LoadBar from '../components/load-bar/LoadBar.svelte'
  export let segment
  segment // silence warning
</script>

<LoadBar />
<slot />
