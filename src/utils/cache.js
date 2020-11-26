export const getFromCacheOrFetch = async (caches, key, fetch) => {
  if (caches.has(key)) {
    return caches.get(key)
  }
  const result = await fetch()
  caches.set(key, result)
  return result
}
