<script>
  import { locale } from 'svelte-i18n'
  import { parent, current } from '../../components/sidebar/store'
</script>

<nav class="crumbs">
  <ol>
    {#if $parent}
      <li>
        <a
          href={`${$locale}${$parent.pathFromLocale}`}
          sapper:noscroll>{$parent.title}</a>
      </li>
    {/if}
    <li>{$current.title}</li>
  </ol>
</nav>

<style lang="scss">
  @import '../../styles/colors';
  nav {
    text-align: center;
    padding: 0 10px;
    border-bottom: 1px solid $border-shadow;

    ol {
      list-style: none;
      padding-left: 0;
      display: inline-flex;

      li {
        a::after {
          display: inline-block;
          color: #000;
          content: '>';
          font-size: 80%;
          font-weight: bold;
          padding: 0 5px;
        }
      }
    }
  }
</style>
