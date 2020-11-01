import dynamicImportPolyfill from 'dynamic-import-polyfill'
import App from './App.svelte'

dynamicImportPolyfill.initialize({
  modulePath: '/public/module', // Defaults to '.'
  importFunctionName: '$$import', // Defaults to '__import__'
})

new App({
  target: document.getElementById('app'),
  hydrate: true,
})
