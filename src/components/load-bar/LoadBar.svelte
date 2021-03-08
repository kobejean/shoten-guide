<script>
  // adapted from: https://github.com/imbolc/sapper-page-loading-bar
  import { stores } from '@sapper/app'
  import { derived } from 'svelte/store'

  const { preloading } = stores()
  const delayedPreloading = derived(
    preloading,
    ($preloading, set) => {
      const timeout = setTimeout(() => set($preloading), 600)
      return () => clearTimeout(timeout)
    },
    false
  )
</script>

{#if $delayedPreloading}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}

<style type="scss">
  @import '../../styles/colors';

  .progress {
    position: fixed;
    top: 0;
    z-index: 1000;
    height: 4px;
    width: 100%;
    border-radius: 2px;
    background-clip: padding-box;
    background-color: $primary;
    overflow: hidden;

    .indeterminate {
      background-color: white;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: inherit;
        will-change: left, right;
        animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
          infinite;
      }

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: inherit;
        will-change: left, right;
        animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
          infinite;
        animation-delay: 1.15s;
      }
    }
  }

  @keyframes indeterminate {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }

  @keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
</style>
