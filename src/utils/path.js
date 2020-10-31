import { routerUtils } from 'svelte-routing'

export const relativePath = (fromPath, toPath) => {
    if (!fromPath || fromPath === '/' || fromPath === '') return toPath
    fromPath = routerUtils.stripSlashes(fromPath)
    const dirCount = fromPath.split('/').length
    return '../'.repeat(dirCount) + routerUtils.stripSlashes(toPath)
}

const LOCALE_PATHNAME_REPLACE_REGEX = /^.+?([/]|$)/
export const relativePathToReplaceLocale = (fromPath, locale) => {
    const newPath = fromPath.replace(LOCALE_PATHNAME_REPLACE_REGEX, locale + '/')
    return relativePath(fromPath, newPath)
}
