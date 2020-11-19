import { writable, derived, get } from 'svelte/store'

export const tree = writable({
  title: 'Cities',
  id: 'cities',
  items: {},
  pathFromLocale: '/locations',
})
export const path = writable()

const getStack = ([$path, $tree]) => {
  let node = $tree
  let stack = [$tree]
  $path.forEach(id => {
    if (!node.items[id]) {
      node.items[id] = {
        id,
        pathFromLocale: `${node.pathFromLocale}/${id}`,
        items: {},
      }
    }
    node = node.items[id]
    stack.push(node)
  })
  return stack
}
export const stack = derived([path, tree], getStack)

const getNodeAtPath = $path => {
  let node = get(tree)
  $path.forEach(id => {
    if (!node.items[id]) {
      node.items[id] = {
        id,
        pathFromLocale: `${node.pathFromLocale}/${id}`,
        items: {},
      }
    }
    node = node.items[id]
  })
  return node
}
const setNodeAtPath = ($path, newNode) => {
  if ($path.length === 0) {
    tree.set(newNode)
  } else {
    const previousNode = getNodeAtPath($path.slice(0, -1))
    const lastNodeId = $path[$path.length - 1]
    previousNode.items[lastNodeId] = newNode
    tree.update($tree => $tree)
  }
}
const updateNodeAtPath = ($path, updater) => {
  setNodeAtPath($path, updater(getNodeAtPath($path)))
}

const getParentFromStack = $stack =>
  $stack.length > 1 ? $stack[$stack.length - 2] : undefined
export const parent = derived(stack, getParentFromStack)

const getCurrentFromStack = $stack =>
  $stack.length > 0 ? $stack[$stack.length - 1] : undefined
export const current = derived(stack, getCurrentFromStack)

export const updateNodeAtPathWithParams = (path, params) => {
  updateNodeAtPath(path, $current => {
    // don't overwrite items that have been loaded already
    const items = { ...$current.items }
    Object.values(params.items).forEach(item => {
      items[item.id] = { ...items[item.id], ...item }
    })
    return Object.assign($current, params, { items })
  })
}

const nodeIsLoaded = (node, locale) => {
  return node && node.region && node.locale === locale
}

export const preloadLocationNode = async (locale, $path, proloadMethods) => {
  $path = ($path && $path.filter(seg => !!seg)) || []
  if (typeof get(path) === 'undefined') {
    path.set($path)
  }

  let locationNode = getNodeAtPath($path)
  if (nodeIsLoaded(locationNode, locale)) return locationNode

  const pathString = $path.reduce((acc, seg) => acc + '/' + seg, '')
  const res = await proloadMethods.fetch(
    `api/locations${pathString}.json?locale=${locale}`
  )

  if (res.status === 200) {
    locationNode = await res.json()
    updateNodeAtPathWithParams($path, locationNode)
    return locationNode
  } else {
    proloadMethods.error(res.status, data.message)
  }
}
