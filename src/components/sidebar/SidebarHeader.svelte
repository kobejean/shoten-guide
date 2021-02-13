<script>
  import { nth } from 'lodash-es'
  export let stack

  $: current = nth(stack, -1)
  $: parent = nth(stack, -2)
</script>

<header>
  <span class="left">
    {#if parent}
      <a class="btn" href={parent.path} sapper:prefetch sapper:noscroll>
        <svg width="13px" height="19px" viewBox="0 0 13 21">
          <title>back-button-icon</title>
          <defs />
          <g
            id="toolbar-back-button"
            stroke="none"
            stroke-width="1"
            fill-rule="evenodd"
          >
            <g transform="translate(-34.000000, -30.000000)">
              <polygon
                id="ios-back-button-icon"
                points="34 40.5 44.5 30 46.5 32 38 40.5 46.5 49 44.5 51"
              />
            </g>
          </g>
        </svg>
        <span class="label">{parent.title}</span>
      </a>
    {/if}
  </span>
  <h2 style="flex-grow: 3;">{current.title}</h2>
  <span class="right" />
</header>

<style lang="scss">
  @import '../../styles/colors';
  header {
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 0 10px;
    border-bottom: 1px solid $border-shadow;

    a {
      font-weight: bold;
      line-height: 50px;
      text-decoration: none;
      margin-right: 8px;
      svg {
        position: relative;
        top: -2px;
        vertical-align: middle;
        margin-right: 2px;
      }
    }

    h2 {
      text-align: center;
      margin: 0;
      font-size: inherit;
      line-height: 50px;
    }

    > * {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span.left {
      min-width: 70px;
    }
    span.right {
      flex-basis: 70px;
      flex-shrink: 10000;
    }
  }
</style>
