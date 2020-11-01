import sveltePreprocess from 'svelte-preprocess'
// this file is needed for svelte for vs code extension to work
const preprocess = sveltePreprocess()

export default {
  preprocess,
}
