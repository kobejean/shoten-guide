<script context="module">
  import { _, locale } from 'svelte-i18n'
  export function preload({ params, path }) {
    return this.fetch(`${path}.json`)
      .then(r => r.json())
      .then(posts => {
        return { posts }
      })
  }
</script>

<script>
  export let posts
</script>

<svelte:head>
  <title>{$_('blog.title')}</title>
</svelte:head>

<h1>{$_('blog.recentPosts')}</h1>
<ul>
  {#each posts as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
    <li>
      <a rel="prefetch" href="{$locale}/blog/{post.slug}">{post.title}</a>
    </li>
  {/each}
</ul>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>
