/**
 * Loads an extarnal javascript file by adding a script tag to head.
 *
 * @async
 * @param {string} src - The url/path to the javascript resource
 * @returns {Promise<ProgressEvent>} a promise returning the onload event
 *
 * @example <caption>Example: Loading MapKit JS</caption>
 * loadScript('https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js', event => alert('Done loading!'))
 */

export async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.head.appendChild(script)
  })
}
