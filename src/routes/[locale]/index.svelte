<script>
  import { _ } from 'svelte-i18n'
  import terresaBiker from 'images/terresaBiker.jpg'
</script>

<svelte:head>
  <title>{$_('home.title')}</title>
</svelte:head>

<main>
  <h1>{$_('home.pageName')}</h1>
  <figure>
    <img alt="Success Kid" src={terresaBiker} />
    <figcaption>
      {@html $_('home.welcome')}
    </figcaption>
  </figure>
</main>

<style lang="scss">
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
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
