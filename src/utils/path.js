import { routerUtils } from 'svelte-routing'

// Constants
const LOCALE_PATHNAME_REPLACE_REGEX = /^.+?([/]|$)/

/**
 * Creates a relative path to get from one root-relative path to another.
 *
 * @param {string} basePath - The base path where the returned path will be relative to
 * @param {string} toPath - The path that the relative path will lead to
 * @return {boolean} Returns a relative path to take you from the `basePath` to `toPath`.
 *
 * @example
 * relativePath('/en/about', '/ja/about') // returns '../../ja/about'
 * relativePath('/ja/about', '/ko') // returns '../../ko'
 */
export const relativePath = (basePath, toPath) => {
  // simple cases where relative path is trivial
  if (!basePath || basePath === '/' || basePath === '') return toPath
  // get the number of directories in the path by counting the '/'s (excludeing start & end)
  basePath = routerUtils.stripSlashes(basePath)
  const dirCount = basePath.split('/').length
  return '../'.repeat(dirCount) + routerUtils.stripSlashes(toPath)
}

/**
 * Creates a relative path to use to replace the current locale.
 *
 * @param {string} basePath - The base path where the returned path will be relative to
 * @param {string} locale - The locale that you want to switch to
 * @return {boolean} Returns a relative path to take you to the same path but with a swapped out locale.
 *
 * @example
 * relativePathToReplaceLocale('/en/about', 'ja') // returns '../../ja/about'
 * relativePathToReplaceLocale('/ja/', 'ko') // returns '../ko'
 */

export const relativePathToReplaceLocale = (basePath, locale) => {
  const newPath = basePath.replace(LOCALE_PATHNAME_REPLACE_REGEX, locale + '/')
  const newRelativePath = relativePath(basePath, newPath)
  return routerUtils.stripSlashes(newRelativePath)
}
