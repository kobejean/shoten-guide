import { debounce } from 'lodash-es'
import { derived } from 'svelte/store'

export const debounced = (store, wait, options) => {
  const debouncer = debounce(($value, set) => set($value), wait, options)
  // must call debouncer indirectly because `derived` needs to check that there are 2 params in function
  // so that it knows to be async
  return derived(store, ($value, set) => debouncer($value, set))
}
