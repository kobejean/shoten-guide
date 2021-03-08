<script context="module">
  export async function preload(page, session) {
    return this.redirect(302, page.params.locale + '/locations')
  }
</script>

<script>
  import { _ } from 'svelte-i18n'
  import terresaBiker from 'images/terresaBiker.jpg'
</script>

<svelte:head>
  <title>{$_('home.title')}</title>
</svelte:head>

<main>
  <h1>{$_('home.pageName')}</h1>
  <p />
  <figure>
    <img alt="Terresa Biker" src={terresaBiker} />
    <figcaption>
      {@html $_('home.welcome')}
    </figcaption>
  </figure>
</main>

<style lang="scss">
  @import '../../styles/colors';

  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    color: $primary;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
