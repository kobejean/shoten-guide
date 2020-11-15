<script>
  import { locale } from 'svelte-i18n'
  import { parent, current } from '../../components/sidebar/store'

  $: items = ($current && Object.values($current.items)) || []
</script>

<aside>
  {#if $parent}
    <a href={`${$locale}${$parent.pathFromLocale}`}>{$parent.title}</a>
  {/if}
  <ul>
    {#each items as item (item.id)}
      <li><a href={`${$locale}${item.pathFromLocale}`}>{item.title}</a></li>
    {/each}
  </ul>
</aside>

<style lang="scss">
  aside {
    height: 100%;
    width: 160px;
    float: left;
    background-color: #ccc;
    padding-top: 20px;
  }
</style>
