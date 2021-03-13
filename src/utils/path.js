/** @module utils/path */
// Constants
const LOCALE_PATHNAME_REPLACE_REGEX = /^.+?([/]|$)/

/**
 * Used to create the same path with different locale for switching locale.
 *
 * @param {string} path - The path that you want to have locale replaced
 * @param {string} locale - The locale that you want to switch to
 * @return {boolean} Returns the same path with a swapped out locale.
 *
 * @example
 * pathWithReplacedLocale('/en/about/', 'ja') // returns '/ja/about/'
 * pathWithReplacedLocale('/ja/', 'ko') // returns '/ko/'
 */

export const pathWithReplacedLocale = (path, locale) => {
  return path.replace(LOCALE_PATHNAME_REPLACE_REGEX, locale + '/')
}
